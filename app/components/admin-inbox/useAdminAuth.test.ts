// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useAdminAuth } from "./useAdminAuth";
import type { PublicPasskey } from "./types";

describe("useAdminAuth", () => {
    const originalFetch = global.fetch;

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });

    const mockPasskeys: PublicPasskey[] = [
        {
            id: "cred-1",
            counter: 0,
            deviceName: "Admin iPhone",
            algorithm: -7,
            createdAt: 1700000000000,
        },
    ];

    it("initializes with given initialAuthenticated and initialPasskeys", () => {
        const { result } = renderHook(() =>
            useAdminAuth({
                initialAuthenticated: true,
                initialPasskeys: mockPasskeys,
            })
        );

        expect(result.current.authenticated).toBe(true);
        expect(result.current.passkeys).toEqual(mockPasskeys);
        expect(result.current.passcode).toBe("");
        expect(result.current.authError).toBeNull();
    });

    it("handles successful passcode login", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ ok: true, bootstrapped: false }),
        } as Response);

        const { result } = renderHook(() =>
            useAdminAuth({
                initialAuthenticated: false,
                initialPasskeys: [],
            })
        );

        act(() => {
            result.current.setPasscode("secret123");
        });

        await act(async () => {
            await result.current.handlePasscodeLogin();
        });

        expect(result.current.authenticated).toBe(true);
        expect(result.current.passcode).toBe("");
        expect(result.current.authError).toBeNull();
        expect(global.fetch).toHaveBeenCalledWith("/api/dm/passcode-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ passcode: "secret123" }),
        });
    });

    it("handles bootstrapped passcode login message", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ ok: true, bootstrapped: true }),
        } as Response);

        const { result } = renderHook(() =>
            useAdminAuth({
                initialAuthenticated: false,
                initialPasskeys: [],
            })
        );

        act(() => {
            result.current.setPasscode("new-admin-code");
        });

        await act(async () => {
            await result.current.handlePasscodeLogin();
        });

        expect(result.current.authenticated).toBe(true);
        expect(result.current.statusMessage).toContain("Initial admin passcode saved!");
    });

    it("handles passcode login failure", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            json: async () => ({ ok: false, error: "Incorrect passcode" }),
        } as Response);

        const { result } = renderHook(() =>
            useAdminAuth({
                initialAuthenticated: false,
                initialPasskeys: [],
            })
        );

        act(() => {
            result.current.setPasscode("wrong-code");
        });

        await act(async () => {
            await result.current.handlePasscodeLogin();
        });

        expect(result.current.authenticated).toBe(false);
        expect(result.current.authError).toBe("Incorrect passcode");
    });

    it("sets error when passkey login is attempted without WebAuthn support", async () => {
        // Ensure PublicKeyCredential is not defined
        // @ts-expect-error simulating missing WebAuthn
        delete window.PublicKeyCredential;

        const { result } = renderHook(() =>
            useAdminAuth({
                initialAuthenticated: false,
                initialPasskeys: [],
            })
        );

        await act(async () => {
            await result.current.handlePasskeyLogin();
        });

        expect(result.current.authError).toContain("Passkeys (WebAuthn) are not supported");
        expect(result.current.authenticated).toBe(false);
    });

    it("sets error when passkey registration is attempted without WebAuthn support", async () => {
        // @ts-expect-error simulating missing WebAuthn
        delete window.PublicKeyCredential;

        const { result } = renderHook(() =>
            useAdminAuth({
                initialAuthenticated: true,
                initialPasskeys: [],
            })
        );

        await act(async () => {
            await result.current.handleRegisterPasskey();
        });

        expect(result.current.authError).toContain("Passkeys are not supported");
    });

    it("deletes passkey and updates passkey list", async () => {
        const remainingPasskeys: PublicPasskey[] = [];
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ ok: true, passkeys: remainingPasskeys }),
        } as Response);

        const { result } = renderHook(() =>
            useAdminAuth({
                initialAuthenticated: true,
                initialPasskeys: mockPasskeys,
            })
        );

        await act(async () => {
            await result.current.handleDeletePasskey("cred-1");
        });

        expect(result.current.passkeys).toEqual(remainingPasskeys);
        expect(result.current.statusMessage).toBe("Passkey removed.");
        expect(global.fetch).toHaveBeenCalledWith("/api/dm/webauthn-delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credentialId: "cred-1" }),
        });
    });

    it("updates fallback passcode successfully", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ ok: true }),
        } as Response);

        const { result } = renderHook(() =>
            useAdminAuth({
                initialAuthenticated: true,
                initialPasskeys: [],
            })
        );

        act(() => {
            result.current.setNewPasscodeInput("super-secret-code-2");
        });

        await act(async () => {
            await result.current.handleUpdatePasscode();
        });

        expect(result.current.newPasscodeInput).toBe("");
        expect(result.current.statusMessage).toContain("Fallback admin passcode updated");
        expect(result.current.authError).toBeNull();
    });

    it("handles error when updating fallback passcode fails", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            json: async () => ({ ok: false, error: "Passcode too short" }),
        } as Response);

        const { result } = renderHook(() =>
            useAdminAuth({
                initialAuthenticated: true,
                initialPasskeys: [],
            })
        );

        act(() => {
            result.current.setNewPasscodeInput("123");
        });

        await act(async () => {
            await result.current.handleUpdatePasscode();
        });

        expect(result.current.authError).toBe("Passcode too short");
    });

    it("handles admin logout", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ ok: true }),
        } as Response);

        const { result } = renderHook(() =>
            useAdminAuth({
                initialAuthenticated: true,
                initialPasskeys: [],
            })
        );

        await act(async () => {
            await result.current.handleLogout();
        });

        expect(result.current.authenticated).toBe(false);
        expect(global.fetch).toHaveBeenCalledWith("/api/dm/logout", {
            method: "POST",
        });
    });
});
