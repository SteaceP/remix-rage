import { useEffect, useRef, useState } from "react";
import type { AdminPresence, ChatMessage, ChatThread, WsServerEvent } from "~/utils/dm-types";
import type { PublicPasskey } from "./types";
import { playAdminAlertSound } from "./utils";

export interface UseAdminInboxSocketOptions {
    authenticated: boolean;
    selectedThreadId: string | null;
    soundEnabled: boolean;
    initialPresence: AdminPresence;
    initialThreads: ChatThread[];
    onSyncMeta?: (data: { vapidPublicKey: string; passkeys: PublicPasskey[]; pushCount: number }) => void;
    onAutoSelectThread?: (threadId: string | null) => void;
}

export function useAdminInboxSocket({
    authenticated,
    selectedThreadId,
    soundEnabled,
    initialPresence,
    initialThreads,
    onSyncMeta,
    onAutoSelectThread,
}: UseAdminInboxSocketOptions) {
    const [presence, setPresence] = useState<AdminPresence>(initialPresence);
    const [threads, setThreads] = useState<ChatThread[]>(initialThreads);
    const [messagesByThread, setMessagesByThread] = useState<Record<string, ChatMessage[]>>({});
    const [visitorTypingByThread, setVisitorTypingByThread] = useState<Record<string, boolean>>({});
    const [wsConnected, setWsConnected] = useState(false);

    const wsRef = useRef<WebSocket | null>(null);
    const selectedThreadIdRef = useRef<string | null>(selectedThreadId);
    const soundEnabledRef = useRef<boolean>(soundEnabled);

    useEffect(() => {
        selectedThreadIdRef.current = selectedThreadId;
    }, [selectedThreadId]);

    useEffect(() => {
        soundEnabledRef.current = soundEnabled;
    }, [soundEnabled]);

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
                        onSyncMeta?.({
                            vapidPublicKey: data.vapidPublicKey,
                            passkeys: data.passkeys,
                            pushCount: data.pushCount,
                        });
                        const targetId = selectedThreadIdRef.current || data.threads[0]?.id || null;
                        if (targetId) {
                            onAutoSelectThread?.(targetId);
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
                            onAutoSelectThread?.(null);
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

    async function handleSendReply(threadId: string, text: string): Promise<void> {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(
                JSON.stringify({
                    type: "send_message",
                    threadId,
                    text,
                })
            );
        } else {
            const res = await fetch("/api/dm/admin-reply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    threadId,
                    text,
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
                    [threadId]: [...(prev[threadId] || []), msg],
                }));
            }
        }
    }

    function sendTyping(threadId: string, isTyping: boolean) {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(
                JSON.stringify({
                    type: "typing",
                    threadId,
                    isTyping,
                })
            );
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

    return {
        presence,
        setPresence,
        threads,
        setThreads,
        messagesByThread,
        setMessagesByThread,
        visitorTypingByThread,
        wsConnected,
        handleToggleAvailability,
        handleSendReply,
        sendTyping,
        handleArchiveThread,
        handleDeleteThread,
    };
}
