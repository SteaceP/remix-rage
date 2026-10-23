// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useAdminPush } from "./useAdminPush";

describe("useAdminPush", () => {
    const originalFetch = global.fetch;

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });

    it("initializes with provided push count and push disabled by default", () => {
        const { result } = renderHook(() =>
            useAdminPush({
                vapidPublicKey: "test-vapid-key",
                initialPushCount: 3,
            })
        );

        expect(result.current.pushCount).toBe(3);
        expect(result.current.pushEnabledOnDevice).toBe(false);
    });

    it("errors when trying to toggle push without serviceWorker or PushManager", async () => {
        const { result } = renderHook(() =>
            useAdminPush({
                vapidPublicKey: "test-vapid-key",
                initialPushCount: 0,
            })
        );

        const onSuccess = vi.fn();
        const onError = vi.fn();

        await act(async () => {
            await result.current.handleTogglePush(onSuccess, onError);
        });

        expect(onError).toHaveBeenCalledWith(expect.stringContaining("Web Push requires installing this page"));
        expect(onSuccess).not.toHaveBeenCalled();
    });

    it("handles test push successfully", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ delivered: 2, total: 2 }),
        } as Response);

        const { result } = renderHook(() =>
            useAdminPush({
                vapidPublicKey: "test-vapid-key",
                initialPushCount: 2,
            })
        );

        const onSuccess = vi.fn();
        const onError = vi.fn();

        await act(async () => {
            await result.current.handleTestPush(onSuccess, onError);
        });

        expect(global.fetch).toHaveBeenCalledWith("/api/dm/push-test", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        });
        expect(onSuccess).toHaveBeenCalledWith("Sent test notification (2/2 devices).");
        expect(onError).not.toHaveBeenCalled();
    });

    it("handles test push failure", async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error("Network failed"));

        const { result } = renderHook(() =>
            useAdminPush({
                vapidPublicKey: "test-vapid-key",
                initialPushCount: 1,
            })
        );

        const onSuccess = vi.fn();
        const onError = vi.fn();

        await act(async () => {
            await result.current.handleTestPush(onSuccess, onError);
        });

        expect(onError).toHaveBeenCalledWith("Failed to send test push notification");
        expect(onSuccess).not.toHaveBeenCalled();
    });

    it("unsubscribes from push if an existing subscription is present", async () => {
        const mockUnsubscribe = vi.fn().mockResolvedValue(true);
        const mockSubscription = {
            endpoint: "https://push.example.com/sub/123",
            unsubscribe: mockUnsubscribe,
        };

        const mockPushManager = {
            getSubscription: vi.fn().mockResolvedValue(mockSubscription),
        };

        const mockRegistration = {
            pushManager: mockPushManager,
        };

        // Provide PushManager on window
        (window as unknown as { PushManager: unknown }).PushManager = class PushManager {};

        Object.defineProperty(navigator, "serviceWorker", {
            value: {
                ready: Promise.resolve(mockRegistration),
                register: vi.fn().mockResolvedValue(mockRegistration),
            },
            configurable: true,
        });

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ ok: true }),
        } as Response);

        const { result } = renderHook(() =>
            useAdminPush({
                vapidPublicKey: "test-vapid-key",
                initialPushCount: 2,
            })
        );

        const onSuccess = vi.fn();
        const onError = vi.fn();

        await act(async () => {
            await result.current.handleTogglePush(onSuccess, onError);
        });

        expect(global.fetch).toHaveBeenCalledWith("/api/dm/push-unsubscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoint: "https://push.example.com/sub/123" }),
        });
        expect(mockUnsubscribe).toHaveBeenCalled();
        expect(result.current.pushEnabledOnDevice).toBe(false);
        expect(result.current.pushCount).toBe(1);
        expect(onSuccess).toHaveBeenCalledWith("Push notifications disabled on this device.");
    });
});
