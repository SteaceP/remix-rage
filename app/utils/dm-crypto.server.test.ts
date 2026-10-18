import { describe, expect, it } from "vitest";
import {
    createAdminSessionToken,
    fromBase64Url,
    hashPasscode,
    toBase64Url,
    verifyAdminSessionToken,
    verifyPasscodeHash,
} from "./auth.server";
import { derToP1363, generateWebAuthnChallenge } from "./webauthn.server";
import { encryptWebPushPayload, generateVapidKeys } from "./webpush.server";

describe("Admin Auth & Passcode Hashing", () => {
    it("creates and verifies signed admin session tokens", async () => {
        const secret = "test-signing-secret-with-32-bytes-minimum";
        const token = await createAdminSessionToken(secret, "passkey");
        const payload = await verifyAdminSessionToken(token, secret);

        expect(payload).not.toBeNull();
        expect(payload?.role).toBe("admin");
        expect(payload?.authMethod).toBe("passkey");

        const tampered = await verifyAdminSessionToken(`${token}x`, secret);
        expect(tampered).toBeNull();
    });

    it("hashes and verifies passcodes with PBKDF2-SHA256", async () => {
        const hash = await hashPasscode("correct-horse-battery-staple");
        expect(await verifyPasscodeHash("correct-horse-battery-staple", hash)).toBe(true);
        expect(await verifyPasscodeHash("wrong-passcode", hash)).toBe(false);
    });
});

describe("WebAuthn Passkey Helpers", () => {
    it("generates base64url challenges", () => {
        const c1 = generateWebAuthnChallenge();
        const c2 = generateWebAuthnChallenge();
        expect(c1.length).toBeGreaterThan(30);
        expect(c1).not.toEqual(c2);
        expect(fromBase64Url(c1).length).toBe(32);
    });

    it("converts ASN.1 DER ECDSA signatures to 64-byte IEEE P1363 format", () => {
        const r = new Uint8Array(32).fill(0x11);
        const s = new Uint8Array(32).fill(0x22);
        // Construct DER with leading 0x00 on R (33 bytes)
        const der = new Uint8Array(2 + 2 + 33 + 2 + 32);
        der[0] = 0x30;
        der[1] = 69;
        der[2] = 0x02;
        der[3] = 33;
        der[4] = 0x00;
        der.set(r, 5);
        der[37] = 0x02;
        der[38] = 32;
        der.set(s, 39);

        const p1363 = derToP1363(der);
        expect(p1363.length).toBe(64);
        expect(Array.from(p1363.slice(0, 32))).toEqual(Array.from(r));
        expect(Array.from(p1363.slice(32, 64))).toEqual(Array.from(s));
    });
});

describe("Web Push VAPID & RFC 8291 Payload Encryption", () => {
    it("generates valid P-256 VAPID keys and encrypts aes128gcm push payloads", async () => {
        const vapid = await generateVapidKeys();
        expect(fromBase64Url(vapid.publicKey).length).toBe(65);

        // Simulate a mobile browser PushSubscription ECDH keypair
        const uaKeyPair = await crypto.subtle.generateKey(
            { name: "ECDH", namedCurve: "P-256" },
            true,
            ["deriveBits"]
        );
        const uaRawPublic = new Uint8Array(
            (await crypto.subtle.exportKey("raw", uaKeyPair.publicKey)) as ArrayBuffer
        );
        const authBytes = new Uint8Array(16);
        crypto.getRandomValues(authBytes);

        const encrypted = await encryptWebPushPayload(
            JSON.stringify({ title: "New DM", body: "Hello from visitor" }),
            {
                endpoint: "https://fcm.googleapis.com/fcm/send/example",
                keys: {
                    p256dh: toBase64Url(uaRawPublic),
                    auth: toBase64Url(authBytes),
                },
                createdAt: Date.now(),
            }
        );

        // Header is 86 bytes (16 salt + 4 rs + 1 idlen + 65 keyid) + ciphertext + 16 GCM tag
        expect(encrypted.length).toBeGreaterThan(102);
        expect(encrypted[20]).toBe(65);
    });
});
