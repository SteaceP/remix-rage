import { describe, expect, it } from "vitest";
import { chatMessageSchema, visitorStartSchema } from "./dm-types";

describe("dm-types zod schemas", () => {
    describe("visitorStartSchema", () => {
        const validPayload = {
            visitorName: "Alice Smith",
            topic: "Computer Repair",
            text: "My laptop won't turn on.",
        };

        it("validates standard minimal input successfully", () => {
            const result = visitorStartSchema.safeParse(validPayload);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.visitorName).toBe("Alice Smith");
                expect(result.data.topic).toBe("Computer Repair");
                expect(result.data.text).toBe("My laptop won't turn on.");
            }
        });

        it("validates all optional fields when provided", () => {
            const fullPayload = {
                ...validPayload,
                threadId: "thread_12345678",
                visitorToken: "0123456789abcdef0123456789abcdef",
                visitorContact: "alice@example.com",
            };
            const result = visitorStartSchema.safeParse(fullPayload);
            expect(result.success).toBe(true);
        });

        it("accepts empty string for visitorContact", () => {
            const payload = {
                ...validPayload,
                visitorContact: "",
            };
            const result = visitorStartSchema.safeParse(payload);
            expect(result.success).toBe(true);
        });

        it("trims whitespace on name, topic, and text", () => {
            const payload = {
                visitorName: "   Bob   ",
                topic: "  Networking  ",
                text: "   Help needed   ",
            };
            const result = visitorStartSchema.safeParse(payload);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.visitorName).toBe("Bob");
                expect(result.data.topic).toBe("Networking");
                expect(result.data.text).toBe("Help needed");
            }
        });

        it("rejects empty or whitespace-only visitorName", () => {
            expect(visitorStartSchema.safeParse({ ...validPayload, visitorName: "" }).success).toBe(false);
            expect(visitorStartSchema.safeParse({ ...validPayload, visitorName: "   " }).success).toBe(false);
        });

        it("rejects visitorName longer than 80 chars", () => {
            const longName = "a".repeat(81);
            expect(visitorStartSchema.safeParse({ ...validPayload, visitorName: longName }).success).toBe(false);
        });

        it("rejects empty or whitespace-only topic", () => {
            expect(visitorStartSchema.safeParse({ ...validPayload, topic: "" }).success).toBe(false);
            expect(visitorStartSchema.safeParse({ ...validPayload, topic: "   " }).success).toBe(false);
        });

        it("rejects topic longer than 120 chars", () => {
            const longTopic = "t".repeat(121);
            expect(visitorStartSchema.safeParse({ ...validPayload, topic: longTopic }).success).toBe(false);
        });

        it("rejects empty or whitespace-only text", () => {
            expect(visitorStartSchema.safeParse({ ...validPayload, text: "" }).success).toBe(false);
            expect(visitorStartSchema.safeParse({ ...validPayload, text: "   \n\t  " }).success).toBe(false);
        });

        it("rejects text longer than 4000 chars", () => {
            const longText = "x".repeat(4001);
            expect(visitorStartSchema.safeParse({ ...validPayload, text: longText }).success).toBe(false);
        });

        it("rejects contact longer than 160 chars", () => {
            const longContact = "c".repeat(161);
            expect(visitorStartSchema.safeParse({ ...validPayload, visitorContact: longContact }).success).toBe(false);
        });

        it("rejects invalid threadId length", () => {
            expect(visitorStartSchema.safeParse({ ...validPayload, threadId: "short" }).success).toBe(false);
            expect(visitorStartSchema.safeParse({ ...validPayload, threadId: "z".repeat(81) }).success).toBe(false);
        });

        it("rejects invalid visitorToken length", () => {
            expect(visitorStartSchema.safeParse({ ...validPayload, visitorToken: "tooshort" }).success).toBe(false);
            expect(visitorStartSchema.safeParse({ ...validPayload, visitorToken: "x".repeat(129) }).success).toBe(
                false
            );
        });
    });

    describe("chatMessageSchema", () => {
        it("validates valid message", () => {
            const result = chatMessageSchema.safeParse({
                threadId: "thread-abc-1234",
                text: "Hello there!",
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.threadId).toBe("thread-abc-1234");
                expect(result.data.text).toBe("Hello there!");
            }
        });

        it("trims whitespace from text", () => {
            const result = chatMessageSchema.safeParse({
                threadId: "thread-abc-1234",
                text: "   trimmed content   ",
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.text).toBe("trimmed content");
            }
        });

        it("rejects threadId shorter than 8 chars", () => {
            const result = chatMessageSchema.safeParse({
                threadId: "1234567",
                text: "Valid text",
            });
            expect(result.success).toBe(false);
        });

        it("rejects empty text", () => {
            const result = chatMessageSchema.safeParse({
                threadId: "thread-abc-1234",
                text: "   ",
            });
            expect(result.success).toBe(false);
        });

        it("rejects text longer than 4000 chars", () => {
            const result = chatMessageSchema.safeParse({
                threadId: "thread-abc-1234",
                text: "x".repeat(4001),
            });
            expect(result.success).toBe(false);
        });
    });
});
