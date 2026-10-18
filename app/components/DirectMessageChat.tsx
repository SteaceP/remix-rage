import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { FaBolt, FaCheck, FaCheckDouble, FaExclamationTriangle, FaPaperPlane, FaPlus, FaUser } from "react-icons/fa";
import { contactStyles, dmStyles } from "~/styles/components";
import type { AdminPresence, ChatMessage, ChatThread, WsServerEvent } from "~/utils/dm-types";

const STORAGE_KEY = "cr_dm_session_v1";

const QUICK_TOPICS = [
    "Website Development",
    "Cross-Platform App",
    "Computer Repair",
    "Family Tech Support",
    "General Inquiry",
];

interface StoredVisitorSession {
    threadId: string;
    visitorToken: string;
    visitorName: string;
    visitorContact?: string;
    topic: string;
}

function playIncomingChime() {
    try {
        const AudioCtx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.28);
    } catch {
        // Ignore audio autoplay restrictions
    }
}

function formatTime(ts: number): string {
    try {
        return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
        return "";
    }
}

interface DirectMessageChatProps {
    initialPresence: AdminPresence;
}

export function DirectMessageChat({ initialPresence }: DirectMessageChatProps) {
    const [searchParams] = useSearchParams();
    const serviceParam = searchParams.get("service") || "";

    const [session, setSession] = useState<StoredVisitorSession | null>(null);
    const [presence, setPresence] = useState<AdminPresence>(initialPresence);
    const [thread, setThread] = useState<ChatThread | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [wsConnected, setWsConnected] = useState(false);
    const [adminTyping, setAdminTyping] = useState(false);

    const [visitorName, setVisitorName] = useState("");
    const [visitorContact, setVisitorContact] = useState("");
    const [topic, setTopic] = useState(serviceParam || "Website Development");
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const typingTimeoutRef = useRef<number | null>(null);

    // Load saved visitor session from localStorage
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as StoredVisitorSession;
                if (parsed?.threadId && parsed?.visitorToken) {
                    setSession(parsed);
                    setVisitorName(parsed.visitorName || "");
                    setVisitorContact(parsed.visitorContact || "");
                    if (!serviceParam && parsed.topic) {
                        setTopic(parsed.topic);
                    }
                }
            }
        } catch {
            // Ignore storage errors
        }
    }, [serviceParam]);

    useEffect(() => {
        if (serviceParam) {
            setTopic(serviceParam);
        }
    }, [serviceParam]);

    // Scroll to bottom when messages or typing indicator changes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [messages.length, adminTyping]);

    // Connect WebSocket to Durable Object
    useEffect(() => {
        let cancelled = false;
        let reconnectTimer: number | null = null;

        function connect() {
            if (cancelled) return;
            const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
            const params = new URLSearchParams({ role: "visitor" });
            if (session?.threadId && session?.visitorToken) {
                params.set("threadId", session.threadId);
                params.set("token", session.visitorToken);
            }

            const ws = new WebSocket(`${proto}//${window.location.host}/api/dm/ws?${params.toString()}`);
            wsRef.current = ws;

            ws.onopen = () => {
                if (cancelled) return;
                setWsConnected(true);
                if (session?.threadId) {
                    ws.send(JSON.stringify({ type: "mark_read", threadId: session.threadId }));
                }
            };

            ws.onmessage = (event) => {
                if (cancelled) return;
                try {
                    const data = JSON.parse(event.data) as WsServerEvent;
                    if (data.type === "visitor_init") {
                        setPresence(data.presence);
                        if (data.thread) {
                            setThread(data.thread);
                            setMessages(data.messages);
                        }
                    } else if (data.type === "presence") {
                        setPresence(data.presence);
                        // Also notify the Header availability pill
                        window.dispatchEvent(new CustomEvent("cr:presence", { detail: data.presence }));
                    } else if (data.type === "message") {
                        setThread(data.thread);
                        setMessages((prev) => {
                            if (prev.some((m) => m.id === data.message.id)) return prev;
                            return [...prev, data.message];
                        });
                        if (data.message.sender === "admin") {
                            setAdminTyping(false);
                            playIncomingChime();
                            if (ws.readyState === WebSocket.OPEN) {
                                ws.send(
                                    JSON.stringify({
                                        type: "mark_read",
                                        threadId: data.thread.id,
                                    })
                                );
                            }
                        }
                    } else if (data.type === "typing") {
                        if (data.sender === "admin") {
                            setAdminTyping(data.isTyping);
                        }
                    } else if (data.type === "read") {
                        if (data.reader === "admin") {
                            setMessages((prev) =>
                                prev.map((m) =>
                                    m.sender === "visitor" && !m.readAt ? { ...m, readAt: data.readAt } : m
                                )
                            );
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
    }, [session?.threadId, session?.visitorToken]);

    function handleTextChange(value: string) {
        setText(value);
        if (session?.threadId && wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(
                JSON.stringify({
                    type: "typing",
                    threadId: session.threadId,
                    isTyping: value.trim().length > 0,
                })
            );
            if (typingTimeoutRef.current) {
                window.clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = window.setTimeout(() => {
                if (wsRef.current?.readyState === WebSocket.OPEN && session?.threadId) {
                    wsRef.current.send(
                        JSON.stringify({
                            type: "typing",
                            threadId: session.threadId,
                            isTyping: false,
                        })
                    );
                }
            }, 2500);
        }
    }

    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const trimmedText = text.trim();
        const trimmedName = (visitorName || session?.visitorName || "").trim();
        const trimmedTopic = (topic || session?.topic || "General Inquiry").trim();

        if (!trimmedName) {
            setError("Please enter your name so I know who I'm chatting with.");
            return;
        }
        if (!trimmedText) {
            return;
        }

        setSending(true);
        try {
            // If we already have an authenticated WebSocket attached to this thread, send over WS or HTTP
            const res = await fetch("/api/dm/visitor-message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    threadId: session?.threadId,
                    visitorToken: session?.visitorToken,
                    visitorName: trimmedName,
                    visitorContact: visitorContact.trim(),
                    topic: trimmedTopic,
                    text: trimmedText,
                }),
            });

            const data = (await res.json()) as {
                error?: string;
                thread?: ChatThread;
                message?: ChatMessage;
                threadId?: string;
                visitorToken?: string;
            };

            if (!res.ok || data.error) {
                throw new Error(data.error || "Failed to send message");
            }

            if (data.threadId && data.visitorToken) {
                const updatedSession: StoredVisitorSession = {
                    threadId: data.threadId,
                    visitorToken: data.visitorToken,
                    visitorName: trimmedName,
                    visitorContact: visitorContact.trim() || undefined,
                    topic: trimmedTopic,
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
                if (
                    !session ||
                    session.threadId !== updatedSession.threadId ||
                    session.visitorToken !== updatedSession.visitorToken
                ) {
                    setSession(updatedSession);
                }
            }

            if (data.thread) {
                setThread(data.thread);
            }
            if (data.message) {
                const newMsg = data.message;
                setMessages((prev) => {
                    if (prev.some((m) => m.id === newMsg.id)) return prev;
                    return [...prev, newMsg];
                });
            }

            setText("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not send message");
        } finally {
            setSending(false);
        }
    }

    function handleResetConversation() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            // Ignore
        }
        setSession(null);
        setThread(null);
        setMessages([]);
        setError(null);
    }

    const allTopics =
        serviceParam && !QUICK_TOPICS.some((t) => t.toLowerCase() === serviceParam.toLowerCase())
            ? [serviceParam, ...QUICK_TOPICS]
            : QUICK_TOPICS;

    const isStarted = Boolean(session && messages.length > 0);

    return (
        <div className={dmStyles.card}>
            {/* Top Live Status Bar */}
            <div className={dmStyles.header}>
                <div className={dmStyles.headerLeft}>
                    <div className={dmStyles.avatar}>CR</div>
                    <div className="min-w-0">
                        <div className={dmStyles.headerTitle}>Code Rage Direct Message</div>
                        <div className={dmStyles.headerStatus}>
                            <span className={presence.available ? contactStyles.dotAvailable : contactStyles.dotAway} />
                            <span>
                                {presence.available
                                    ? presence.adminConnected
                                        ? "Online Now • Live Direct Chat"
                                        : "Direct Messaging Active"
                                    : `${presence.statusText || "Away"} • Leave a Direct Message`}
                            </span>
                            {wsConnected && (
                                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 ml-1">
                                    <FaBolt className="w-2.5 h-2.5" />
                                    <span>Realtime</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {isStarted && (
                    <div className={dmStyles.headerActions}>
                        <button
                            type="button"
                            onClick={handleResetConversation}
                            className={dmStyles.resetBtn}
                            title="Start a new conversation topic"
                        >
                            <span className="inline-flex items-center gap-1">
                                <FaPlus className="w-2.5 h-2.5" />
                                <span>New Chat</span>
                            </span>
                        </button>
                    </div>
                )}
            </div>

            {/* Topic Selector Strip */}
            <div className={dmStyles.topicBar}>
                <div className="flex items-center justify-between gap-2">
                    <span className={contactStyles.label}>Topic // Service</span>
                    {thread && (
                        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                            Thread #{thread.id.slice(-6)}
                        </span>
                    )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {allTopics.map((item) => {
                        const selected = topic.toLowerCase() === item.toLowerCase();
                        return (
                            <button
                                key={item}
                                type="button"
                                onClick={() => setTopic(item)}
                                className={selected ? dmStyles.topicChipActive : dmStyles.topicChipInactive}
                            >
                                {item}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Messages Stream */}
            <div className={dmStyles.messagesArea} aria-live="polite">
                <div className={dmStyles.welcomeBox}>
                    <p className="font-semibold text-slate-900 dark:text-white mb-1">Direct Communication Channel</p>
                    <p>
                        Send a message directly to get started on your project, diagnostic, or tech inquiry. We review
                        and respond promptly.
                    </p>
                </div>

                {messages.map((msg) => {
                    const isVisitor = msg.sender === "visitor";
                    return (
                        <div key={msg.id} className={isVisitor ? dmStyles.msgRowVisitor : dmStyles.msgRowAdmin}>
                            <div className={isVisitor ? dmStyles.bubbleVisitor : dmStyles.bubbleAdmin}>{msg.text}</div>
                            <div className={dmStyles.msgMeta}>
                                <span>{isVisitor ? "You" : "Code Rage"}</span>
                                <span>•</span>
                                <span>{formatTime(msg.createdAt)}</span>
                                {isVisitor && (
                                    <span
                                        className={
                                            msg.readAt
                                                ? "text-blue-500 dark:text-blue-400 inline-flex items-center gap-0.5"
                                                : "text-slate-400 inline-flex items-center gap-0.5"
                                        }
                                        title={msg.readAt ? "Read" : "Delivered"}
                                    >
                                        {msg.readAt ? (
                                            <FaCheckDouble className="w-2.5 h-2.5" />
                                        ) : (
                                            <FaCheck className="w-2.5 h-2.5" />
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}

                {adminTyping && (
                    <div className={dmStyles.typingRow}>
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                        <span>Code Rage is typing a reply...</span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Composer */}
            <form onSubmit={handleSend} className={dmStyles.composer}>
                {error && (
                    <div className={contactStyles.errorAlert} role="alert">
                        <p className={contactStyles.errorText}>
                            <FaExclamationTriangle className="shrink-0" />
                            <span>{error}</span>
                        </p>
                    </div>
                )}

                {!isStarted && (
                    <div className={dmStyles.identityGrid}>
                        <div>
                            <label htmlFor="dm-visitor-name" className={contactStyles.label}>
                                Your Name *
                            </label>
                            <input
                                id="dm-visitor-name"
                                type="text"
                                required
                                value={visitorName}
                                onChange={(e) => setVisitorName(e.target.value)}
                                placeholder="e.g. Alex Rivera"
                                className={contactStyles.input}
                            />
                        </div>
                        <div>
                            <label htmlFor="dm-visitor-contact" className={contactStyles.label}>
                                Phone or Email (Optional)
                            </label>
                            <input
                                id="dm-visitor-contact"
                                type="text"
                                value={visitorContact}
                                onChange={(e) => setVisitorContact(e.target.value)}
                                placeholder="In case you step away"
                                className={contactStyles.input}
                            />
                        </div>
                    </div>
                )}

                {isStarted && (
                    <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 px-0.5">
                        <span className="inline-flex items-center gap-1.5">
                            <FaUser className="w-3 h-3 text-blue-500" />
                            <span>Chatting as {session?.visitorName || visitorName}</span>
                        </span>
                        <span>Press Enter to send</span>
                    </div>
                )}

                <div className={dmStyles.composerRow}>
                    <textarea
                        rows={isStarted ? 2 : 3}
                        value={text}
                        onChange={(e) => handleTextChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                if (text.trim() && !sending) {
                                    void handleSend(e);
                                }
                            }
                        }}
                        placeholder={
                            isStarted
                                ? "Write a reply... (Enter to send, Shift+Enter for new line)"
                                : "Hi! Tell me about your project, device issue, or question..."
                        }
                        aria-label="Direct message"
                        required
                        className={dmStyles.composerInput}
                    />
                    <button type="submit" disabled={sending || !text.trim()} className={dmStyles.sendBtn}>
                        <span>{sending ? "Sending..." : "Send"}</span>
                        <FaPaperPlane className="w-3.5 h-3.5" />
                    </button>
                </div>
            </form>
        </div>
    );
}
