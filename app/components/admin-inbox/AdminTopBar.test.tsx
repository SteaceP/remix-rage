// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AdminTopBar } from "./AdminTopBar";

describe("<AdminTopBar />", () => {
    const defaultProps = {
        wsConnected: true,
        openUnreadCount: 3,
        presence: {
            available: true,
            adminConnected: true,
            statusText: "Available",
            updatedAt: Date.now(),
        },
        pushEnabledOnDevice: true,
        pushCount: 2,
        soundEnabled: true,
        securityOpen: false,
        passkeysCount: 2,
        deferredPrompt: null,
        isStandalone: false,
        statusMessage: null,
        authError: null,
        onToggleAvailability: vi.fn(),
        onTogglePush: vi.fn(),
        onToggleSound: vi.fn(),
        onToggleSecurity: vi.fn(),
        onInstallApp: vi.fn(),
        onLogout: vi.fn(),
        onDismissStatus: vi.fn(),
    };

    it("renders connection status badge and unread message count", () => {
        render(<AdminTopBar {...defaultProps} />);

        expect(screen.getByText("Direct Inbox")).toBeDefined();
        expect(screen.getByText("LIVE DO")).toBeDefined();
        expect(screen.getByText("3 unread messages")).toBeDefined();
    });

    it("renders zero unread message state message", () => {
        render(<AdminTopBar {...defaultProps} openUnreadCount={0} wsConnected={false} />);

        expect(screen.getByText("All conversations caught up")).toBeDefined();
        expect(screen.queryByText("LIVE DO")).toBeNull();
    });

    it("displays presence status and handles availability toggle", () => {
        const onToggleAvailability = vi.fn();
        render(<AdminTopBar {...defaultProps} onToggleAvailability={onToggleAvailability} />);

        const availBtn = screen.getByRole("button", { name: /Header: Available/i });
        expect(availBtn).toBeDefined();

        fireEvent.click(availBtn);
        expect(onToggleAvailability).toHaveBeenCalled();
    });

    it("displays push status and handles push toggle", () => {
        const onTogglePush = vi.fn();
        const { rerender } = render(
            <AdminTopBar {...defaultProps} pushEnabledOnDevice={true} pushCount={2} onTogglePush={onTogglePush} />
        );

        const pushOnBtn = screen.getByRole("button", { name: /Push On \(2\)/i });
        expect(pushOnBtn).toBeDefined();
        fireEvent.click(pushOnBtn);
        expect(onTogglePush).toHaveBeenCalled();

        rerender(
            <AdminTopBar {...defaultProps} pushEnabledOnDevice={false} pushCount={0} onTogglePush={onTogglePush} />
        );
        expect(screen.getByRole("button", { name: /Enable Push/i })).toBeDefined();
    });

    it("handles sound toggle button click", () => {
        const onToggleSound = vi.fn();
        render(<AdminTopBar {...defaultProps} soundEnabled={true} onToggleSound={onToggleSound} />);

        const soundBtn = screen.getByTitle("Toggle incoming message chime");
        fireEvent.click(soundBtn);
        expect(onToggleSound).toHaveBeenCalled();
    });

    it("displays passkey count and triggers security drawer toggle", () => {
        const onToggleSecurity = vi.fn();
        render(<AdminTopBar {...defaultProps} passkeysCount={4} onToggleSecurity={onToggleSecurity} />);

        const secBtn = screen.getByRole("button", { name: /Passkey \(4\)/i });
        fireEvent.click(secBtn);
        expect(onToggleSecurity).toHaveBeenCalled();
    });

    it("displays Install App button when PWA prompt is ready and not standalone", () => {
        const onInstallApp = vi.fn();
        render(<AdminTopBar {...defaultProps} deferredPrompt={{}} isStandalone={false} onInstallApp={onInstallApp} />);

        const installBtn = screen.getByRole("button", { name: /Install App/i });
        fireEvent.click(installBtn);
        expect(onInstallApp).toHaveBeenCalled();
    });

    it("displays error / status banner and calls onDismissStatus", () => {
        const onDismissStatus = vi.fn();
        render(
            <AdminTopBar
                {...defaultProps}
                authError="Failed to connect to Durable Object"
                onDismissStatus={onDismissStatus}
            />
        );

        expect(screen.getByText("Failed to connect to Durable Object")).toBeDefined();
        const dismissBtn = screen.getByRole("button", { name: /Dismiss/i });
        fireEvent.click(dismissBtn);
        expect(onDismissStatus).toHaveBeenCalled();
    });

    it("handles sign out button click", () => {
        const onLogout = vi.fn();
        render(<AdminTopBar {...defaultProps} onLogout={onLogout} />);

        const logoutBtn = screen.getByTitle("Sign out");
        fireEvent.click(logoutBtn);
        expect(onLogout).toHaveBeenCalled();
    });
});
