// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { ThemeProvider } from "~/context/ThemeContext";
import Header from "./Header";

describe("<Header />", () => {
    beforeEach(() => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(
                JSON.stringify({
                    presence: {
                        available: true,
                        adminConnected: true,
                        statusText: "Available",
                        updatedAt: Date.now(),
                    },
                    isAdmin: true,
                }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }
            )
        );

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

    afterEach(() => {
        vi.restoreAllMocks();
    });

    async function renderHeader(initialEntries = ["/"]) {
        await act(async () => {
            render(
                <MemoryRouter initialEntries={initialEntries}>
                    <ThemeProvider>
                        <Header />
                    </ThemeProvider>
                </MemoryRouter>
            );
        });
    }

    it("renders the brand logo linking to home", async () => {
        await renderHeader();
        const logo = screen.getByAltText("Code Rage");
        expect(logo).toBeDefined();
        const link = logo.closest("a");
        expect(link?.getAttribute("href")).toBe("/");
    });

    it("displays live availability pill and fetches status", async () => {
        await renderHeader();

        const pill = screen.getByTitle(/Available now/i);
        expect(pill).toBeDefined();
        expect(pill.getAttribute("href")).toBe("/contact");
    });

    it("renders desktop navigation links with correct destinations", async () => {
        await renderHeader();

        const nav = screen.getByRole("navigation", { name: "Main Navigation" });
        expect(nav).toBeDefined();

        const overviewLink = nav.querySelector('a[href="/"]');
        expect(overviewLink).toBeDefined();

        const webDevLink = nav.querySelector('a[href="/website-development"]');
        expect(webDevLink).toBeDefined();

        const appsLink = nav.querySelector('a[href="/cross-platform-apps"]');
        expect(appsLink).toBeDefined();

        const repairLink = nav.querySelector('a[href="/computer-repair"]');
        expect(repairLink).toBeDefined();

        const familyLink = nav.querySelector('a[href="/family-support"]');
        expect(familyLink).toBeDefined();
    });

    it("displays admin inbox link when user is admin", async () => {
        await renderHeader();

        const inboxLink = screen.getByRole("link", { name: /Inbox/i });
        expect(inboxLink).toBeDefined();
        expect(inboxLink.getAttribute("href")).toBe("/inbox");
    });

    it("toggles theme when clicking theme toggle button", async () => {
        await renderHeader();

        const themeBtn = screen.getAllByRole("button", { name: /Activate dark mode/i })[0];
        expect(themeBtn).toBeDefined();

        await act(async () => {
            fireEvent.click(themeBtn);
        });
        expect(document.documentElement.classList.contains("dark")).toBe(true);

        const lightBtn = screen.getAllByRole("button", { name: /Activate light mode/i })[0];
        await act(async () => {
            fireEvent.click(lightBtn);
        });
        expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("updates presence in response to cr:presence custom event", async () => {
        await renderHeader();

        await act(async () => {
            window.dispatchEvent(
                new CustomEvent("cr:presence", {
                    detail: {
                        available: false,
                        adminConnected: false,
                        statusText: "In Workshop",
                        updatedAt: Date.now(),
                    },
                })
            );
        });

        const pill = screen.getByTitle(/In Workshop/i);
        expect(pill).toBeDefined();
    });

    it("toggles mobile menu open and closed", async () => {
        await renderHeader();

        const menuBtn = screen.getByRole("button", { name: /Toggle navigation menu/i });
        expect(menuBtn).toBeDefined();

        await act(async () => {
            fireEvent.click(menuBtn);
        });

        // Mobile drawer content should be present
        expect(screen.getByText(/Navigation & Services/i)).toBeDefined();
        expect(screen.getByRole("link", { name: /Send a Live Direct Message/i })).toBeDefined();

        // Clicking toggle button again closes it
        await act(async () => {
            fireEvent.click(menuBtn);
        });
        expect(screen.queryByText(/Navigation & Services/i)).toBeNull();
    });
});
