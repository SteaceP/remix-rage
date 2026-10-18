import { FaComments } from "react-icons/fa";
import { inboxStyles } from "~/styles/components";
import type { ChatThread } from "~/utils/dm-types";
import type { InboxFilterTab } from "./types";
import { formatShortTime } from "./utils";

interface AdminThreadListProps {
    threads: ChatThread[];
    filterTab: InboxFilterTab;
    selectedThreadId: string | null;
    visitorTypingByThread: Record<string, boolean>;
    mobileShowChat: boolean;
    hasSelectedThread: boolean;
    onFilterChange: (tab: InboxFilterTab) => void;
    onSelectThread: (threadId: string) => void;
}

export function AdminThreadList({
    threads,
    filterTab,
    selectedThreadId,
    visitorTypingByThread,
    mobileShowChat,
    hasSelectedThread,
    onFilterChange,
    onSelectThread,
}: AdminThreadListProps) {
    const visibleThreads = threads.filter((t) => t.status === filterTab);

    return (
        <div className={`${inboxStyles.sidebar} ${mobileShowChat && hasSelectedThread ? "hidden lg:flex" : "flex"}`}>
            <div className="p-3 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex rounded-lg bg-slate-200/70 dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-800 w-full">
                    <button
                        type="button"
                        onClick={() => onFilterChange("open")}
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
                        onClick={() => onFilterChange("archived")}
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
                                onClick={() => onSelectThread(t.id)}
                                className={`${inboxStyles.threadItem} ${
                                    isSelected ? inboxStyles.threadItemActive : ""
                                }`}
                            >
                                <div className="min-w-0 flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`w-2 h-2 rounded-full shrink-0 ${
                                                t.visitorOnline ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                                            }`}
                                            title={t.visitorOnline ? "Visitor is online now" : "Visitor offline"}
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
    );
}
