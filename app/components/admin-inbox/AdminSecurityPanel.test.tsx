// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AdminSecurityPanel } from "./AdminSecurityPanel";
import type { PublicPasskey } from "./types";

describe("<AdminSecurityPanel />", () => {
    const mockPasskeys: PublicPasskey[] = [
        {
            id: "pk_1",
            counter: 5,
            deviceName: "iPhone 15 Pro",
            createdAt: Date.now() - 86400000,
            algorithm: -7,
        },
    ];

    const defaultProps = {
        pushEnabledOnDevice: true,
        authBusy: false,
        deviceNameInput: "",
        newPasscodeInput: "",
        passkeys: mockPasskeys,
        onDeviceNameChange: vi.fn(),
        onNewPasscodeChange: vi.fn(),
        onRegisterPasskey: vi.fn(),
        onDeletePasskey: vi.fn(),
        onUpdatePasscode: vi.fn(),
        onTestPush: vi.fn(),
    };

    it("renders registered passkeys list and triggers deletion", () => {
        const onDeletePasskey = vi.fn();
        render(<AdminSecurityPanel {...defaultProps} onDeletePasskey={onDeletePasskey} />);

        expect(screen.getByText(/iPhone 15 Pro/i)).toBeDefined();

        const removeBtn = screen.getByRole("button", { name: "Remove" });
        fireEvent.click(removeBtn);
        expect(onDeletePasskey).toHaveBeenCalledWith("pk_1");
    });

    it("handles passkey device label change and registration button click", () => {
        const onDeviceNameChange = vi.fn();
        const onRegisterPasskey = vi.fn();

        render(
            <AdminSecurityPanel
                {...defaultProps}
                deviceNameInput="Work Laptop"
                onDeviceNameChange={onDeviceNameChange}
                onRegisterPasskey={onRegisterPasskey}
            />
        );

        const input = screen.getByPlaceholderText(/Device label/i);
        fireEvent.change(input, { target: { value: "New Tablet" } });
        expect(onDeviceNameChange).toHaveBeenCalledWith("New Tablet");

        const addBtn = screen.getByRole("button", { name: "+ Add Passkey" });
        fireEvent.click(addBtn);
        expect(onRegisterPasskey).toHaveBeenCalled();
    });

    it("renders and triggers test push button when push is enabled", () => {
        const onTestPush = vi.fn();
        render(<AdminSecurityPanel {...defaultProps} pushEnabledOnDevice={true} onTestPush={onTestPush} />);

        const testPushBtn = screen.getByRole("button", { name: /Send Test Push/i });
        fireEvent.click(testPushBtn);
        expect(onTestPush).toHaveBeenCalled();
    });

    it("hides test push button when push is not enabled", () => {
        render(<AdminSecurityPanel {...defaultProps} pushEnabledOnDevice={false} />);
        expect(screen.queryByRole("button", { name: /Send Test Push/i })).toBeNull();
    });

    it("handles passcode input and update button submission", () => {
        const onNewPasscodeChange = vi.fn();
        const onUpdatePasscode = vi.fn();

        render(
            <AdminSecurityPanel
                {...defaultProps}
                newPasscodeInput="new-secret-123"
                onNewPasscodeChange={onNewPasscodeChange}
                onUpdatePasscode={onUpdatePasscode}
            />
        );

        const passInput = screen.getByPlaceholderText(/New fallback passcode/i);
        fireEvent.change(passInput, { target: { value: "newer-secret" } });
        expect(onNewPasscodeChange).toHaveBeenCalledWith("newer-secret");

        const updateBtn = screen.getByRole("button", { name: /^Save$/i });
        fireEvent.click(updateBtn);
        expect(onUpdatePasscode).toHaveBeenCalled();
    });
});
