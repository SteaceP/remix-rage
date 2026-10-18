import { fromBase64Url, toBase64Url } from "./auth.server";
import type { PushSubscriptionRecord } from "./dm-types";

export interface StoredVapidKeys {
    publicKey: string;
    privateJwk: JsonWebKey;
}

function concatUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
    const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}

export async function generateVapidKeys(): Promise<StoredVapidKeys> {
    const keyPair = await crypto.subtle.generateKey(
        { name: "ECDSA", namedCurve: "P-256" },
        true,
        ["sign", "verify"]
    );
    const privateJwk = (await crypto.subtle.exportKey("jwk", keyPair.privateKey)) as JsonWebKey;
    const rawPublic = new Uint8Array(
        (await crypto.subtle.exportKey("raw", keyPair.publicKey)) as ArrayBuffer
    );
    return {
        publicKey: toBase64Url(rawPublic),
        privateJwk,
    };
}

async function createVapidJwt(
    endpoint: string,
    vapidKeys: StoredVapidKeys,
    subject = "mailto:admin@coderage.pro"
): Promise<string> {
    const url = new URL(endpoint);
    const audience = `${url.protocol}//${url.host}`;
    const now = Math.floor(Date.now() / 1000);

    const header = { typ: "JWT", alg: "ES256" };
    const payload = {
        aud: audience,
        exp: now + 12 * 3600,
        sub: subject,
    };

    const encoder = new TextEncoder();
    const unsignedToken = `${toBase64Url(encoder.encode(JSON.stringify(header)))}.${toBase64Url(
        encoder.encode(JSON.stringify(payload))
    )}`;

    const privateKey = await crypto.subtle.importKey(
        "jwk",
        vapidKeys.privateJwk,
        { name: "ECDSA", namedCurve: "P-256" },
        false,
        ["sign"]
    );

    const signature = await crypto.subtle.sign(
        { name: "ECDSA", hash: "SHA-256" },
        privateKey,
        encoder.encode(unsignedToken)
    );

    return `${unsignedToken}.${toBase64Url(signature)}`;
}

async function hkdfExtractAndExpand(
    salt: Uint8Array,
    ikm: Uint8Array,
    info: Uint8Array,
    length: number
): Promise<Uint8Array> {
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        ikm.buffer as ArrayBuffer,
        "HKDF",
        false,
        ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits(
        {
            name: "HKDF",
            hash: "SHA-256",
            salt: salt.buffer as ArrayBuffer,
            info: info.buffer as ArrayBuffer,
        },
        keyMaterial,
        length * 8
    );
    return new Uint8Array(bits);
}

/**
 * Encrypts a Web Push payload according to RFC 8291 (aes128gcm).
 */
export async function encryptWebPushPayload(
    payloadText: string,
    subscription: PushSubscriptionRecord
): Promise<Uint8Array> {
    const uaPublicBytes = fromBase64Url(subscription.keys.p256dh);
    const authSecret = fromBase64Url(subscription.keys.auth);

    const asKeyPair = await crypto.subtle.generateKey(
        { name: "ECDH", namedCurve: "P-256" },
        true,
        ["deriveBits"]
    );

    const asPublicBytes = new Uint8Array(
        (await crypto.subtle.exportKey("raw", asKeyPair.publicKey)) as ArrayBuffer
    );

    const uaPublicKey = await crypto.subtle.importKey(
        "raw",
        uaPublicBytes.buffer as ArrayBuffer,
        { name: "ECDH", namedCurve: "P-256" },
        false,
        []
    );

    const ecdhSecret = new Uint8Array(
        await crypto.subtle.deriveBits(
            { name: "ECDH", public: uaPublicKey },
            asKeyPair.privateKey,
            256
        )
    );

    const encoder = new TextEncoder();
    const keyInfo = concatUint8Arrays(
        encoder.encode("WebPush: info\0"),
        uaPublicBytes,
        asPublicBytes
    );
    const ikm = await hkdfExtractAndExpand(authSecret, ecdhSecret, keyInfo, 32);

    const salt = new Uint8Array(16);
    crypto.getRandomValues(salt);

    const cekInfo = encoder.encode("Content-Encoding: aes128gcm\0");
    const nonceInfo = encoder.encode("Content-Encoding: nonce\0");

    const cekBytes = await hkdfExtractAndExpand(salt, ikm, cekInfo, 16);
    const nonceBytes = await hkdfExtractAndExpand(salt, ikm, nonceInfo, 12);

    const cekKey = await crypto.subtle.importKey(
        "raw",
        cekBytes.buffer as ArrayBuffer,
        { name: "AES-GCM" },
        false,
        ["encrypt"]
    );

    const plaintextBytes = encoder.encode(payloadText);
    const paddedPlaintext = concatUint8Arrays(plaintextBytes, new Uint8Array([0x02]));

    const ciphertext = new Uint8Array(
        await crypto.subtle.encrypt(
            { name: "AES-GCM", iv: nonceBytes.buffer as ArrayBuffer },
            cekKey,
            paddedPlaintext.buffer as ArrayBuffer
        )
    );

    // Build 86-byte aes128gcm header: salt (16) + rs (4, 4096) + idlen (1, 65) + keyid (65)
    const rsBytes = new Uint8Array(4);
    new DataView(rsBytes.buffer).setUint32(0, 4096, false);
    const idLenByte = new Uint8Array([asPublicBytes.length]);

    return concatUint8Arrays(salt, rsBytes, idLenByte, asPublicBytes, ciphertext);
}

export interface PushNotificationPayload {
    title: string;
    body: string;
    url: string;
    threadId?: string;
    unreadCount?: number;
    ts: number;
}

export async function sendWebPushNotification(
    subscription: PushSubscriptionRecord,
    payload: PushNotificationPayload,
    vapidKeys: StoredVapidKeys
): Promise<{ ok: boolean; status: number; gone: boolean }> {
    try {
        const jwt = await createVapidJwt(subscription.endpoint, vapidKeys);
        const encryptedBody = await encryptWebPushPayload(JSON.stringify(payload), subscription);

        const response = await fetch(subscription.endpoint, {
            method: "POST",
            headers: {
                Authorization: `vapid t=${jwt}, k=${vapidKeys.publicKey}`,
                "Content-Encoding": "aes128gcm",
                "Content-Type": "application/octet-stream",
                TTL: "86400",
                Urgency: "high",
            },
            body: encryptedBody.buffer as ArrayBuffer,
        });

        const gone = response.status === 404 || response.status === 410;
        return { ok: response.ok, status: response.status, gone };
    } catch (error) {
        console.error("Web Push dispatch error:", error);
        return { ok: false, status: 500, gone: false };
    }
}
