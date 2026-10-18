import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import {
    FaArchive,
    FaArrowLeft,
    FaBell,
    FaBellSlash,
    FaBolt,
    FaCheck,
    FaCheckDouble,
    FaComments,
    FaDownload,
    FaExclamationTriangle,
    FaFingerprint,
    FaKey,
    FaLock,
    FaPaperPlane,
    FaShieldAlt,
    FaSignOutAlt,
    FaTrash,
    FaVolumeMute,
    FaVolumeUp,
} from "react-icons/fa";
import { contactStyles, dmStyles, inboxStyles } from "~/styles/components";
import type { AdminPresence, ChatMessage, ChatThread, PasskeyCredential, WsServerEvent } from "~/utils/dm-types";

type PublicPasskey = Omit<PasskeyCredential, "publicKeySpki">;

interface AdminInboxProps {
    initialAuthenticated: boolean;
    initialPresence: AdminPresence;
    initialThreads: ChatThread[];
    initialVapidPublicKey: string;
    initialPasskeys: PublicPasskey[];
    initialPushCount: number;
    passkeysCount: number;
    hasStoredPasscode: boolean;
    hasEnvPasscode: boolean;
}

const QUICK_REPLIES = [
    "Hey! I'm online right now — how can I help?",
    "PC diagnostics are $29 flat and waived if you proceed with the repair.",
    "I'd love to help build that. What timeline do you have in mind?",
    "Let me check on that and follow up with you shortly!",
];

