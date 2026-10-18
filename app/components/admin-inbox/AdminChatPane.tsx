import type React from "react";
import { FaArchive, FaArrowLeft, FaCheck, FaCheckDouble, FaComments, FaPaperPlane, FaTrash } from "react-icons/fa";
import { dmStyles, inboxStyles } from "~/styles/components";
import type { ChatMessage, ChatThread } from "~/utils/dm-types";
import { QUICK_REPLIES, formatShortTime } from "./utils";

interface AdminChatPaneProps {
    selectedThread: ChatThread | null;
    messages: ChatMessage[];
    isVisitorTyping: boolean;
    replyText: string;
    sendingReply: boolean;
    mobileShowChat: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    onBackToThreads: () => void;
    onArchiveThread: (thread: ChatThread) => void;
    onDeleteThread: (threadId: string) => void;
    onReplyTextChange: (text: string) => void;
    onSendReply: (e?: React.SyntheticEvent, overrideText?: string) => void;
}

export function AdminChatPane({
    selectedThread,
    messages,
    isVisitorTyping,
    replyText,
    sendingReply,
    mobileShowChat,
    messagesEndRef,
    onBackToThreads,
    onArchiveThread,
    onDeleteThread,
    onReplyTextChange,
    onSendReply,
}: AdminChatPaneProps) {
    return (
        <div className={`${inboxStyles.chatPane} ${mobileShowChat && selectedThread ? "flex" : "hidden lg:flex"}`}>
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
                                onClick={onBackToThreads}
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
                                    {selectedThread.visitorContact && <span> • {selectedThread.visitorContact}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={() => onArchiveThread(selectedThread)}
                                className="px-3 py-1.5 rounded-xl text-xs font-mono bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5 cursor-pointer"
                            >
                                <FaArchive className="w-3 h-3" />
                                <span>{selectedThread.status === "archived" ? "Reopen" : "Archive"}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => onDeleteThread(selectedThread.id)}
                                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 cursor-pointer"
                                title="Delete conversation"
                            >
                                <FaTrash className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Thread Messages */}
                    <div className="grow p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[52vh] bg-slate-50/40 dark:bg-slate-950/40 flex flex-col">
                        {messages.map((m) => {
                            const isAdminMsg = m.sender === "admin";
                            return (
                                <div key={m.id} className={isAdminMsg ? dmStyles.msgRowVisitor : dmStyles.msgRowAdmin}>
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

                        {isVisitorTyping && (
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
                                    onClick={() => void onSendReply(undefined, qr)}
                                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/60 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 border border-slate-200/80 dark:border-slate-700 whitespace-nowrap shrink-0 cursor-pointer"
                                >
                                    {qr}
                                </button>
                            ))}
                        </div>

                        <div className={dmStyles.composerRow}>
                            <textarea
                                rows={2}
                                value={replyText}
                                onChange={(e) => onReplyTextChange(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        if (replyText.trim() && !sendingReply) {
                                            void onSendReply(e);
                                        }
                                    }
                                }}
                                placeholder={`Reply to ${selectedThread.visitorName}...`}
                                className={dmStyles.composerInput}
                            />
                            <button
                                type="button"
                                onClick={() => void onSendReply()}
                                disabled={sendingReply || !replyText.trim()}
                                className={dmStyles.sendBtn}
                            >
                                <span>Send</span>
                                <FaPaperPlane className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
