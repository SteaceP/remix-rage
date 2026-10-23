// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AdminLoginCard } from "./AdminLoginCard";

describe("<AdminLoginCard />", () => {
    const defaultProps = {
        isFirstSetup: false,
        initialPasskeysCount: 1,
        authError: null,
        authBusy: false,
        passcode: "",
        onPasscodeChange: vi.fn(),
        onPasscodeLogin: vi.fn(),
        onPasskeyLogin: vi.fn(),
        onRegisterPasskey: vi.fn(),
    };

    it("renders standard admin login view when not first-time setup", () => {
        render(<AdminLoginCard {...defaultProps} />);

        expect(screen.getByText("Direct Message Inbox")).toBeDefined();
        expect(screen.getByText(/Sign in with your phone's Passkey/i)).toBeDefined();
        expect(screen.getByRole("button", { name: /Sign In with Passkey/i })).toBeDefined();
        expect(screen.getByRole("button", { name: /Sign In with Passcode/i })).toBeDefined();
        expect(screen.getByPlaceholderText(/Enter ADMIN_SECRET or passcode/i)).toBeDefined();
    });

    it("renders first-time setup view with registration CTA", () => {
        render(<AdminLoginCard {...defaultProps} isFirstSetup={true} initialPasskeysCount={0} />);

        expect(screen.getByText(/First-time setup/i)).toBeDefined();
        expect(screen.getByRole("button", { name: /Setup Phone Passkey/i })).toBeDefined();
        expect(screen.getByText("Create Admin Passcode")).toBeDefined();
        expect(screen.getByRole("button", { name: /Save Passcode & Open Inbox/i })).toBeDefined();
    });

    it("displays error alert when authError is present", () => {
        render(<AdminLoginCard {...defaultProps} authError="Invalid passcode entered" />);

        const alert = screen.getByRole("alert");
        expect(alert).toBeDefined();
        expect(alert.textContent).toContain("Invalid passcode entered");
    });

    it("disables buttons and indicates busy state when authBusy is true", () => {
        render(<AdminLoginCard {...defaultProps} authBusy={true} passcode="secret" />);

        const passkeyBtn = screen.getByRole("button", { name: /Verifying Biometrics/i });
        expect((passkeyBtn as HTMLButtonElement).disabled).toBe(true);

        const passcodeBtn = screen.getByRole("button", { name: /Sign In with Passcode/i });
        expect((passcodeBtn as HTMLButtonElement).disabled).toBe(true);
    });

    it("invokes onPasscodeChange on input and onPasscodeLogin on submit", () => {
        const onPasscodeChange = vi.fn();
        const onPasscodeLogin = vi.fn();

        render(
            <AdminLoginCard
                {...defaultProps}
                passcode="my-pass"
                onPasscodeChange={onPasscodeChange}
                onPasscodeLogin={onPasscodeLogin}
            />
        );

        const input = screen.getByLabelText(/Admin Passcode/i);
        fireEvent.change(input, { target: { value: "new-secret" } });
        expect(onPasscodeChange).toHaveBeenCalledWith("new-secret");

        const submitBtn = screen.getByRole("button", { name: /Sign In with Passcode/i });
        expect((submitBtn as HTMLButtonElement).disabled).toBe(false);
        fireEvent.click(submitBtn);
        expect(onPasscodeLogin).toHaveBeenCalled();
    });

    it("triggers onPasscodeLogin when pressing Enter in passcode input", () => {
        const onPasscodeLogin = vi.fn();
        render(<AdminLoginCard {...defaultProps} passcode="entered-code" onPasscodeLogin={onPasscodeLogin} />);

        const input = screen.getByLabelText(/Admin Passcode/i);
        fireEvent.keyDown(input, { key: "Enter" });
        expect(onPasscodeLogin).toHaveBeenCalled();
    });

    it("triggers onPasskeyLogin when clicking Passkey button", () => {
        const onPasskeyLogin = vi.fn();
        render(<AdminLoginCard {...defaultProps} onPasskeyLogin={onPasskeyLogin} />);

        const passkeyBtn = screen.getByRole("button", { name: /Sign In with Passkey/i });
        fireEvent.click(passkeyBtn);
        expect(onPasskeyLogin).toHaveBeenCalled();
    });
});