function toBase64UrlClient(buffer: ArrayBuffer | Uint8Array): string {
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64UrlClient(base64url: string): Uint8Array {
    const padded = base64url.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((base64url.length + 3) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

function playAdminAlertSound() {
    try {
        const AudioCtx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();

        const playNote = (freq: number, startOffset: number, duration: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, ctx.currentTime + startOffset);
            gain.gain.setValueAtTime(0.14, ctx.currentTime + startOffset);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startOffset + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + startOffset);
            osc.stop(ctx.currentTime + startOffset + duration);
        };

        playNote(659.25, 0, 0.14); // E5
        playNote(987.77, 0.12, 0.24); // B5
    } catch {
        // Ignore audio restrictions
    }
}

function formatShortTime(ts: number): string {
    try {
        const d = new Date(ts);
        const now = new Date();
        if (d.toDateString() === now.toDateString()) {
            return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        }
        return d.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
        return "";
    }
}

export function AdminInbox({
    initialAuthenticated,
    initialPresence,
    initialThreads,
    initialVapidPublicKey,
    initialPasskeys,
    initialPushCount,
    passkeysCount: initialPasskeysCount,
    hasStoredPasscode,
    hasEnvPasscode,
}: AdminInboxProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialThreadParam = searchParams.get("thread") || "";

    const [authenticated, setAuthenticated] = useState(initialAuthenticated);
    const [presence, setPresence] = useState<AdminPresence>(initialPresence);
    const [threads, setThreads] = useState<ChatThread[]>(initialThreads);
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
        initialThreadParam || initialThreads[0]?.id || null
    );
    const [messagesByThread, setMessagesByThread] = useState<Record<string, ChatMessage[]>>({});
    const [visitorTypingByThread, setVisitorTypingByThread] = useState<Record<string, boolean>>({});
    const [filterTab, setFilterTab] = useState<"open" | "archived">("open");
    const [mobileShowChat, setMobileShowChat] = useState(Boolean(initialThreadParam));

    // Auth & Security state
    const [passcode, setPasscode] = useState("");
    const [authError, setAuthError] = useState<string | null>(null);
    const [authBusy, setAuthBusy] = useState(false);
    const [passkeys, setPasskeys] = useState<PublicPasskey[]>(initialPasskeys);
    const [vapidPublicKey, setVapidPublicKey] = useState(initialVapidPublicKey);
    const [pushCount, setPushCount] = useState(initialPushCount);
    const [pushEnabledOnDevice, setPushEnabledOnDevice] = useState(false);
    const [securityOpen, setSecurityOpen] = useState(false);
    const [deviceNameInput, setDeviceNameInput] = useState("My Phone (FaceID / TouchID)");
    const [newPasscodeInput, setNewPasscodeInput] = useState("");
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    // Chat composer state
    const [replyText, setReplyText] = useState("");
    const [sendingReply, setSendingReply] = useState(false);
    const [wsConnected, setWsConnected] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // PWA Install Prompt state
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isStandalone, setIsStandalone] = useState(true);

    const wsRef = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const selectedThreadIdRef = useRef<string | null>(selectedThreadId);
    const soundEnabledRef = useRef<boolean>(soundEnabled);

    useEffect(() => {
        selectedThreadIdRef.current = selectedThreadId;
    }, [selectedThreadId]);

    useEffect(() => {
        soundEnabledRef.current = soundEnabled;
    }, [soundEnabled]);

    // Check PWA standalone state & register service worker
    useEffect(() => {
        const standalone =
            window.matchMedia("(display-mode: standalone)").matches || Boolean((window.navigator as any).standalone);
        setIsStandalone(standalone);

        const handleBeforeInstall = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener("beforeinstallprompt", handleBeforeInstall);

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then(async (reg) => {
                    const sub = await reg.pushManager.getSubscription();
                    setPushEnabledOnDevice(Boolean(sub));
                })
                .catch(() => {
                    // Ignore SW registration failure in unsupported contexts
                });
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
        };
    }, []);

    // Update unread badge on app icon and document title
    useEffect(() => {
        if (!authenticated) return;
        const totalUnread = threads.reduce((sum, t) => sum + (t.unreadByAdmin || 0), 0);
        if (totalUnread > 0) {
            document.title = `(${totalUnread}) Inbox — Code Rage`;
        } else {
            document.title = "Inbox — Code Rage";
        }
        if ("setAppBadge" in navigator) {
            try {
                if (totalUnread > 0) {
                    void (navigator as any).setAppBadge(totalUnread);
                } else {
                    void (navigator as any).clearAppBadge();
                }
            } catch {
                // Ignore badge errors
            }
        }
    }, [authenticated, threads]);

    // Connect Admin WebSocket when authenticated
    useEffect(() => {
        if (!authenticated) return;
        let cancelled = false;
        let reconnectTimer: number | null = null;

        function connect() {
            if (cancelled) return;
            const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
            const ws = new WebSocket(`${proto}//${window.location.host}/api/dm/ws?role=admin`);
            wsRef.current = ws;

            ws.onopen = () => {
                if (cancelled) return;
                setWsConnected(true);
                if (selectedThreadIdRef.current) {
                    ws.send(
                        JSON.stringify({
                            type: "get_thread",
                            threadId: selectedThreadIdRef.current,
                        })
                    );
                }
            };

            ws.onmessage = (event) => {
                if (cancelled) return;
                try {
                    const data = JSON.parse(event.data) as WsServerEvent;
                    if (data.type === "admin_init") {
                        setPresence(data.presence);
                        setThreads(data.threads);
                        setVapidPublicKey(data.vapidPublicKey);
                        setPasskeys(data.passkeys);
                        setPushCount(data.pushCount);
                        const targetId = selectedThreadIdRef.current || data.threads[0]?.id || null;
                        if (targetId) {
                            setSelectedThreadId(targetId);
                            ws.send(JSON.stringify({ type: "get_thread", threadId: targetId }));
                        }
                    } else if (data.type === "presence") {
                        setPresence(data.presence);
                        window.dispatchEvent(new CustomEvent("cr:presence", { detail: data.presence }));
                    } else if (data.type === "thread_messages") {
                        setThreads((prev) => {
                            const exists = prev.some((t) => t.id === data.thread.id);
                            if (!exists) return [data.thread, ...prev];
                            return prev.map((t) => (t.id === data.thread.id ? data.thread : t));
                        });
                        setMessagesByThread((prev) => ({
                            ...prev,
                            [data.thread.id]: data.messages,
                        }));
                    } else if (data.type === "message") {
                        setThreads((prev) => {
                            const filtered = prev.filter((t) => t.id !== data.thread.id);
                            return [data.thread, ...filtered];
                        });
                        setMessagesByThread((prev) => {
                            const existing = prev[data.thread.id] || [];
                            if (existing.some((m) => m.id === data.message.id)) return prev;
                            return {
                                ...prev,
                                [data.thread.id]: [...existing, data.message],
                            };
                        });

                        if (data.message.sender === "visitor") {
                            setVisitorTypingByThread((prev) => ({
                                ...prev,
                                [data.thread.id]: false,
                            }));
                            if (soundEnabledRef.current) {
                                playAdminAlertSound();
                            }
                            if (
                                selectedThreadIdRef.current === data.thread.id &&
                                document.visibilityState === "visible" &&
                                ws.readyState === WebSocket.OPEN
                            ) {
                                ws.send(
                                    JSON.stringify({
                                        type: "mark_read",
                                        threadId: data.thread.id,
                                    })
                                );
                            }
                        }
                    } else if (data.type === "thread_updated") {
                        setThreads((prev) => {
                            const exists = prev.some((t) => t.id === data.thread.id);
                            if (!exists) return [data.thread, ...prev];
                            return prev.map((t) => (t.id === data.thread.id ? data.thread : t));
                        });
                    } else if (data.type === "thread_deleted") {
                        setThreads((prev) => prev.filter((t) => t.id !== data.threadId));
                        if (selectedThreadIdRef.current === data.threadId) {
                            setSelectedThreadId(null);
                        }
                    } else if (data.type === "typing") {
                        if (data.sender === "visitor") {
                            setVisitorTypingByThread((prev) => ({
                                ...prev,
                                [data.threadId]: data.isTyping,
                            }));
                        }
                    } else if (data.type === "read") {
                        setThreads((prev) =>
                            prev.map((t) =>
                                t.id === data.threadId && data.reader === "admin" ? { ...t, unreadByAdmin: 0 } : t
                            )
                        );
                        if (data.reader === "visitor") {
                            setMessagesByThread((prev) => ({
                                ...prev,
                                [data.threadId]: (prev[data.threadId] || []).map((m) =>
                                    m.sender === "admin" && !m.readAt ? { ...m, readAt: data.readAt } : m
                                ),
                            }));
                        }
                    }
                } catch {
                    // Ignore malformed frame
                }
            };

            ws.onclose = () => {
                if (cancelled) return;
                setWsConnected(false);
                reconnectTimer = window.setTimeout(connect, 2500);
            };
        }

        connect();

        return () => {
            cancelled = true;
            if (reconnectTimer) window.clearTimeout(reconnectTimer);
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [authenticated]);

    // Fetch selected thread messages & mark read when switching threads
    useEffect(() => {
        if (!authenticated || !selectedThreadId) return;
        const ws = wsRef.current;
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "get_thread", threadId: selectedThreadId }));
            ws.send(JSON.stringify({ type: "mark_read", threadId: selectedThreadId }));
        } else {
            fetch(`/api/dm/thread?threadId=${encodeURIComponent(selectedThreadId)}`)
                .then((r) => (r.ok ? r.json() : null))
                .then((data: any) => {
                    if (data?.messages) {
                        setMessagesByThread((prev) => ({
                            ...prev,
                            [selectedThreadId]: data.messages,
                        }));
                    }
                })
                .catch(() => {});
        }
    }, [authenticated, selectedThreadId]);

    const activeMessages = selectedThreadId ? messagesByThread[selectedThreadId] || [] : [];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [activeMessages.length, selectedThreadId]);

    async function handlePasscodeLogin(e: React.FormEvent) {
        e.preventDefault();
        setAuthError(null);
        setAuthBusy(true);
        try {
            const res = await fetch("/api/dm/passcode-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ passcode }),
            });
            const data = (await res.json()) as {
                ok?: boolean;
                bootstrapped?: boolean;
                error?: string;
            };
            if (!res.ok || !data.ok) {
                throw new Error(data.error || "Invalid passcode");
            }
            if (data.bootstrapped) {
                setStatusMessage(
                    "Initial admin passcode saved! Tap 'Security / Passkey' to register FaceID / TouchID on this phone."
                );
            }
            setAuthenticated(true);
            setPasscode("");
        } catch (err) {
            setAuthError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setAuthBusy(false);
        }
    }

    async function handlePasskeyLogin() {
        setAuthError(null);
        setAuthBusy(true);
        try {
            if (!window.PublicKeyCredential) {
                throw new Error("Passkeys (WebAuthn) are not supported in this browser.");
            }

            const chalRes = await fetch("/api/dm/webauthn-challenge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ purpose: "login" }),
            });
            const chalData = (await chalRes.json()) as {
                challenge?: string;
                allowCredentialIds?: string[];
                rpId?: string;
                error?: string;
            };
            if (!chalRes.ok || !chalData.challenge) {
                throw new Error(chalData.error || "Failed to start Passkey login");
            }

            const allowCredentials: PublicKeyCredentialDescriptor[] = (chalData.allowCredentialIds || []).map((id) => ({
                type: "public-key",
                id: fromBase64UrlClient(id).buffer as ArrayBuffer,
            }));

            const credential = (await navigator.credentials.get({
                publicKey: {
                    challenge: fromBase64UrlClient(chalData.challenge).buffer as ArrayBuffer,
                    rpId: chalData.rpId || window.location.hostname,
                    allowCredentials: allowCredentials.length > 0 ? allowCredentials : undefined,
                    userVerification: "preferred",
                    timeout: 60000,
                },
            })) as PublicKeyCredential | null;

            if (!credential) {
                throw new Error("Passkey authentication was cancelled");
            }

            const assertion = credential.response as AuthenticatorAssertionResponse;
            const loginRes = await fetch("/api/dm/webauthn-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    credentialId: toBase64UrlClient(credential.rawId),
                    clientDataJSON: toBase64UrlClient(assertion.clientDataJSON),
                    authenticatorData: toBase64UrlClient(assertion.authenticatorData),
                    signature: toBase64UrlClient(assertion.signature),
                    challenge: chalData.challenge,
                }),
            });

            const loginData = (await loginRes.json()) as { ok?: boolean; error?: string };
            if (!loginRes.ok || !loginData.ok) {
                throw new Error(loginData.error || "Passkey verification failed");
            }

            setAuthenticated(true);
        } catch (err) {
            setAuthError(err instanceof Error ? err.message : "Passkey login failed");
        } finally {
            setAuthBusy(false);
        }
    }

    async function handleRegisterPasskey() {
        setStatusMessage(null);
        setAuthError(null);
        setAuthBusy(true);
        try {
            if (!window.PublicKeyCredential) {
                throw new Error("Passkeys are not supported on this browser/device.");
            }

            const chalRes = await fetch("/api/dm/webauthn-challenge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ purpose: "register" }),
            });
            const chalData = (await chalRes.json()) as {
                challenge?: string;
                rpId?: string;
                error?: string;
            };
            if (!chalRes.ok || !chalData.challenge) {
                throw new Error(chalData.error || "Could not get registration challenge");
            }

            const userId = new TextEncoder().encode("steace-coderage-admin");
            const credential = (await navigator.credentials.create({
                publicKey: {
                    challenge: fromBase64UrlClient(chalData.challenge).buffer as ArrayBuffer,
                    rp: {
                        name: "Code Rage Direct Inbox",
                        id: chalData.rpId || window.location.hostname,
                    },
                    user: {
                        id: userId.buffer as ArrayBuffer,
                        name: "steace@coderage.pro",
                        displayName: "Steace (Code Rage)",
                    },
                    pubKeyCredParams: [
                        { type: "public-key", alg: -7 }, // ES256
                        { type: "public-key", alg: -257 }, // RS256
                    ],
                    authenticatorSelection: {
                        authenticatorAttachment: "platform",
                        userVerification: "preferred",
                        residentKey: "preferred",
                    },
                    timeout: 60000,
                },
            })) as PublicKeyCredential | null;

            if (!credential) {
                throw new Error("Passkey registration was cancelled");
            }

            const attestation = credential.response as AuthenticatorAttestationResponse & {
                getPublicKey?: () => ArrayBuffer | null;
                getPublicKeyAlgorithm?: () => number;
                getAuthenticatorData?: () => ArrayBuffer;
            };

            const spkiBuffer = attestation.getPublicKey ? attestation.getPublicKey() : null;
            if (!spkiBuffer) {
                throw new Error("Browser did not return SPKI public key for Passkey");
            }
            const algorithm = attestation.getPublicKeyAlgorithm ? attestation.getPublicKeyAlgorithm() : -7;
            const authDataBuffer = attestation.getAuthenticatorData ? attestation.getAuthenticatorData() : undefined;

            const regRes = await fetch("/api/dm/webauthn-register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    credentialId: toBase64UrlClient(credential.rawId),
                    clientDataJSON: toBase64UrlClient(attestation.clientDataJSON),
                    publicKeySpki: toBase64UrlClient(spkiBuffer),
                    algorithm,
                    authenticatorData: authDataBuffer ? toBase64UrlClient(authDataBuffer) : undefined,
                    deviceName: deviceNameInput.trim() || "Mobile Passkey",
                    challenge: chalData.challenge,
                }),
            });

            const regData = (await regRes.json()) as {
                ok?: boolean;
                passkeys?: PublicPasskey[];
                error?: string;
            };
            if (!regRes.ok || !regData.ok) {
                throw new Error(regData.error || "Passkey registration failed");
            }

            if (regData.passkeys) {
                setPasskeys(regData.passkeys);
            }
            setAuthenticated(true);
            setStatusMessage("Passkey registered! You can now sign in with FaceID / TouchID.");
        } catch (err) {
            setAuthError(err instanceof Error ? err.message : "Failed to register Passkey");
        } finally {
            setAuthBusy(false);
        }
    }

    async function handleDeletePasskey(credentialId: string) {
        try {
            const res = await fetch("/api/dm/webauthn-delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credentialId }),
            });
            const data = (await res.json()) as { ok?: boolean; passkeys?: PublicPasskey[] };
            if (res.ok && data.passkeys) {
                setPasskeys(data.passkeys);
                setStatusMessage("Passkey removed.");
            }
        } catch {
            // Ignore
        }
    }

    async function handleUpdatePasscode(e: React.FormEvent) {
        e.preventDefault();
        setStatusMessage(null);
        setAuthError(null);
        try {
            const res = await fetch("/api/dm/passcode-update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPasscode: newPasscodeInput }),
            });
            const data = (await res.json()) as { ok?: boolean; error?: string };
            if (!res.ok || !data.ok) {
                throw new Error(data.error || "Failed to update passcode");
            }
            setNewPasscodeInput("");
            setStatusMessage("Fallback admin passcode updated in Durable Object storage.");
        } catch (err) {
            setAuthError(err instanceof Error ? err.message : "Could not update passcode");
        }
    }

    async function handleToggleAvailability() {
        const nextAvailable = !presence.available;
        const nextStatus = nextAvailable ? "Available" : "Away";
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(
                JSON.stringify({
                    type: "set_availability",
                    available: nextAvailable,
                    statusText: nextStatus,
                })
            );
        } else {
            const res = await fetch("/api/dm/availability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ available: nextAvailable, statusText: nextStatus }),
            });
            const data = (await res.json()) as { presence?: AdminPresence };
            if (data.presence) {
                setPresence(data.presence);
                window.dispatchEvent(new CustomEvent("cr:presence", { detail: data.presence }));
            }
        }
    }

    async function handleTogglePush() {
        setStatusMessage(null);
        setAuthError(null);
        try {
            if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
                throw new Error(
                    "Web Push requires installing this page to your Home Screen (iOS 16.4+) or using a supported mobile browser."
                );
            }

            const reg = await navigator.serviceWorker.ready;
            const existing = await reg.pushManager.getSubscription();

            if (existing) {
                await fetch("/api/dm/push-unsubscribe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ endpoint: existing.endpoint }),
                });
                await existing.unsubscribe();
                setPushEnabledOnDevice(false);
                setPushCount((c) => Math.max(0, c - 1));
                setStatusMessage("Push notifications disabled on this device.");
                return;
            }

            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                throw new Error("Notification permission was not granted.");
            }

            if (!vapidPublicKey) {
                throw new Error("VAPID key is still initializing. Refresh and try again.");
            }

            const sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: fromBase64UrlClient(vapidPublicKey).buffer as ArrayBuffer,
            });

            const subJson = sub.toJSON();
            const res = await fetch("/api/dm/push-subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subscription: {
                        endpoint: sub.endpoint,
                        expirationTime: sub.expirationTime,
                        keys: subJson.keys,
                        deviceLabel: navigator.userAgent.slice(0, 80),
                    },
                }),
            });
            const data = (await res.json()) as { ok?: boolean; pushCount?: number; error?: string };
            if (!res.ok || !data.ok) {
                throw new Error(data.error || "Failed to save Push subscription");
            }

            setPushEnabledOnDevice(true);
            if (typeof data.pushCount === "number") {
                setPushCount(data.pushCount);
            }
            setStatusMessage("Phone Web Push notifications enabled!");
        } catch (err) {
            setAuthError(err instanceof Error ? err.message : "Push setup error");
        }
    }

    async function handleTestPush() {
        setStatusMessage(null);
        try {
            const res = await fetch("/api/dm/push-test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });
            const data = (await res.json()) as { delivered?: number; total?: number };
            setStatusMessage(`Sent test notification (${data.delivered ?? 0}/${data.total ?? 0} devices).`);
        } catch {
            setAuthError("Failed to send test push notification");
        }
    }

    async function handleSendReply(e?: React.FormEvent, overrideText?: string) {
        if (e) e.preventDefault();
        const messageText = (overrideText ?? replyText).trim();
        if (!selectedThreadId || !messageText) return;

        setSendingReply(true);
        try {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(
                    JSON.stringify({
                        type: "send_message",
                        threadId: selectedThreadId,
                        text: messageText,
                    })
                );
            } else {
                const res = await fetch("/api/dm/admin-reply", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        threadId: selectedThreadId,
                        text: messageText,
                    }),
                });
                const data = (await res.json()) as {
                    thread?: ChatThread;
                    message?: ChatMessage;
                    error?: string;
                };
                if (!res.ok || data.error) {
                    throw new Error(data.error || "Failed to send reply");
                }
                if (data.thread && data.message) {
                    const msg = data.message;
                    setMessagesByThread((prev) => ({
                        ...prev,
                        [selectedThreadId]: [...(prev[selectedThreadId] || []), msg],
                    }));
                }
            }
            if (!overrideText) {
                setReplyText("");
            }
        } catch (err) {
            setAuthError(err instanceof Error ? err.message : "Could not send reply");
        } finally {
            setSendingReply(false);
        }
    }

    function handleArchiveThread(thread: ChatThread) {
        const nextStatus = thread.status === "archived" ? "open" : "archived";
        wsRef.current?.send(
            JSON.stringify({
                type: "archive_thread",
                threadId: thread.id,
                status: nextStatus,
            })
        );
    }

    function handleDeleteThread(threadId: string) {
        wsRef.current?.send(
            JSON.stringify({
                type: "delete_thread",
                threadId,
            })
        );
    }

    async function handleLogout() {
        await fetch("/api/dm/logout", { method: "POST" });
        setAuthenticated(false);
    }

    // ---------------------------------------------------------------------------
    // RENDER: UNAUTHENTICATED LOGIN SCREEN (Passkey FaceID/TouchID + Passcode)
    // ---------------------------------------------------------------------------
    if (!authenticated) {
        const isFirstSetup = initialPasskeysCount === 0 && !hasStoredPasscode && !hasEnvPasscode;

        return (
            <div className={inboxStyles.loginCard}>
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                        <FaLock className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            CODE RAGE // MOBILE PWA
                        </span>
                        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                            Direct Message Inbox
                        </h1>
                    </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isFirstSetup
                        ? "First-time setup: Register your phone's Passkey (FaceID / TouchID) or create an initial Admin Passcode to secure your real-time inbox."
                        : "Sign in with your phone's Passkey (FaceID / TouchID) or enter your Admin Passcode."}
                </p>

                {authError && (
                    <div className={contactStyles.errorAlert} role="alert">
                        <p className={contactStyles.errorText}>
                            <FaExclamationTriangle className="shrink-0" />
                            <span>{authError}</span>
                        </p>
                    </div>
                )}

                {/* Primary Biometric Passkey Button */}
                <div className="space-y-2.5">
                    {initialPasskeysCount > 0 ? (
                        <button
                            type="button"
                            onClick={handlePasskeyLogin}
                            disabled={authBusy}
                            className={contactStyles.button}
                        >
                            <FaFingerprint className="w-4 h-4" />
                            <span>
                                {authBusy ? "Verifying Biometrics..." : "Sign In with Passkey (FaceID / TouchID)"}
                            </span>
                        </button>
                    ) : (
                        isFirstSetup && (
                            <button
                                type="button"
                                onClick={handleRegisterPasskey}
                                disabled={authBusy}
                                className={contactStyles.button}
                            >
                                <FaFingerprint className="w-4 h-4" />
                                <span>
                                    {authBusy ? "Setting up Passkey..." : "Setup Phone Passkey (FaceID / TouchID)"}
                                </span>
                            </button>
                        )
                    )}
                </div>

                <div className="relative flex py-1 items-center">
                    <div className="grow border-t border-slate-200 dark:border-slate-800" />
                    <span className="shrink mx-3 text-xs font-mono text-slate-400 uppercase">
                        {initialPasskeysCount > 0 ? "Or Passcode Fallback" : "Admin Passcode"}
                    </span>
                    <div className="grow border-t border-slate-200 dark:border-slate-800" />
                </div>

                {/* Passcode Form */}
                <form onSubmit={handlePasscodeLogin} className="space-y-4">
                    <div>
                        <label htmlFor="admin-passcode" className={contactStyles.label}>
                            {isFirstSetup ? "Create Admin Passcode" : "Admin Passcode"}
                        </label>
                        <input
                            id="admin-passcode"
                            type="password"
                            required
                            autoComplete="current-password"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            placeholder={
                                isFirstSetup ? "Choose a strong passcode..." : "Enter ADMIN_SECRET or passcode..."
                            }
                            className={contactStyles.input}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={authBusy || !passcode.trim()}
                        className="w-full py-3 px-5 rounded-xl bg-slate-900 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        <FaKey className="w-3.5 h-3.5" />
                        <span>{isFirstSetup ? "Save Passcode & Open Inbox" : "Sign In with Passcode"}</span>
                    </button>
                </form>
            </div>
        );
    }

    // ---------------------------------------------------------------------------
    // RENDER: AUTHENTICATED REAL-TIME ADMIN INBOX (Mobile PWA & Desktop)
    // ---------------------------------------------------------------------------
    const selectedThread = threads.find((t) => t.id === selectedThreadId) || null;
    const visibleThreads = threads.filter((t) => t.status === filterTab);
    const openUnreadCount = threads.reduce((acc, t) => acc + (t.unreadByAdmin || 0), 0);

    return (
        <div className={inboxStyles.shell}>
            {/* Top Operational Bar */}
            <div className={inboxStyles.topBar}>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-display font-bold text-xs flex items-center justify-center shadow-2xs">
                        CR
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-base font-display font-bold text-slate-900 dark:text-white">
                                Direct Inbox
                            </h1>
                            {wsConnected && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                                    <FaBolt className="w-2.5 h-2.5" />
                                    LIVE DO
                                </span>
                            )}
                        </div>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                            {openUnreadCount > 0
                                ? `${openUnreadCount} unread message${openUnreadCount === 1 ? "" : "s"}`
                                : "All conversations caught up"}
                        </p>
                    </div>
                </div>

                {/* Action Pills */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Header Pill Availability Toggle */}
                    <button
                        type="button"
                        onClick={handleToggleAvailability}
                        title="Toggle public 'Available' pill in website header"
                        className={`${inboxStyles.pillBtn} ${
                            presence.available
                                ? "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                : "bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                        }`}
                    >
                        <span
                            className={`w-2 h-2 rounded-full ${
                                presence.available ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                            }`}
                        />
                        <span>Header: {presence.available ? "Available" : "Away"}</span>
                    </button>

                    {/* Phone Push Notifications Toggle */}
                    <button
                        type="button"
                        onClick={handleTogglePush}
                        className={`${inboxStyles.pillBtn} ${
                            pushEnabledOnDevice
                                ? "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                        }`}
                    >
                        {pushEnabledOnDevice ? (
                            <>
                                <FaBell className="w-3 h-3 text-blue-500" />
                                <span>Push On ({pushCount})</span>
                            </>
                        ) : (
                            <>
                                <FaBellSlash className="w-3 h-3 text-slate-400" />
                                <span>Enable Push</span>
                            </>
                        )}
                    </button>

                    {/* Sound Toggle */}
                    <button
                        type="button"
                        onClick={() => setSoundEnabled((s) => !s)}
                        className={`${inboxStyles.pillBtn} bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800`}
                        title="Toggle incoming message chime"
                    >
                        {soundEnabled ? (
                            <FaVolumeUp className="w-3.5 h-3.5 text-blue-500" />
                        ) : (
                            <FaVolumeMute className="w-3.5 h-3.5 text-slate-400" />
                        )}
                    </button>

                    {/* Passkeys & Security Drawer Toggle */}
                    <button
                        type="button"
                        onClick={() => setSecurityOpen((o) => !o)}
                        className={`${inboxStyles.pillBtn} ${
                            securityOpen
                                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900"
                                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                        }`}
                    >
                        <FaFingerprint className="w-3.5 h-3.5" />
                        <span>Passkey ({passkeys.length})</span>
                    </button>

                    {deferredPrompt && !isStandalone && (
                        <button
                            type="button"
                            onClick={async () => {
                                deferredPrompt.prompt();
                                await deferredPrompt.userChoice;
                                setDeferredPrompt(null);
                            }}
                            className={`${inboxStyles.pillBtn} bg-blue-600 text-white border-blue-600`}
                        >
                            <FaDownload className="w-3 h-3" />
                            <span>Install App</span>
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleLogout}
                        className={`${inboxStyles.pillBtn} bg-white dark:bg-slate-900 text-slate-500 hover:text-red-600 dark:text-slate-400 border-slate-200 dark:border-slate-800`}
                        title="Sign out"
                    >
                        <FaSignOutAlt className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Status / Error Banner */}
            {(statusMessage || authError) && (
                <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs font-mono">
                    <span
                        className={
                            authError ? "text-red-600 dark:text-red-400" : "text-emerald-700 dark:text-emerald-300"
                        }
                    >
                        {authError || statusMessage}
                    </span>
                    <button
                        type="button"
                        onClick={() => {
                            setStatusMessage(null);
                            setAuthError(null);
                        }}
                        className="text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Collapsible Passkeys, Web Push Test & Security Panel */}
            {securityOpen && (
                <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Passkey Registration */}
                    <div className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <FaFingerprint className="text-blue-500" />
                                <span>Phone Biometric Passkeys (WebAuthn)</span>
                            </h2>
                            {pushEnabledOnDevice && (
                                <button
                                    type="button"
                                    onClick={handleTestPush}
                                    className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                                >
                                    Send Test Push →
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            Register FaceID / TouchID / Fingerprint on this phone so you can log in with a single
                            biometric tap.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={deviceNameInput}
                                onChange={(e) => setDeviceNameInput(e.target.value)}
                                placeholder="Device label (e.g. Steace iPhone)"
                                className={contactStyles.input}
                            />
                            <button
                                type="button"
                                onClick={handleRegisterPasskey}
                                disabled={authBusy}
                                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-semibold shrink-0 cursor-pointer"
                            >
                                + Add Passkey
                            </button>
                        </div>

                        {passkeys.length > 0 && (
                            <ul className="space-y-1.5 pt-2">
                                {passkeys.map((pk) => (
                                    <li
                                        key={pk.id}
                                        className="flex items-center justify-between text-xs font-mono px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800"
                                    >
                                        <span>
                                            {pk.deviceName} • Added {formatShortTime(pk.createdAt)}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleDeletePasskey(pk.id)}
                                            className="text-red-500 hover:underline cursor-pointer"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Fallback Passcode & PWA Help */}
                    <div className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                        <h2 className="text-sm font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <FaShieldAlt className="text-emerald-500" />
                            <span>Fallback Passcode &amp; Mobile PWA Setup</span>
                        </h2>
                        <form onSubmit={handleUpdatePasscode} className="flex gap-2">
                            <input
                                type="password"
                                value={newPasscodeInput}
                                onChange={(e) => setNewPasscodeInput(e.target.value)}
                                placeholder="New fallback passcode (min 6 chars)"
                                className={contactStyles.input}
                            />
                            <button
                                type="submit"
                                disabled={newPasscodeInput.trim().length < 6}
                                className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-mono font-semibold shrink-0 cursor-pointer disabled:opacity-50"
                            >
                                Save
                            </button>
                        </form>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            <strong>Install on Phone:</strong> On iPhone Safari, tap{" "}
                            <span className="font-mono">Share → Add to Home Screen</span>. On Android Chrome, tap{" "}
                            <span className="font-mono">Install App</span>. Then tap{" "}
                            <span className="font-mono">Enable Push</span> above to get lock-screen alerts.
                        </p>
                    </div>
                </div>
            )}

            {/* Main Split Grid: Thread List + Active Chat */}
            <div className={inboxStyles.bodyGrid}>
                {/* Left Pane: Thread List */}
                <div
                    className={`${inboxStyles.sidebar} ${mobileShowChat && selectedThread ? "hidden lg:flex" : "flex"}`}
                >
                    <div className="p-3 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                        <div className="flex rounded-lg bg-slate-200/70 dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-800 w-full">
                            <button
                                type="button"
                                onClick={() => setFilterTab("open")}
                                className={`flex-1 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer ${
                                    filterTab === "open"
                                        ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs"
                                        : "text-slate-600 dark:text-slate-400"
                                }`}
                            >
                                Open ({threads.filter((t) => t.status === "open").length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilterTab("archived")}
                                className={`flex-1 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer ${
                                    filterTab === "archived"
                                        ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs"
                                        : "text-slate-600 dark:text-slate-400"
                                }`}
                            >
                                Archived ({threads.filter((t) => t.status === "archived").length})
                            </button>
                        </div>
                    </div>

                    <div className="grow overflow-y-auto divide-y divide-slate-200/60 dark:divide-slate-800/70">
                        {visibleThreads.length === 0 ? (
                            <div className="p-8 text-center space-y-2">
                                <FaComments className="w-7 h-7 text-slate-300 dark:text-slate-700 mx-auto" />
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    No {filterTab} conversations yet
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">
                                    New direct messages from /contact will appear here instantaneously.
                                </p>
                            </div>
                        ) : (
                            visibleThreads.map((t) => {
                                const isSelected = t.id === selectedThreadId;
                                const isTyping = visitorTypingByThread[t.id];
                                return (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedThreadId(t.id);
                                            setMobileShowChat(true);
                                            setSearchParams({ thread: t.id }, { replace: true });
                                        }}
                                        className={`${inboxStyles.threadItem} ${
                                            isSelected ? inboxStyles.threadItemActive : ""
                                        }`}
                                    >
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`w-2 h-2 rounded-full shrink-0 ${
                                                        t.visitorOnline
                                                            ? "bg-emerald-500"
                                                            : "bg-slate-300 dark:bg-slate-700"
                                                    }`}
                                                    title={
                                                        t.visitorOnline ? "Visitor is online now" : "Visitor offline"
                                                    }
                                                />
                                                <span className="text-sm font-display font-bold text-slate-900 dark:text-white truncate">
                                                    {t.visitorName}
                                                </span>
                                                {t.unreadByAdmin > 0 && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-600 text-white">
                                                        {t.unreadByAdmin}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400 truncate">
                                                {t.topic}
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                {isTyping ? (
                                                    <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                                                        Typing...
                                                    </span>
                                                ) : (
                                                    t.lastMessagePreview
                                                )}
                                            </p>
                                        </div>
                                        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
                                            {formatShortTime(t.updatedAt)}
                                        </span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Pane: Active Conversation */}
                <div
                    className={`${inboxStyles.chatPane} ${
                        !mobileShowChat && selectedThread ? "hidden lg:flex" : "flex"
                    }`}
                >
                    {!selectedThread ? (
                        <div className="grow flex flex-col items-center justify-center p-8 text-center space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                <FaComments className="w-6 h-6" />
                            </div>
                            <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">
                                Select a conversation
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                                Choose a thread on the left to read and reply in real time.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Thread Header */}
                            <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 bg-white dark:bg-slate-900">
                                <div className="flex items-center gap-3 min-w-0">
                                    <button
                                        type="button"
                                        onClick={() => setMobileShowChat(false)}
                                        className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                                        aria-label="Back to threads"
                                    >
                                        <FaArrowLeft className="w-3.5 h-3.5" />
                                    </button>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-sm sm:text-base font-display font-bold text-slate-900 dark:text-white truncate">
                                                {selectedThread.visitorName}
                                            </h2>
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                                                    selectedThread.visitorOnline
                                                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                                                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                                }`}
                                            >
                                                {selectedThread.visitorOnline ? "Visitor Live" : "Offline"}
                                            </span>
                                        </div>
                                        <div className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                                            <span>{selectedThread.topic}</span>
                                            {selectedThread.visitorContact && (
                                                <span> • {selectedThread.visitorContact}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => handleArchiveThread(selectedThread)}
                                        className="px-3 py-1.5 rounded-xl text-xs font-mono bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <FaArchive className="w-3 h-3" />
                                        <span>{selectedThread.status === "archived" ? "Reopen" : "Archive"}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteThread(selectedThread.id)}
                                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 cursor-pointer"
                                        title="Delete conversation"
                                    >
                                        <FaTrash className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Thread Messages */}
                            <div className="grow p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[52vh] bg-slate-50/40 dark:bg-slate-950/40 flex flex-col">
                                {activeMessages.map((m) => {
                                    const isAdminMsg = m.sender === "admin";
                                    return (
                                        <div
                                            key={m.id}
                                            className={isAdminMsg ? dmStyles.msgRowVisitor : dmStyles.msgRowAdmin}
                                        >
                                            <div className={isAdminMsg ? dmStyles.bubbleVisitor : dmStyles.bubbleAdmin}>
                                                {m.text}
                                            </div>
                                            <div className={dmStyles.msgMeta}>
                                                <span>{isAdminMsg ? "You (Steace)" : m.senderName}</span>
                                                <span>•</span>
                                                <span>{formatShortTime(m.createdAt)}</span>
                                                {isAdminMsg && (
                                                    <span>
                                                        {m.readAt ? (
                                                            <FaCheckDouble className="w-2.5 h-2.5 text-blue-500" />
                                                        ) : (
                                                            <FaCheck className="w-2.5 h-2.5 text-slate-400" />
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {visitorTypingByThread[selectedThread.id] && (
                                    <div className={dmStyles.typingRow}>
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                        <span>{selectedThread.visitorName} is typing...</span>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Quick Replies + Composer */}
                            <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                                    {QUICK_REPLIES.map((qr) => (
                                        <button
                                            key={qr}
                                            type="button"
                                            onClick={() => void handleSendReply(undefined, qr)}
                                            className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/60 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 border border-slate-200/80 dark:border-slate-700 whitespace-nowrap shrink-0 cursor-pointer"
                                        >
                                            {qr}
                                        </button>
                                    ))}
                                </div>

                                <form onSubmit={(e) => void handleSendReply(e)} className={dmStyles.composerRow}>
                                    <textarea
                                        rows={2}
                                        value={replyText}
                                        onChange={(e) => {
                                            setReplyText(e.target.value);
                                            if (wsRef.current?.readyState === WebSocket.OPEN && selectedThread) {
                                                wsRef.current.send(
                                                    JSON.stringify({
                                                        type: "typing",
                                                        threadId: selectedThread.id,
                                                        isTyping: e.target.value.trim().length > 0,
                                                    })
                                                );
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                if (replyText.trim() && !sendingReply) {
                                                    void handleSendReply(e);
                                                }
                                            }
                                        }}
                                        placeholder={`Reply to ${selectedThread.visitorName}...`}
                                        className={dmStyles.composerInput}
                                    />
                                    <button
                                        type="submit"
                                        disabled={sendingReply || !replyText.trim()}
                                        className={dmStyles.sendBtn}
                                    >
                                        <span>Send</span>
                                        <FaPaperPlane className="w-3.5 h-3.5" />
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
