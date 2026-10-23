import { describe, expect, it, vi } from "vitest";
import { fetchHubJson, getHubStub } from "./dm-hub.server";

describe("dm-hub.server", () => {
    describe("getHubStub", () => {
        it("returns null when context has no DIRECT_MESSAGE_HUB binding", () => {
            expect(getHubStub({})).toBeNull();
            expect(getHubStub(undefined)).toBeNull();
            expect(getHubStub({ cloudflare: { env: {} } })).toBeNull();
        });

        it("calls idFromName and get on namespace when binding is present", () => {
            const mockStub = { fetch: vi.fn() } as unknown as DurableObjectStub;
            const mockId = { toString: () => "global-id" } as unknown as DurableObjectId;
            const mockNamespace = {
                idFromName: vi.fn().mockReturnValue(mockId),
                get: vi.fn().mockReturnValue(mockStub),
            } as unknown as DurableObjectNamespace;

            const context = {
                cloudflare: {
                    env: {
                        DIRECT_MESSAGE_HUB: mockNamespace,
                    },
                },
            };

            const stub = getHubStub(context);
            expect(mockNamespace.idFromName).toHaveBeenCalledWith("global");
            expect(mockNamespace.get).toHaveBeenCalledWith(mockId);
            expect(stub).toBe(mockStub);
        });
    });

    describe("fetchHubJson", () => {
        it("throws an error if stub is not available", async () => {
            await expect(fetchHubJson({}, "/status")).rejects.toThrow(
                "DIRECT_MESSAGE_HUB Durable Object binding is not available"
            );
        });

        it("formats url correctly and returns JSON on success", async () => {
            const expectedData = { success: true, count: 42 };
            const mockFetch = vi.fn().mockImplementation(
                () =>
                    new Response(JSON.stringify(expectedData), {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    })
            );
            const mockNamespace = {
                idFromName: vi.fn().mockReturnValue("id"),
                get: vi.fn().mockReturnValue({ fetch: mockFetch }),
            };
            const context = { env: { DIRECT_MESSAGE_HUB: mockNamespace } };

            // Test path with leading slash
            const result1 = await fetchHubJson<typeof expectedData>(context, "/status");
            expect(result1).toEqual(expectedData);
            expect(mockFetch).toHaveBeenCalledWith(expect.any(Request));
            const calledReq1 = mockFetch.mock.calls[0][0] as Request;
            expect(calledReq1.url).toBe("https://do.internal/status");

            // Test path without leading slash
            const result2 = await fetchHubJson<typeof expectedData>(context, "threads");
            expect(result2).toEqual(expectedData);
            const calledReq2 = mockFetch.mock.calls[1][0] as Request;
            expect(calledReq2.url).toBe("https://do.internal/threads");
        });

        it("passes RequestInit method and body through", async () => {
            const mockFetch = vi.fn().mockResolvedValue(
                new Response(JSON.stringify({ ok: true }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                })
            );
            const mockNamespace = {
                idFromName: vi.fn().mockReturnValue("id"),
                get: vi.fn().mockReturnValue({ fetch: mockFetch }),
            };
            const context = { env: { DIRECT_MESSAGE_HUB: mockNamespace } };

            await fetchHubJson(context, "/threads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "Bob" }),
            });

            const calledReq = mockFetch.mock.calls[0][0] as Request;
            expect(calledReq.method).toBe("POST");
            expect(await calledReq.json()).toEqual({ name: "Bob" });
        });

        it("throws with error message from json payload when response is not ok", async () => {
            const mockFetch = vi.fn().mockResolvedValue(
                new Response(JSON.stringify({ error: "Custom backend error" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                })
            );
            const mockNamespace = {
                idFromName: vi.fn().mockReturnValue("id"),
                get: vi.fn().mockReturnValue({ fetch: mockFetch }),
            };
            const context = { env: { DIRECT_MESSAGE_HUB: mockNamespace } };

            await expect(fetchHubJson(context, "/action")).rejects.toThrow("Custom backend error");
        });

        it("throws with fallback status message when response is not ok and error is absent", async () => {
            const mockFetch = vi.fn().mockResolvedValue(
                new Response(JSON.stringify({}), {
                    status: 502,
                    headers: { "Content-Type": "application/json" },
                })
            );
            const mockNamespace = {
                idFromName: vi.fn().mockReturnValue("id"),
                get: vi.fn().mockReturnValue({ fetch: mockFetch }),
            };
            const context = { env: { DIRECT_MESSAGE_HUB: mockNamespace } };

            await expect(fetchHubJson(context, "/action")).rejects.toThrow("Hub request failed (502)");
        });
    });
});
