// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Contact, { loader, meta } from "./contact";
import * as dmHub from "~/utils/dm-hub.server";
import * as authServer from "~/utils/auth.server";
import type { AdminPresence } from "~/utils/dm-types";

// Mock react-router's useLoaderData
const mockLoaderData = vi.fn();
vi.mock("react-router", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react-router")>();
    return {
        ...actual,
        useLoaderData: () => mockLoaderData(),
    };
});

describe("Route: /contact", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        window.HTMLElement.prototype.scrollIntoView = vi.fn();
    });

    const mockPresence: AdminPresence = {
        available: true,
        adminConnected: true,
        statusText: "Online",
        updatedAt: Date.now(),
    };

    it("exports meta with page title and description", () => {
        // @ts-expect-error Mocking MetaFunction args
        const m = meta({});
        expect(m).toBeDefined();
        expect(m![0]).toHaveProperty("title", "Direct Message — Code Rage");
    });

    it("loader returns presence and isAdmin status from context and hub", async () => {
        vi.spyOn(authServer, "getAdminSessionFromRequest").mockResolvedValue({
            role: "admin",
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600,
            authMethod: "passcode",
        });
        vi.spyOn(dmHub, "fetchHubJson").mockResolvedValue({
            presence: mockPresence,
        });

        const req = new Request("https://example.com/contact");
        const res = await loader({
            request: req,
            params: {},
            context: {
                cloudflare: {
                    env: {
                        SESSION_SECRET: "test-secret-at-least-32-chars-long",
                    },
                },
            },
        } as any);

        const data = (await res.json()) as { presence: AdminPresence; isAdmin: boolean };
        expect(data.isAdmin).toBe(true);
        expect(data.presence.statusText).toBe("Online");
    });

    it("loader falls back to default presence when hub fetch throws", async () => {
        vi.spyOn(authServer, "getAdminSessionFromRequest").mockResolvedValue(null);
        vi.spyOn(dmHub, "fetchHubJson").mockRejectedValue(new Error("Hub unavailable"));

        const req = new Request("https://example.com/contact");
        const res = await loader({
            request: req,
            params: {},
            context: {
                cloudflare: { env: {} },
            },
        } as any);

        const data = (await res.json()) as { presence: AdminPresence; isAdmin: boolean };
        expect(data.isAdmin).toBe(false);
        expect(data.presence.available).toBe(true);
        expect(data.presence.statusText).toBe("Available");
    });

    it("renders page content, presence status, and admin login link for guests", () => {
        mockLoaderData.mockReturnValue({
            presence: mockPresence,
            isAdmin: false,
        });

        render(
            <MemoryRouter>
                <Contact />
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", { name: "Direct Message" })).toBeDefined();
        expect(screen.getByText("LIVE DIRECT MESSAGE // ONLINE")).toBeDefined();
        expect(screen.getByText("Real-Time Direct Support")).toBeDefined();
        expect(screen.getByText(/Owner Login \/\/ Mobile Inbox PWA →/i)).toBeDefined();
    });

    it("renders admin logged in link when isAdmin is true", () => {
        mockLoaderData.mockReturnValue({
            presence: {
                ...mockPresence,
                available: false,
                statusText: "Away",
            },
            isAdmin: true,
        });

        render(
            <MemoryRouter>
                <Contact />
            </MemoryRouter>
        );

        expect(screen.getByText("DIRECT MESSAGE // AWAY")).toBeDefined();
        expect(screen.getByText(/Open Admin Direct Inbox \(Logged In\) →/i)).toBeDefined();
    });
});
