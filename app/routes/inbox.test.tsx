// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import InboxRoute, { headers, loader, meta } from "./inbox";
import * as dmHub from "~/utils/dm-hub.server";
import * as authServer from "~/utils/auth.server";
import type { AdminPresence, ChatThread } from "~/utils/dm-types";

const mockLoaderData = vi.fn();
vi.mock("react-router", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react-router")>();
    return {
        ...actual,
        useLoaderData: () => mockLoaderData(),
    };
});

describe("Route: /inbox", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        window.HTMLElement.prototype.scrollIntoView = vi.fn();
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: vi.fn().mockImplementation((query) => ({
                matches: false,
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

    const mockPresence: AdminPresence = {
        available: true,
        adminConnected: true,
        statusText: "Online",
        updatedAt: Date.now(),
    };

    const mockThreads: ChatThread[] = [
        {
            id: "th_1",
            visitorName: "Bob Tester",
            topic: "Website Development",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            unreadByAdmin: 0,
            unreadByVisitor: 0,
            status: "open",
            lastMessagePreview: "Need a site",
        },
    ];

    it("exports meta with noindex robots tags", () => {
        // @ts-expect-error Mocking MetaFunction args
        const m = meta({});
        expect(m).toBeDefined();
        expect(m![0]).toHaveProperty("title", "Direct Inbox — Code Rage");
        const robots = m!.find((entry) => "name" in entry && entry.name === "robots");
        expect(robots).toHaveProperty("content", "noindex, nofollow, noai, noimageai");
    });

    it("exports headers with X-Robots-Tag", () => {
        // @ts-expect-error Mocking HeadersFunction args
        const h = headers({});
        expect(h).toHaveProperty("X-Robots-Tag", "noindex, nofollow, noai, noimageai");
    });

    it("loader returns authenticated bootstrap data when admin session is valid", async () => {
        vi.spyOn(authServer, "getAdminSessionFromRequest").mockResolvedValue({
            role: "admin",
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600,
            authMethod: "passcode",
        });
        vi.spyOn(dmHub, "fetchHubJson").mockResolvedValue({
            presence: mockPresence,
            threads: mockThreads,
            vapidPublicKey: "vapid-xyz",
            passkeys: [],
            pushCount: 1,
            hasStoredPasscode: true,
        });

        const req = new Request("https://example.com/inbox");
        const res = await loader({
            request: req,
            params: {},
            context: {
                cloudflare: {
                    env: {
                        SESSION_SECRET: "test-secret-at-least-32-chars-long",
                        ADMIN_SECRET: "my-secret",
                    },
                },
            },
        } as any);

        const data = (await res.json()) as any;
        expect(data.authenticated).toBe(true);
        expect(data.threads).toHaveLength(1);
        expect(data.vapidPublicKey).toBe("vapid-xyz");
        expect(data.hasEnvPasscode).toBe(true);
    });

    it("loader returns unauthenticated status data when no session is present", async () => {
        vi.spyOn(authServer, "getAdminSessionFromRequest").mockResolvedValue(null);
        vi.spyOn(dmHub, "fetchHubJson").mockResolvedValue({
            presence: mockPresence,
            passkeysCount: 2,
            hasStoredPasscode: true,
            vapidPublicKey: "vapid-pub",
        });

        const req = new Request("https://example.com/inbox");
        const res = await loader({
            request: req,
            params: {},
            context: {
                cloudflare: { env: {} },
            },
        } as any);

        const data = (await res.json()) as any;
        expect(data.authenticated).toBe(false);
        expect(data.passkeysCount).toBe(2);
        expect(data.hasStoredPasscode).toBe(true);
    });

    it("renders AdminInbox with unauthenticated card", () => {
        mockLoaderData.mockReturnValue({
            authenticated: false,
            presence: mockPresence,
            threads: [],
            vapidPublicKey: "",
            passkeys: [],
            pushCount: 0,
            passkeysCount: 1,
            hasStoredPasscode: true,
            hasEnvPasscode: false,
        });

        render(
            <MemoryRouter>
                <InboxRoute />
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", { name: "Direct Message Inbox" })).toBeDefined();
        expect(screen.getByPlaceholderText(/Enter ADMIN_SECRET or passcode/i)).toBeDefined();
    });

    it("renders AdminInbox with authenticated inbox dashboard", () => {
        mockLoaderData.mockReturnValue({
            authenticated: true,
            presence: mockPresence,
            threads: mockThreads,
            vapidPublicKey: "vapid-123",
            passkeys: [],
            pushCount: 1,
            passkeysCount: 0,
            hasStoredPasscode: true,
            hasEnvPasscode: true,
        });

        render(
            <MemoryRouter>
                <InboxRoute />
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", { name: "Direct Inbox" })).toBeDefined();
        expect(screen.getAllByText("Bob Tester").length).toBeGreaterThan(0);
    });
});
