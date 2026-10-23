// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AdminInbox } from "./AdminInbox";
import type { AdminPresence, ChatThread } from "~/utils/dm-types";

describe("<AdminInbox />", () => {
    const originalFetch = global.fetch;

    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
        window.HTMLElement.prototype.scrollIntoView = vi.fn();

        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: vi.fn().mockImplementation((query) => ({
                matches: query.includes("standalone"),
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });

    const mockPresence: AdminPresence = {
        available: true,
        adminConnected: true,
        updatedAt: Date.now(),
        statusText: "Online",
    };

    const mockThreads: ChatThread[] = [
        {
            id: "th_1",
            visitorName: "Alice Miller",
            topic: "Computer Repair",
            visitorContact: "alice@example.com",
            createdAt: Date.now() - 3600000,
            updatedAt: Date.now() - 60000,
            unreadByAdmin: 2,
            unreadByVisitor: 0,
            status: "open",
            lastMessagePreview: "Laptop screen flickering",
            visitorOnline: true,
        },
    ];

    const baseProps = {
        initialAuthenticated: false,
        initialPresence: mockPresence,
        initialThreads: mockThreads,
        initialVapidPublicKey: "test-vapid-key",
        initialPasskeys: [],
        initialPushCount: 1,
        passkeysCount: 0,
        hasStoredPasscode: true,
        hasEnvPasscode: false,
    };

    it("renders AdminLoginCard when not authenticated", () => {
        render(
            <MemoryRouter>
                <AdminInbox {...baseProps} initialAuthenticated={false} />
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", { name: "Direct Message Inbox" })).toBeDefined();
        expect(screen.getByPlaceholderText(/Enter ADMIN_SECRET or passcode/i)).toBeDefined();
        expect(screen.getByRole("button", { name: "Sign In with Passcode" })).toBeDefined();
    });

    it("renders first-time setup prompt on login card when no passkeys or passcodes exist", () => {
        render(
            <MemoryRouter>
                <AdminInbox
                    {...baseProps}
                    initialAuthenticated={false}
                    hasStoredPasscode={false}
                    hasEnvPasscode={false}
                    passkeysCount={0}
                />
            </MemoryRouter>
        );

        expect(screen.getByText(/First-time setup: Register your phone's Passkey/i)).toBeDefined();
        expect(screen.getByPlaceholderText(/Choose a strong passcode/i)).toBeDefined();
    });

    it("renders authenticated dashboard with top bar and thread list", () => {
        render(
            <MemoryRouter>
                <AdminInbox {...baseProps} initialAuthenticated={true} />
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", { name: "Direct Inbox" })).toBeDefined();
        expect(screen.getAllByText("Alice Miller").length).toBeGreaterThan(0);
        expect(screen.getByRole("button", { name: /Passkey/i })).toBeDefined();
    });

    it("toggles security panel when Security button is clicked", () => {
        render(
            <MemoryRouter>
                <AdminInbox {...baseProps} initialAuthenticated={true} />
            </MemoryRouter>
        );

        expect(screen.queryByText(/Phone Biometric Passkeys \(WebAuthn\)/i)).toBeNull();

        const secBtn = screen.getByRole("button", { name: /Passkey/i });
        fireEvent.click(secBtn);

        expect(screen.getByText(/Phone Biometric Passkeys \(WebAuthn\)/i)).toBeDefined();

        fireEvent.click(secBtn);
        expect(screen.queryByText(/Phone Biometric Passkeys \(WebAuthn\)/i)).toBeNull();
    });
});
