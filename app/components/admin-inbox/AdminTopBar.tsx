import {
    FaBell,
    FaBellSlash,
    FaBolt,
    FaDownload,
    FaFingerprint,
    FaSignOutAlt,
    FaVolumeMute,
    FaVolumeUp,
} from "react-icons/fa";
import { inboxStyles } from "~/styles/components";
import type { AdminPresence } from "~/utils/dm-types";

interface AdminTopBarProps {
    wsConnected: boolean;
    openUnreadCount: number;
    presence: AdminPresence;
    pushEnabledOnDevice: boolean;
    pushCount: number;
    soundEnabled: boolean;
    securityOpen: boolean;
    passkeysCount: number;
    deferredPrompt: any;
    isStandalone: boolean;
    statusMessage: string | null;
    authError: string | null;
    onToggleAvailability: () => void;
    onTogglePush: () => void;
    onToggleSound: () => void;
    onToggleSecurity: () => void;
    onInstallApp: () => void;
    onLogout: () => void;
    onDismissStatus: () => void;
}

export function AdminTopBar({
    wsConnected,
    openUnreadCount,
    presence,
    pushEnabledOnDevice,
    pushCount,
    soundEnabled,
    securityOpen,
    passkeysCount,
    deferredPrompt,
    isStandalone,
    statusMessage,
    authError,
    onToggleAvailability,
    onTogglePush,
    onToggleSound,
    onToggleSecurity,
    onInstallApp,
    onLogout,
    onDismissStatus,
}: AdminTopBarProps) {
    return (
        <>
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
                        onClick={onToggleAvailability}
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
                        onClick={onTogglePush}
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
                        onClick={onToggleSound}
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
                        onClick={onToggleSecurity}
                        className={`${inboxStyles.pillBtn} ${
                            securityOpen
                                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900"
                                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                        }`}
                    >
                        <FaFingerprint className="w-3.5 h-3.5" />
                        <span>Passkey ({passkeysCount})</span>
                    </button>

                    {deferredPrompt && !isStandalone && (
                        <button
                            type="button"
                            onClick={onInstallApp}
                            className={`${inboxStyles.pillBtn} bg-blue-600 text-white border-blue-600`}
                        >
                            <FaDownload className="w-3 h-3" />
                            <span>Install App</span>
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onLogout}
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
                        onClick={onDismissStatus}
                        className="text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    >
                        Dismiss
                    </button>
                </div>
            )}
        </>
    );
}
