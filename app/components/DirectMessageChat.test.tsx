// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { DirectMessageChat } from "./DirectMessageChat";
import type { AdminPresence } from "~/utils/dm-types";

let latestWebSocketInstance: MockWebSocket | null = null;

class MockWebSocket {
    static OPEN = 1;
    readyState = 1;
    onopen: (() => void) | null = null;
    onmessage: ((event: { data: string }) => void) | null = null;
    onclose: (() => void) | null = null;
    onerror: (() => void) | null = null;
    send = vi.fn();
    close = vi.fn();

    constructor(public url: string) {
        latestWebSocketInstance = this;
        setTimeout(() => {
            this.onopen?.();
        }, 0);
    }
}

describe("<DirectMessageChat />", () => {
    const originalFetch = global.fetch;
    const originalWebSocket = global.WebSocket;

    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
        window.HTMLElement.prototype.scrollIntoView = vi.fn();
        latestWebSocketInstance = null;
        // @ts-expect-error Mocking WebSocket for jsdom
        global.WebSocket = MockWebSocket;
    });

    afterEach(() => {
        global.fetch = originalFetch;
        global.WebSocket = originalWebSocket;
    });

    const defaultPresence: AdminPresence = {
        available: true,
        adminConnected: true,
        updatedAt: Date.now(),
        statusText: "Online",
    };

    it("renders live presence badge when admin is connected", () => {
        render(
            <MemoryRouter>
                <DirectMessageChat initialPresence={defaultPresence} />
            </MemoryRouter>
        );

        expect(screen.getByText("Code Rage Direct Message")).toBeDefined();
        expect(screen.getByText(/Online Now • Live Direct Chat/i)).toBeDefined();
        expect(screen.getByText("Direct Communication Channel")).toBeDefined();
        expect(screen.getByPlaceholderText(/Tell me about your project/i)).toBeDefined();
    });

    it("renders away status when admin is not available", () => {
        const awayPresence: AdminPresence = {
            available: false,
            adminConnected: false,
            updatedAt: Date.now() - 3600000,
            statusText: "Away for lunch",
        };

        render(
            <MemoryRouter>
                <DirectMessageChat initialPresence={awayPresence} />
            </MemoryRouter>
        );

        expect(screen.getByText(/Away for lunch • Leave a Direct Message/i)).toBeDefined();
    });

    it("pre-selects topic from URL search param if present", () => {
        render(
            <MemoryRouter initialEntries={["/contact?service=Computer%20Repair"]}>
                <DirectMessageChat initialPresence={defaultPresence} />
            </MemoryRouter>
        );

        const repairButton = screen.getByRole("button", { name: "Computer Repair" });
        expect(repairButton).toBeDefined();
        expect(repairButton.className).toContain("bg-blue-600");
    });

    it("allows user to change topic by clicking chip", () => {
        render(
            <MemoryRouter>
                <DirectMessageChat initialPresence={defaultPresence} />
            </MemoryRouter>
        );

        const appChip = screen.getByRole("button", { name: "Cross-Platform App" });
        fireEvent.click(appChip);

        expect(appChip.className).toContain("bg-blue-600");
    });

    it("shows error alert if trying to send without a name", async () => {
        render(
            <MemoryRouter>
                <DirectMessageChat initialPresence={defaultPresence} />
            </MemoryRouter>
        );

        const textInput = screen.getByPlaceholderText(/Tell me about your project/i);
        fireEvent.change(textInput, { target: { value: "Hello I need help" } });

        const sendBtn = screen.getByRole("button", { name: "Send" });
        fireEvent.click(sendBtn);

        expect(await screen.findByText("Please enter your name so I know who I'm chatting with.")).toBeDefined();
    });

    it("sends first message, saves session, and transitions to started chat view", async () => {
        const mockResponse = {
            threadId: "th_test_123",
            visitorToken: "vt_secret_abc",
            thread: {
                id: "th_test_123",
                visitorName: "Elena Rostova",
                topic: "Website Development",
                visitorContact: "555-0199",
                createdAt: Date.now(),
                updatedAt: Date.now(),
                unreadByAdmin: 1,
                unreadByVisitor: 0,
                status: "open",
                lastMessagePreview: "I need a redesign for my bakery website.",
            },
            message: {
                id: "m_1",
                threadId: "th_test_123",
                sender: "visitor",
                senderName: "Elena Rostova",
                text: "I need a redesign for my bakery website.",
                createdAt: Date.now(),
            },
        };

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        } as Response);

        render(
            <MemoryRouter>
                <DirectMessageChat initialPresence={defaultPresence} />
            </MemoryRouter>
        );

        const nameInput = screen.getByPlaceholderText("e.g. Alex Rivera");
        fireEvent.change(nameInput, { target: { value: "Elena Rostova" } });

        const contactInput = screen.getByPlaceholderText("In case you step away");
        fireEvent.change(contactInput, { target: { value: "555-0199" } });

        const messageInput = screen.getByPlaceholderText(/Tell me about your project/i);
        fireEvent.change(messageInput, {
            target: { value: "I need a redesign for my bakery website." },
        });

        const sendBtn = screen.getByRole("button", { name: "Send" });
        fireEvent.click(sendBtn);

        await waitFor(() => {
            expect(screen.getByText("I need a redesign for my bakery website.")).toBeDefined();
        });

        expect(screen.getByText(/Chatting as Elena Rostova/i)).toBeDefined();
        expect(screen.getByText("New Chat")).toBeDefined();

        const stored = localStorage.getItem("cr_dm_session_v1");
        expect(stored).not.toBeNull();
        expect(JSON.parse(stored!).threadId).toBe("th_test_123");
    });

    it("restores conversation from session via visitor_init and resets on New Chat click", async () => {
        localStorage.setItem(
            "cr_dm_session_v1",
            JSON.stringify({
                threadId: "th_old_999",
                visitorToken: "token-999",
                visitorName: "Old User",
                topic: "General Inquiry",
            })
        );

        render(
            <MemoryRouter>
                <DirectMessageChat initialPresence={defaultPresence} />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(latestWebSocketInstance).not.toBeNull();
        });

        act(() => {
            latestWebSocketInstance?.onmessage?.({
                data: JSON.stringify({
                    type: "visitor_init",
                    presence: defaultPresence,
                    thread: {
                        id: "th_old_999",
                        visitorName: "Old User",
                        topic: "General Inquiry",
                        status: "open",
                    },
                    messages: [
                        {
                            id: "m_old",
                            threadId: "th_old_999",
                            sender: "visitor",
                            senderName: "Old User",
                            text: "Previous question",
                            createdAt: Date.now() - 10000,
                        },
                    ],
                }),
            });
        });

        expect(await screen.findByText("Previous question")).toBeDefined();
        expect(screen.getByText("New Chat")).toBeDefined();

        const newChatBtn = screen.getByRole("button", { name: /New Chat/i });
        fireEvent.click(newChatBtn);

        expect(screen.queryByText("Previous question")).toBeNull();
        expect(localStorage.getItem("cr_dm_session_v1")).toBeNull();
        expect(screen.getByPlaceholderText("e.g. Alex Rivera")).toBeDefined();
    });
});
