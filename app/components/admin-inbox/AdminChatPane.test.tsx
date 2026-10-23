// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AdminChatPane } from "./AdminChatPane";
import type { ChatMessage, ChatThread } from "~/utils/dm-types";

describe("<AdminChatPane />", () => {
    const mockThread: ChatThread = {
        id: "th_1",
        visitorName: "David Clark",
        topic: "PC Diagnostics",
        visitorContact: "david@example.com",
        createdAt: Date.now() - 3600000,
        updatedAt: Date.now() - 60000,
        unreadByAdmin: 0,
        unreadByVisitor: 0,
        status: "open",
        lastMessagePreview: "Does it make a clicking noise?",
        visitorOnline: true,
    };

    const mockMessages: ChatMessage[] = [
        {
            id: "m_1",
            threadId: "th_1",
            sender: "visitor",
            senderName: "David Clark",
            text: "Hello, my hard drive is clicking.",
            createdAt: Date.now() - 120000,
        },
        {
            id: "m_2",
            threadId: "th_1",
            sender: "admin",
            senderName: "Steace",
            text: "Does it make a clicking noise when booting?",
            createdAt: Date.now() - 60000,
        },
    ];

    const defaultProps = {
        selectedThread: mockThread,
        messages: mockMessages,
        isVisitorTyping: false,
        replyText: "",
        sendingReply: false,
        mobileShowChat: true,
        messagesEndRef: { current: null },
        onBackToThreads: vi.fn(),
        onArchiveThread: vi.fn(),
        onDeleteThread: vi.fn(),
        onReplyTextChange: vi.fn(),
        onSendReply: vi.fn(),
    };

    it("renders empty state placeholder when no thread is selected", () => {
        render(<AdminChatPane {...defaultProps} selectedThread={null} messages={[]} />);

        expect(screen.getByText("Select a conversation")).toBeDefined();
        expect(screen.getByText(/Choose a thread on the left/i)).toBeDefined();
    });

    it("renders thread header details, online status, and contact info", () => {
        render(<AdminChatPane {...defaultProps} />);

        expect(screen.getByRole("heading", { name: "David Clark" })).toBeDefined();
        expect(screen.getByText("Visitor Live")).toBeDefined();
        expect(screen.getByText("PC Diagnostics")).toBeDefined();
        expect(screen.getByText(/david@example.com/i)).toBeDefined();
    });

    it("renders conversation messages from visitor and admin", () => {
        render(<AdminChatPane {...defaultProps} />);

        expect(screen.getByText("Hello, my hard drive is clicking.")).toBeDefined();
        expect(screen.getByText("Does it make a clicking noise when booting?")).toBeDefined();
    });

    it("displays typing indicator when isVisitorTyping is true", () => {
        render(<AdminChatPane {...defaultProps} isVisitorTyping={true} />);

        expect(screen.getByText("David Clark is typing...")).toBeDefined();
    });

    it("triggers onArchiveThread and onDeleteThread action buttons", () => {
        const onArchiveThread = vi.fn();
        const onDeleteThread = vi.fn();

        render(<AdminChatPane {...defaultProps} onArchiveThread={onArchiveThread} onDeleteThread={onDeleteThread} />);

        const archiveBtn = screen.getByRole("button", { name: /Archive/i });
        fireEvent.click(archiveBtn);
        expect(onArchiveThread).toHaveBeenCalledWith(mockThread);

        const deleteBtn = screen.getByTitle("Delete conversation");
        fireEvent.click(deleteBtn);
        expect(onDeleteThread).toHaveBeenCalledWith(mockThread.id);
    });

    it("updates reply text and submits reply on button click", () => {
        const onReplyTextChange = vi.fn();
        const onSendReply = vi.fn();

        render(
            <AdminChatPane
                {...defaultProps}
                replyText="I can check that for you"
                onReplyTextChange={onReplyTextChange}
                onSendReply={onSendReply}
            />
        );

        const input = screen.getByPlaceholderText(/Reply to David Clark/i);
        fireEvent.change(input, { target: { value: "Updated response" } });
        expect(onReplyTextChange).toHaveBeenCalledWith("Updated response");

        const sendBtn = screen.getByRole("button", { name: "Send" });
        fireEvent.click(sendBtn);
        expect(onSendReply).toHaveBeenCalled();
    });

    it("sends quick reply when a quick reply pill is clicked", () => {
        const onSendReply = vi.fn();

        render(<AdminChatPane {...defaultProps} onSendReply={onSendReply} />);

        const quickReplyBtn = screen.getByText(/PC diagnostics are \$29 flat/i);
        fireEvent.click(quickReplyBtn);
        expect(onSendReply).toHaveBeenCalledWith(
            undefined,
            "PC diagnostics are $29 flat and waived if you proceed with the repair."
        );
    });
});
