import { useState } from "react";
import type { PublicPasskey } from "./types";
import { fromBase64UrlClient, toBase64UrlClient } from "./utils";

export interface UseAdminAuthOptions {
    initialAuthenticated: boolean;
    initialPasskeys: PublicPasskey[];
}

export function useAdminAuth({ initialAuthenticated, initialPasskeys }: UseAdminAuthOptions) {
    const [authenticated, setAuthenticated] = useState(initialAuthenticated);
    const [passcode, setPasscode] = useState("");
    const [authError, setAuthError] = useState<string | null>(null);
    const [authBusy, setAuthBusy] = useState(false);
    const [passkeys, setPasskeys] = useState<PublicPasskey[]>(initialPasskeys);
    const [deviceNameInput, setDeviceNameInput] = useState("My Phone (FaceID / TouchID)");
    const [newPasscodeInput, setNewPasscodeInput] = useState("");
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    async function handlePasscodeLogin(e?: React.SyntheticEvent) {
        if (e) e.preventDefault();
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

    async function handleUpdatePasscode(e?: React.SyntheticEvent) {
        if (e) e.preventDefault();
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

    async function handleLogout() {
        await fetch("/api/dm/logout", { method: "POST" });
        setAuthenticated(false);
    }

    return {
        authenticated,
        setAuthenticated,
        passcode,
        setPasscode,
        authError,
        setAuthError,
        authBusy,
        passkeys,
        setPasskeys,
        deviceNameInput,
        setDeviceNameInput,
        newPasscodeInput,
        setNewPasscodeInput,
        statusMessage,
        setStatusMessage,
        handlePasscodeLogin,
        handlePasskeyLogin,
        handleRegisterPasskey,
        handleDeletePasskey,
        handleUpdatePasscode,
        handleLogout,
    };
}
