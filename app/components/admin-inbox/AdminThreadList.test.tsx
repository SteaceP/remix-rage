// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AdminThreadList } from "./AdminThreadList";
import type { ChatThread } from "~/utils/dm-types";

describe("<AdminThreadList />", () => {
    const mockThreads: ChatThread[] = [
        {
            id: "th_1",
            visitorName: "Alice Miller",
            topic: "Computer Repair",
            visitorContact: "alice@example.com",
            createdAt: Date.now() - 3600000,
            updatedAt: Date.now() - 1800000,
            unreadByAdmin: 2,
            unreadByVisitor: 0,
            status: "open",
            lastMessagePreview: "Laptop screen is flickering",
            visitorOnline: true,
        },
        {
            id: "th_2",
            visitorName: "Bob Jones",
            topic: "Website Development",
            createdAt: Date.now() - 86400000,
            updatedAt: Date.now() - 43200000,
            unreadByAdmin: 0,
            unreadByVisitor: 0,
            status: "open",
            lastMessagePreview: "Need an e-commerce website",
            visitorOnline: false,
        },
        {
            id: "th_3",
            visitorName: "Carol White",
            topic: "App Build",
            createdAt: Date.now() - 172800000,
            updatedAt: Date.now() - 86400000,
            unreadByAdmin: 0,
            unreadByVisitor: 0,
            status: "archived",
            lastMessagePreview: "Thanks for the quick help!",
            visitorOnline: false,
        },
    ];

    const defaultProps = {
        threads: mockThreads,
        filterTab: "open" as const,
        selectedThreadId: "th_1",
        visitorTypingByThread: {},
        mobileShowChat: false,
        hasSelectedThread: true,
        onFilterChange: vi.fn(),
        onSelectThread: vi.fn(),
    };

    it("renders filter tabs with correct thread counts", () => {
        render(<AdminThreadList {...defaultProps} />);

        const openTab = screen.getByRole("button", { name: "Open (2)" });
        const archivedTab = screen.getByRole("button", { name: "Archived (1)" });

        expect(openTab).toBeDefined();
        expect(archivedTab).toBeDefined();
    });

    it("switches filter tabs when clicked", () => {
        const onFilterChange = vi.fn();
        render(<AdminThreadList {...defaultProps} onFilterChange={onFilterChange} />);

        const archivedTab = screen.getByRole("button", { name: "Archived (1)" });
        fireEvent.click(archivedTab);
        expect(onFilterChange).toHaveBeenCalledWith("archived");
    });

    it("renders list of open threads with visitor details and unread badges", () => {
        render(<AdminThreadList {...defaultProps} />);

        expect(screen.getByText("Alice Miller")).toBeDefined();
        expect(screen.getByText("Bob Jones")).toBeDefined();
        expect(screen.queryByText("Carol White")).toBeNull();

        // Alice has unread messages
        expect(screen.getByText("2")).toBeDefined();
        // Previews
        expect(screen.getByText("Laptop screen is flickering")).toBeDefined();
        expect(screen.getByText("Need an e-commerce website")).toBeDefined();
    });

    it("indicates visitor typing when typing record is active", () => {
        render(<AdminThreadList {...defaultProps} visitorTypingByThread={{ th_1: true }} />);

        expect(screen.getByText("Typing...")).toBeDefined();
    });

    it("calls onSelectThread when a thread is clicked", () => {
        const onSelectThread = vi.fn();
        render(<AdminThreadList {...defaultProps} onSelectThread={onSelectThread} />);

        const bobBtn = screen.getByText("Bob Jones").closest("button");
        expect(bobBtn).toBeDefined();
        fireEvent.click(bobBtn!);
        expect(onSelectThread).toHaveBeenCalledWith("th_2");
    });

    it("renders empty state message when there are no matching threads", () => {
        render(<AdminThreadList {...defaultProps} threads={[]} filterTab="open" />);

        expect(screen.getByText("No open conversations yet")).toBeDefined();
    });
});
