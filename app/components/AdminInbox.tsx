import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { inboxStyles } from "~/styles/components";
import { AdminChatPane } from "./admin-inbox/AdminChatPane";
import { AdminLoginCard } from "./admin-inbox/AdminLoginCard";
import { AdminSecurityPanel } from "./admin-inbox/AdminSecurityPanel";
import { AdminThreadList } from "./admin-inbox/AdminThreadList";
import { AdminTopBar } from "./admin-inbox/AdminTopBar";
import type { AdminInboxProps, InboxFilterTab } from "./admin-inbox/types";
import { useAdminAuth } from "./admin-inbox/useAdminAuth";
import { useAdminInboxSocket } from "./admin-inbox/useAdminInboxSocket";
import { useAdminPush } from "./admin-inbox/useAdminPush";

export type { AdminInboxProps, PublicPasskey } from "./admin-inbox/types";

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

    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
        initialThreadParam || initialThreads[0]?.id || null
    );
    const [filterTab, setFilterTab] = useState<InboxFilterTab>("open");
    const [mobileShowChat, setMobileShowChat] = useState(Boolean(initialThreadParam));
    const [vapidPublicKey, setVapidPublicKey] = useState(initialVapidPublicKey);
    const [securityOpen, setSecurityOpen] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Chat composer state
    const [replyText, setReplyText] = useState("");
    const [sendingReply, setSendingReply] = useState(false);

    // PWA Install Prompt state
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isStandalone, setIsStandalone] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Security & Auth Hook
    const auth = useAdminAuth({
        initialAuthenticated,
        initialPasskeys,
    });

    // Web Push Hook
    const push = useAdminPush({
        vapidPublicKey,
        initialPushCount,
    });

    // Real-time WebSocket & Thread/Message State Hook
    const socket = useAdminInboxSocket({
        authenticated: auth.authenticated,
        selectedThreadId,
        soundEnabled,
        initialPresence,
        initialThreads,
        onError: (err) => {
            auth.setAuthError(err);
        },
        onSyncMeta: (data) => {
            setVapidPublicKey(data.vapidPublicKey);
            auth.setPasskeys(data.passkeys);
            push.setPushCount(data.pushCount);
        },
        onAutoSelectThread: (threadId) => {
            setSelectedThreadId(threadId);
        },
    });

    // Check PWA standalone state
    useEffect(() => {
        const standalone =
            window.matchMedia("(display-mode: standalone)").matches || Boolean((window.navigator as any).standalone);
        setIsStandalone(standalone);

        const handleBeforeInstall = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener("beforeinstallprompt", handleBeforeInstall);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
        };
    }, []);

    // Update unread badge on app icon and document title
    useEffect(() => {
        if (!auth.authenticated) return;
        const totalUnread = socket.threads.reduce((sum, t) => sum + (t.unreadByAdmin || 0), 0);
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
    }, [auth.authenticated, socket.threads]);

    const activeMessages = selectedThreadId ? socket.messagesByThread[selectedThreadId] || [] : [];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [activeMessages.length, selectedThreadId]);

    async function handleSendReply(e?: React.SyntheticEvent, overrideText?: string) {
        if (e) e.preventDefault();
        const messageText = (overrideText ?? replyText).trim();
        if (!selectedThreadId || !messageText) return;

        setSendingReply(true);
        try {
            await socket.handleSendReply(selectedThreadId, messageText);
            if (!overrideText) {
                setReplyText("");
            }
        } catch (err) {
            auth.setAuthError(err instanceof Error ? err.message : "Could not send reply");
        } finally {
            setSendingReply(false);
        }
    }

    // Render: Unauthenticated Login Screen
    if (!auth.authenticated) {
        const currentPasskeysCount = Math.max(initialPasskeysCount, auth.passkeys.length);
        const isFirstSetup = currentPasskeysCount === 0 && !hasStoredPasscode && !hasEnvPasscode;

        return (
            <AdminLoginCard
                isFirstSetup={isFirstSetup}
                initialPasskeysCount={currentPasskeysCount}
                authError={auth.authError}
                authBusy={auth.authBusy}
                passcode={auth.passcode}
                onPasscodeChange={auth.setPasscode}
                onPasscodeLogin={auth.handlePasscodeLogin}
                onPasskeyLogin={auth.handlePasskeyLogin}
                onRegisterPasskey={auth.handleRegisterPasskey}
            />
        );
    }

    // Render: Authenticated Real-Time Admin Inbox
    const selectedThread = socket.threads.find((t) => t.id === selectedThreadId) || null;
    const openUnreadCount = socket.threads.reduce((acc, t) => acc + (t.unreadByAdmin || 0), 0);

    return (
        <div className={inboxStyles.shell}>
            <AdminTopBar
                wsConnected={socket.wsConnected}
                openUnreadCount={openUnreadCount}
                presence={socket.presence}
                pushEnabledOnDevice={push.pushEnabledOnDevice}
                pushCount={push.pushCount}
                soundEnabled={soundEnabled}
                securityOpen={securityOpen}
                passkeysCount={auth.passkeys.length}
                deferredPrompt={deferredPrompt}
                isStandalone={isStandalone}
                statusMessage={auth.statusMessage}
                authError={auth.authError}
                onToggleAvailability={socket.handleToggleAvailability}
                onTogglePush={() => push.handleTogglePush(auth.setStatusMessage, auth.setAuthError)}
                onToggleSound={() => setSoundEnabled((s) => !s)}
                onToggleSecurity={() => setSecurityOpen((o) => !o)}
                onInstallApp={async () => {
                    if (deferredPrompt) {
                        deferredPrompt.prompt();
                        await deferredPrompt.userChoice;
                        setDeferredPrompt(null);
                    }
                }}
                onLogout={auth.handleLogout}
                onDismissStatus={() => {
                    auth.setStatusMessage(null);
                    auth.setAuthError(null);
                }}
            />

            {securityOpen && (
                <AdminSecurityPanel
                    pushEnabledOnDevice={push.pushEnabledOnDevice}
                    authBusy={auth.authBusy}
                    deviceNameInput={auth.deviceNameInput}
                    newPasscodeInput={auth.newPasscodeInput}
                    passkeys={auth.passkeys}
                    onDeviceNameChange={auth.setDeviceNameInput}
                    onNewPasscodeChange={auth.setNewPasscodeInput}
                    onRegisterPasskey={auth.handleRegisterPasskey}
                    onDeletePasskey={auth.handleDeletePasskey}
                    onUpdatePasscode={auth.handleUpdatePasscode}
                    onTestPush={() => push.handleTestPush(auth.setStatusMessage, auth.setAuthError)}
                />
            )}

            <div className={inboxStyles.bodyGrid}>
                <AdminThreadList
                    threads={socket.threads}
                    filterTab={filterTab}
                    selectedThreadId={selectedThreadId}
                    visitorTypingByThread={socket.visitorTypingByThread}
                    mobileShowChat={mobileShowChat}
                    hasSelectedThread={Boolean(selectedThread)}
                    onFilterChange={setFilterTab}
                    onSelectThread={(threadId) => {
                        setSelectedThreadId(threadId);
                        setMobileShowChat(true);
                        setSearchParams({ thread: threadId }, { replace: true });
                    }}
                />

                <AdminChatPane
                    selectedThread={selectedThread}
                    messages={activeMessages}
                    isVisitorTyping={Boolean(selectedThread && socket.visitorTypingByThread[selectedThread.id])}
                    replyText={replyText}
                    sendingReply={sendingReply}
                    mobileShowChat={mobileShowChat}
                    messagesEndRef={messagesEndRef}
                    onBackToThreads={() => setMobileShowChat(false)}
                    onArchiveThread={socket.handleArchiveThread}
                    onDeleteThread={socket.handleDeleteThread}
                    onReplyTextChange={(val) => {
                        setReplyText(val);
                        if (selectedThread) {
                            socket.sendTyping(selectedThread.id, val.trim().length > 0);
                        }
                    }}
                    onSendReply={handleSendReply}
                />
            </div>
        </div>
    );
}

export default AdminInbox;
