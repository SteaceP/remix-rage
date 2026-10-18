import type React from "react";
import { FaFingerprint, FaShieldAlt } from "react-icons/fa";
import { contactStyles } from "~/styles/components";
import type { PublicPasskey } from "./types";
import { formatShortTime } from "./utils";

interface AdminSecurityPanelProps {
    pushEnabledOnDevice: boolean;
    authBusy: boolean;
    deviceNameInput: string;
    newPasscodeInput: string;
    passkeys: PublicPasskey[];
    onDeviceNameChange: (val: string) => void;
    onNewPasscodeChange: (val: string) => void;
    onRegisterPasskey: () => void;
    onDeletePasskey: (credentialId: string) => void;
    onUpdatePasscode: (e?: React.SyntheticEvent) => void;
    onTestPush: () => void;
}

export function AdminSecurityPanel({
    pushEnabledOnDevice,
    authBusy,
    deviceNameInput,
    newPasscodeInput,
    passkeys,
    onDeviceNameChange,
    onNewPasscodeChange,
    onRegisterPasskey,
    onDeletePasskey,
    onUpdatePasscode,
    onTestPush,
}: AdminSecurityPanelProps) {
    return (
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
                            onClick={onTestPush}
                            className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                            Send Test Push →
                        </button>
                    )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                    Register FaceID / TouchID / Fingerprint on this phone so you can log in with a single biometric tap.
                </p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={deviceNameInput}
                        onChange={(e) => onDeviceNameChange(e.target.value)}
                        placeholder="Device label (e.g. Steace iPhone)"
                        className={contactStyles.input}
                    />
                    <button
                        type="button"
                        onClick={onRegisterPasskey}
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
                                    onClick={() => onDeletePasskey(pk.id)}
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
                <div className="flex gap-2">
                    <input
                        type="password"
                        value={newPasscodeInput}
                        onChange={(e) => onNewPasscodeChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && newPasscodeInput.trim().length >= 6) {
                                e.preventDefault();
                                onUpdatePasscode(e);
                            }
                        }}
                        placeholder="New fallback passcode (min 6 chars)"
                        className={contactStyles.input}
                    />
                    <button
                        type="button"
                        onClick={() => onUpdatePasscode()}
                        disabled={newPasscodeInput.trim().length < 6}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-mono font-semibold shrink-0 cursor-pointer disabled:opacity-50"
                    >
                        Save
                    </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    <strong>Install on Phone:</strong> On iPhone Safari, tap{" "}
                    <span className="font-mono">Share → Add to Home Screen</span>. On Android Chrome, tap{" "}
                    <span className="font-mono">Install App</span>. Then tap{" "}
                    <span className="font-mono">Enable Push</span> above to get lock-screen alerts.
                </p>
            </div>
        </div>
    );
}
