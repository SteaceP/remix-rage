import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fromBase64Url, toBase64Url } from "./auth.server";
import {
    encryptWebPushPayload,
    generateVapidKeys,
    sendWebPushNotification,
    type PushNotificationPayload,
    type StoredVapidKeys,
} from "./webpush.server";

describe("webpush.server", () => {
    let vapidKeys: StoredVapidKeys;
    let mockSubscription: {
        endpoint: string;
        keys: { p256dh: string; auth: string };
        createdAt: number;
    };

    beforeEach(async () => {
        vapidKeys = await generateVapidKeys();
        const clientKeyPair = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, [
            "deriveBits",
        ]);
        const rawPublic = new Uint8Array(
            (await crypto.subtle.exportKey("raw", clientKeyPair.publicKey)) as ArrayBuffer
        );
        const authBytes = new Uint8Array(16);
        crypto.getRandomValues(authBytes);

        mockSubscription = {
            endpoint: "https://push.example.com/sub/user123",
            keys: {
                p256dh: toBase64Url(rawPublic),
                auth: toBase64Url(authBytes),
            },
            createdAt: Date.now(),
        };
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("generateVapidKeys", () => {
        it("generates valid P-256 keys and base64url public key", async () => {
            const keys = await generateVapidKeys();
            expect(keys.publicKey).toBeDefined();
            expect(keys.privateJwk).toBeDefined();
            expect(keys.privateJwk.kty).toBe("EC");
            expect(keys.privateJwk.crv).toBe("P-256");

            const rawPub = fromBase64Url(keys.publicKey);
            expect(rawPub.length).toBe(65);
            expect(rawPub[0]).toBe(0x04); // uncompressed point marker
        });
    });

    describe("encryptWebPushPayload", () => {
        it("encrypts payload adhering to RFC 8291 aes128gcm layout", async () => {
            const message = JSON.stringify({ hello: "world", count: 123 });
            const encrypted = await encryptWebPushPayload(message, mockSubscription);

            // Structure:
            // Salt: 16 bytes
            // Record size (rs): 4 bytes (4096 = 0x00 0x00 0x10 0x00)
            // Key ID length (idlen): 1 byte (65)
            // Key ID (keyid): 65 bytes
            // Ciphertext + 16 bytes GCM tag
            const headerLength = 16 + 4 + 1 + 65; // 86 bytes
            expect(encrypted.length).toBeGreaterThan(headerLength + 16);

            // Check record size (rs = 4096)
            expect(encrypted[16]).toBe(0);
            expect(encrypted[17]).toBe(0);
            expect(encrypted[18]).toBe(16);
            expect(encrypted[19]).toBe(0);

            // Check idlen = 65
            expect(encrypted[20]).toBe(65);

            // Check public key prefix inside header
            expect(encrypted[21]).toBe(0x04);
        });
    });

    describe("sendWebPushNotification", () => {
        const payload: PushNotificationPayload = {
            title: "New Alert",
            body: "You have a new direct message",
            url: "https://example.com/inbox",
            ts: Date.now(),
        };

        it("returns 400 and gone:true when subscription details are missing", async () => {
            const res1 = await sendWebPushNotification(null as any, payload, vapidKeys);
            expect(res1).toEqual({ ok: false, status: 400, gone: true });

            const res2 = await sendWebPushNotification({} as any, payload, vapidKeys);
            expect(res2).toEqual({ ok: false, status: 400, gone: true });

            const res3 = await sendWebPushNotification(
                { endpoint: "https://example.com", keys: { p256dh: "", auth: "" }, createdAt: 0 },
                payload,
                vapidKeys
            );
            expect(res3).toEqual({ ok: false, status: 400, gone: true });
        });

        it("dispatches push request with appropriate headers and body", async () => {
            const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("", { status: 201 }));

            const result = await sendWebPushNotification(mockSubscription, payload, vapidKeys);

            expect(result).toEqual({ ok: true, status: 201, gone: false });
            expect(fetchMock).toHaveBeenCalledTimes(1);

            const [calledUrl, calledInit] = fetchMock.mock.calls[0];
            expect(calledUrl).toBe(mockSubscription.endpoint);
            expect(calledInit?.method).toBe("POST");

            const headers = calledInit?.headers as Record<string, string>;
            expect(headers["Content-Encoding"]).toBe("aes128gcm");
            expect(headers["Content-Type"]).toBe("application/octet-stream");
            expect(headers["TTL"]).toBe("86400");
            expect(headers["Urgency"]).toBe("high");
            expect(headers["Authorization"]).toMatch(/^vapid t=[^,]+, k=.+$/);

            // Body should be an ArrayBuffer with encrypted bytes
            expect(calledInit?.body).toBeInstanceOf(ArrayBuffer);
        });

        it("detects expired subscriptions (HTTP 410 Gone)", async () => {
            vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("", { status: 410 }));
            const result = await sendWebPushNotification(mockSubscription, payload, vapidKeys);
            expect(result).toEqual({ ok: false, status: 410, gone: true });
        });

        it("detects not found subscriptions (HTTP 404 Not Found)", async () => {
            vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("", { status: 404 }));
            const result = await sendWebPushNotification(mockSubscription, payload, vapidKeys);
            expect(result).toEqual({ ok: false, status: 404, gone: true });
        });

        it("handles standard server errors (e.g. HTTP 503)", async () => {
            vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("Service Unavailable", { status: 503 }));
            const result = await sendWebPushNotification(mockSubscription, payload, vapidKeys);
            expect(result).toEqual({ ok: false, status: 503, gone: false });
        });

        it("catches fetch exceptions and returns status 500", async () => {
            const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
            vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network connection reset"));

            const result = await sendWebPushNotification(mockSubscription, payload, vapidKeys);
            expect(result).toEqual({ ok: false, status: 500, gone: false });
            expect(consoleSpy).toHaveBeenCalled();
        });
    });
});
