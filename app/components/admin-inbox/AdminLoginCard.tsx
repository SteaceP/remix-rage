import type React from "react";
import { FaExclamationTriangle, FaFingerprint, FaKey, FaLock } from "react-icons/fa";
import { contactStyles, inboxStyles } from "~/styles/components";

interface AdminLoginCardProps {
    isFirstSetup: boolean;
    initialPasskeysCount: number;
    authError: string | null;
    authBusy: boolean;
    passcode: string;
    onPasscodeChange: (val: string) => void;
    onPasscodeLogin: (e?: React.SyntheticEvent) => void;
    onPasskeyLogin: () => void;
    onRegisterPasskey: () => void;
}

export function AdminLoginCard({
    isFirstSetup,
    initialPasskeysCount,
    authError,
    authBusy,
    passcode,
    onPasscodeChange,
    onPasscodeLogin,
    onPasskeyLogin,
    onRegisterPasskey,
}: AdminLoginCardProps) {
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
                    <button type="button" onClick={onPasskeyLogin} disabled={authBusy} className={contactStyles.button}>
                        <FaFingerprint className="w-4 h-4" />
                        <span>{authBusy ? "Verifying Biometrics..." : "Sign In with Passkey (FaceID / TouchID)"}</span>
                    </button>
                ) : (
                    isFirstSetup && (
                        <button
                            type="button"
                            onClick={onRegisterPasskey}
                            disabled={authBusy}
                            className={contactStyles.button}
                        >
                            <FaFingerprint className="w-4 h-4" />
                            <span>{authBusy ? "Setting up Passkey..." : "Setup Phone Passkey (FaceID / TouchID)"}</span>
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

            {/* Passcode Unlock */}
            <div className="space-y-4">
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
                        onChange={(e) => onPasscodeChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && passcode.trim() && !authBusy) {
                                e.preventDefault();
                                onPasscodeLogin(e);
                            }
                        }}
                        placeholder={isFirstSetup ? "Choose a strong passcode..." : "Enter ADMIN_SECRET or passcode..."}
                        className={contactStyles.input}
                    />
                </div>
                <button
                    type="button"
                    onClick={() => onPasscodeLogin()}
                    disabled={authBusy || !passcode.trim()}
                    className="w-full py-3 px-5 rounded-xl bg-slate-900 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                    <FaKey className="w-3.5 h-3.5" />
                    <span>{isFirstSetup ? "Save Passcode & Open Inbox" : "Sign In with Passcode"}</span>
                </button>
            </div>
        </div>
    );
}
