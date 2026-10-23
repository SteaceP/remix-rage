import { describe, expect, it, vi } from "vitest";
import { action, loader } from "./api.dm.$action";
import * as dmHub from "~/utils/dm-hub.server";
import * as authServer from "~/utils/auth.server";

describe("api.dm.$action route", () => {
    const mockContext = {
        env: {
            ADMIN_SECRET: "test-admin-secret-at-least-32-chars",
        },
    };

    describe("loader", () => {
        it("returns 404 for unknown endpoint", async () => {
            const req = new Request("https://example.com/api/dm/unknown");
            const res = await loader({
                request: req,
                context: mockContext,
                params: { action: "unknown" },
            } as any);

            expect(res.status).toBe(404);
            const data = (await res.json()) as any;
            expect(data.error).toBe("Unknown endpoint");
        });

        it("handles status action successfully", async () => {
            const fetchHubJsonSpy = vi.spyOn(dmHub, "fetchHubJson").mockResolvedValue({
                presence: {
                    available: true,
                    adminConnected: true,
                    statusText: "Ready",
                    updatedAt: 12345,
                },
                passkeysCount: 1,
                hasStoredPasscode: true,
                vapidPublicKey: "mock-vapid",
                thread: null,
                messages: [],
            });

            const req = new Request("https://example.com/api/dm/status?threadId=th_123&token=tok_456");
            const res = await loader({
                request: req,
                context: mockContext,
                params: { action: "status" },
            } as any);

            expect(res.status).toBe(200);
            const data = (await res.json()) as any;
            expect(data.presence.statusText).toBe("Ready");
            expect(data.isAdmin).toBe(false);
            expect(data.hasEnvPasscode).toBe(true);
            expect(fetchHubJsonSpy).toHaveBeenCalledWith(mockContext, expect.stringContaining("threadId=th_123"));
        });

        it("handles status fallback when fetchHubJson fails", async () => {
            vi.spyOn(dmHub, "fetchHubJson").mockRejectedValue(new Error("Hub offline"));

            const req = new Request("https://example.com/api/dm/status");
            const res = await loader({
                request: req,
                context: mockContext,
                params: { action: "status" },
            } as any);

            expect(res.status).toBe(200);
            const data = (await res.json()) as any;
            expect(data.presence.statusText).toBe("Available");
            expect(data.passkeysCount).toBe(0);
        });

        it("returns 401 for thread action when not authenticated", async () => {
            const req = new Request("https://example.com/api/dm/thread?threadId=t1");
            const res = await loader({
                request: req,
                context: mockContext,
                params: { action: "thread" },
            } as any);

            expect(res.status).toBe(401);
            const data = (await res.json()) as any;
            expect(data.error).toBe("Unauthorized");
        });

        it("returns thread data for thread action when authenticated", async () => {
            const token = await authServer.createAdminSessionToken("test-admin-secret-at-least-32-chars");
            const req = new Request("https://example.com/api/dm/thread?threadId=t1", {
                headers: { Cookie: `cr_admin_session=${token}` },
            });

            const mockThreadData = {
                thread: { id: "t1", topic: "Repair" },
                messages: [],
            };
            vi.spyOn(dmHub, "fetchHubJson").mockResolvedValue(mockThreadData);

            const res = await loader({
                request: req,
                context: mockContext,
                params: { action: "thread" },
            } as any);

            expect(res.status).toBe(200);
            const data = (await res.json()) as any;
            expect(data.thread.id).toBe("t1");
        });
    });

    describe("action", () => {
        it("rejects non-POST requests with 405", async () => {
            const req = new Request("https://example.com/api/dm/logout", { method: "GET" });
            const res = await action({
                request: req,
                context: mockContext,
                params: { action: "logout" },
            } as any);

            expect(res.status).toBe(405);
            const data = (await res.json()) as any;
            expect(data.error).toBe("Method not allowed");
        });

        it("rejects mismatched Origin header with 403", async () => {
            const req = new Request("https://example.com/api/dm/logout", {
                method: "POST",
                headers: { Origin: "https://evil.com" },
            });
            const res = await action({
                request: req,
                context: mockContext,
                params: { action: "logout" },
            } as any);

            expect(res.status).toBe(403);
            const data = (await res.json()) as any;
            expect(data.error).toBe("Invalid request origin");
        });

        it("handles logout action by clearing cookie", async () => {
            const req = new Request("https://example.com/api/dm/logout", {
                method: "POST",
                headers: { Origin: "https://example.com" },
            });
            const res = await action({
                request: req,
                context: mockContext,
                params: { action: "logout" },
            } as any);

            expect(res.status).toBe(200);
            expect(res.headers.get("Set-Cookie")).toContain("Max-Age=0");
            const data = (await res.json()) as any;
            expect(data.ok).toBe(true);
        });

        it("handles visitor-message with valid body", async () => {
            const mockHubResult = {
                thread: { id: "th_1" },
                message: { id: "msg_1", text: "Hello" },
                threadId: "th_1",
                visitorToken: "vt_1234567890123456",
            };
            vi.spyOn(dmHub, "fetchHubJson").mockResolvedValue(mockHubResult);

            const req = new Request("https://example.com/api/dm/visitor-message", {
                method: "POST",
                headers: { Origin: "https://example.com", "Content-Type": "application/json" },
                body: JSON.stringify({
                    visitorName: "Visitor One",
                    topic: "App Dev",
                    text: "Need a new mobile app",
                }),
            });

            const res = await action({
                request: req,
                context: mockContext,
                params: { action: "visitor-message" },
            } as any);

            expect(res.status).toBe(200);
            const data = (await res.json()) as any;
            expect(data.threadId).toBe("th_1");
        });

        it("rejects invalid visitor-message body with 400", async () => {
            const req = new Request("https://example.com/api/dm/visitor-message", {
                method: "POST",
                headers: { Origin: "https://example.com", "Content-Type": "application/json" },
                body: JSON.stringify({
                    visitorName: "",
                    topic: "",
                    text: "",
                }),
            });

            const res = await action({
                request: req,
                context: mockContext,
                params: { action: "visitor-message" },
            } as any);

            expect(res.status).toBe(400);
            const data = (await res.json()) as any;
            expect(data.error).toBeDefined();
        });

        it("handles passcode-login success and sets admin session cookie", async () => {
            vi.spyOn(dmHub, "fetchHubJson").mockResolvedValue({ ok: true, bootstrapped: true });

            const req = new Request("https://example.com/api/dm/passcode-login", {
                method: "POST",
                headers: { Origin: "https://example.com", "Content-Type": "application/json" },
                body: JSON.stringify({ passcode: "super-secret" }),
            });

            const res = await action({
                request: req,
                context: mockContext,
                params: { action: "passcode-login" },
            } as any);

            expect(res.status).toBe(200);
            expect(res.headers.get("Set-Cookie")).toContain("cr_admin_session=");
            const data = (await res.json()) as any;
            expect(data.ok).toBe(true);
        });

        it("handles passcode-login failure with 401", async () => {
            vi.spyOn(dmHub, "fetchHubJson").mockResolvedValue({ ok: false, error: "Incorrect passcode" });

            const req = new Request("https://example.com/api/dm/passcode-login", {
                method: "POST",
                headers: { Origin: "https://example.com", "Content-Type": "application/json" },
                body: JSON.stringify({ passcode: "wrong" }),
            });

            const res = await action({
                request: req,
                context: mockContext,
                params: { action: "passcode-login" },
            } as any);

            expect(res.status).toBe(401);
            const data = (await res.json()) as any;
            expect(data.error).toBe("Incorrect passcode");
        });

        it("rejects protected admin actions when unauthenticated", async () => {
            const req = new Request("https://example.com/api/dm/availability", {
                method: "POST",
                headers: { Origin: "https://example.com", "Content-Type": "application/json" },
                body: JSON.stringify({ available: false }),
            });

            const res = await action({
                request: req,
                context: mockContext,
                params: { action: "availability" },
            } as any);

            expect(res.status).toBe(401);
            const data = (await res.json()) as any;
            expect(data.error).toBe("Unauthorized");
        });

        it("executes admin action when authenticated", async () => {
            const token = await authServer.createAdminSessionToken("test-admin-secret-at-least-32-chars");
            const req = new Request("https://example.com/api/dm/availability", {
                method: "POST",
                headers: {
                    Origin: "https://example.com",
                    "Content-Type": "application/json",
                    Cookie: `cr_admin_session=${token}`,
                },
                body: JSON.stringify({ available: true, statusText: "Online" }),
            });

            vi.spyOn(dmHub, "fetchHubJson").mockResolvedValue({ ok: true });

            const res = await action({
                request: req,
                context: mockContext,
                params: { action: "availability" },
            } as any);

            expect(res.status).toBe(200);
            const data = (await res.json()) as any;
            expect(data.ok).toBe(true);
        });

        it("executes admin-reply with validated message", async () => {
            const token = await authServer.createAdminSessionToken("test-admin-secret-at-least-32-chars");
            const req = new Request("https://example.com/api/dm/admin-reply", {
                method: "POST",
                headers: {
                    Origin: "https://example.com",
                    "Content-Type": "application/json",
                    Cookie: `cr_admin_session=${token}`,
                },
                body: JSON.stringify({ threadId: "thread-1234", text: "Got your message!" }),
            });

            vi.spyOn(dmHub, "fetchHubJson").mockResolvedValue({ ok: true });

            const res = await action({
                request: req,
                context: mockContext,
                params: { action: "admin-reply" },
            } as any);

            expect(res.status).toBe(200);
        });

        it("returns 404 for unknown action even when authenticated", async () => {
            const token = await authServer.createAdminSessionToken("test-admin-secret-at-least-32-chars");
            const req = new Request("https://example.com/api/dm/nonexistent", {
                method: "POST",
                headers: {
                    Origin: "https://example.com",
                    Cookie: `cr_admin_session=${token}`,
                },
            });

            const res = await action({
                request: req,
                context: mockContext,
                params: { action: "nonexistent" },
            } as any);

            expect(res.status).toBe(404);
            const data = (await res.json()) as any;
            expect(data.error).toBe("Unknown action");
        });
    });
});
