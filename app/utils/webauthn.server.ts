import { fromBase64Url, toBase64Url } from "./auth.server";
import type { PasskeyCredential } from "./dm-types";

export function generateWebAuthnChallenge(): string {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return toBase64Url(bytes);
}

/**
 * Convert an ASN.1 DER-encoded ECDSA signature to IEEE P1363 (r || s, 64 bytes for P-256)
 * required by Web Crypto API's ECDSA verify.
 */
export function derToP1363(der: Uint8Array): Uint8Array {
    if (der.length === 64 && der[0] !== 0x30) {
        return der;
    }
    if (der.length < 8 || der[0] !== 0x30) {
        throw new Error("Invalid DER signature header");
    }
    let offset = 2;
    if (der[1] & 0x80) {
        offset = 2 + (der[1] & 0x7f);
    }
    if (offset >= der.length || der[offset] !== 0x02) {
        throw new Error("Invalid DER R marker");
    }
    const rLen = der[offset + 1];
    if (rLen <= 0 || offset + 2 + rLen > der.length) {
        throw new Error("Invalid DER R coordinate length");
    }
    let r = der.slice(offset + 2, offset + 2 + rLen);
    offset = offset + 2 + rLen;

    if (offset >= der.length || der[offset] !== 0x02) {
        throw new Error("Invalid DER S marker");
    }
    const sLen = der[offset + 1];
    if (sLen <= 0 || offset + 2 + sLen > der.length) {
        throw new Error("Invalid DER S coordinate length");
    }
    let s = der.slice(offset + 2, offset + 2 + sLen);

    // Strip leading zero padding if 33 bytes
    while (r.length > 32 && r[0] === 0x00) {
        r = r.slice(1);
    }
    while (s.length > 32 && s[0] === 0x00) {
        s = s.slice(1);
    }
    if (r.length > 32 || s.length > 32) {
        throw new Error("Coordinate exceeds P-256 byte length");
    }

    const out = new Uint8Array(64);
    out.set(r, 32 - r.length);
    out.set(s, 64 - s.length);
    return out;
}

/**
 * Convert uncompressed P-256 point (65 bytes: 0x04 || x || y) into SubjectPublicKeyInfo (SPKI) DER
 */
export function p256RawPointToSpki(uncompressedPoint: Uint8Array): Uint8Array {
    // Standard ASN.1 SPKI header for P-256 uncompressed public key (26 bytes)
    const spkiPrefix = new Uint8Array([
        0x30, 0x59, 0x30, 0x13, 0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01, 0x06, 0x08, 0x2a, 0x86, 0x48,
        0xce, 0x3d, 0x03, 0x01, 0x07, 0x03, 0x42, 0x00,
    ]);
    const out = new Uint8Array(spkiPrefix.length + uncompressedPoint.length);
    out.set(spkiPrefix, 0);
    out.set(uncompressedPoint, spkiPrefix.length);
    return out;
}

function concatBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
    const out = new Uint8Array(a.length + b.length);
    out.set(a, 0);
    out.set(b, a.length);
    return out;
}

export interface RegistrationVerifyInput {
    credentialId: string;
    clientDataJSON: string;
    publicKeySpki: string;
    algorithm?: number;
    authenticatorData?: string;
    deviceName?: string;
    expectedChallenge: string;
    expectedOrigin: string;
    expectedRpId: string;
}

export async function verifyPasskeyRegistration(input: RegistrationVerifyInput): Promise<PasskeyCredential> {
    const clientDataBytes = fromBase64Url(input.clientDataJSON);
    const clientData = JSON.parse(new TextDecoder().decode(clientDataBytes)) as {
        type: string;
        challenge: string;
        origin: string;
    };

    if (clientData.type !== "webauthn.create") {
        throw new Error("Invalid WebAuthn registration type");
    }
    if (clientData.challenge !== input.expectedChallenge) {
        throw new Error("Registration challenge mismatch");
    }
    if (clientData.origin !== input.expectedOrigin) {
        throw new Error("Registration origin mismatch");
    }

    if (!input.authenticatorData) {
        throw new Error("authenticatorData is required for registration verification");
    }

    const authData = fromBase64Url(input.authenticatorData);
    if (authData.length < 37) {
        throw new Error("Invalid authenticatorData length");
    }
    const expectedRpIdHash = new Uint8Array(
        await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input.expectedRpId))
    );
    const actualRpIdHash = authData.slice(0, 32);
    for (let i = 0; i < 32; i++) {
        if (expectedRpIdHash[i] !== actualRpIdHash[i]) {
            throw new Error("RP ID hash mismatch during registration");
        }
    }
    const flags = authData[32];
    if ((flags & 0x01) === 0) {
        throw new Error("User presence flag not set");
    }
    const view = new DataView(authData.buffer, authData.byteOffset + 33, 4);
    const counter = view.getUint32(0, false);

    const algorithm = input.algorithm ?? -7;
    const spkiBytes = fromBase64Url(input.publicKeySpki);

    // Validate that Web Crypto can import the SPKI public key
    if (algorithm === -7) {
        await crypto.subtle.importKey(
            "spki",
            spkiBytes.buffer as ArrayBuffer,
            { name: "ECDSA", namedCurve: "P-256" },
            false,
            ["verify"]
        );
    } else if (algorithm === -257) {
        await crypto.subtle.importKey(
            "spki",
            spkiBytes.buffer as ArrayBuffer,
            { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
            false,
            ["verify"]
        );
    } else {
        throw new Error(`Unsupported public key algorithm: ${algorithm}`);
    }

    return {
        id: input.credentialId,
        publicKeySpki: input.publicKeySpki,
        algorithm,
        counter,
        deviceName: input.deviceName?.trim() || "Mobile Passkey",
        createdAt: Date.now(),
        lastUsedAt: Date.now(),
    };
}

export interface AssertionVerifyInput {
    credentialId: string;
    clientDataJSON: string;
    authenticatorData: string;
    signature: string;
    expectedChallenge: string;
    expectedOrigin: string;
    expectedRpId: string;
    credential: PasskeyCredential;
}

export async function verifyPasskeyAssertion(input: AssertionVerifyInput): Promise<{ newCounter: number }> {
    const clientDataBytes = fromBase64Url(input.clientDataJSON);
    const clientData = JSON.parse(new TextDecoder().decode(clientDataBytes)) as {
        type: string;
        challenge: string;
        origin: string;
    };

    if (clientData.type !== "webauthn.get") {
        throw new Error("Invalid WebAuthn assertion type");
    }
    if (clientData.challenge !== input.expectedChallenge) {
        throw new Error("Assertion challenge mismatch");
    }
    if (clientData.origin !== input.expectedOrigin) {
        throw new Error("Assertion origin mismatch");
    }

    const authData = fromBase64Url(input.authenticatorData);
    if (authData.length < 37) {
        throw new Error("Invalid authenticatorData length");
    }

    const expectedRpIdHash = new Uint8Array(
        await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input.expectedRpId))
    );
    const actualRpIdHash = authData.slice(0, 32);
    for (let i = 0; i < 32; i++) {
        if (expectedRpIdHash[i] !== actualRpIdHash[i]) {
            throw new Error("RP ID hash mismatch");
        }
    }

    const flags = authData[32];
    if ((flags & 0x01) === 0) {
        throw new Error("User presence required");
    }

    const view = new DataView(authData.buffer, authData.byteOffset + 33, 4);
    const signCount = view.getUint32(0, false);

    if (input.credential.counter > 0 && signCount > 0 && signCount <= input.credential.counter) {
        throw new Error("Passkey signature counter replay detected");
    }

    const clientDataHash = new Uint8Array(await crypto.subtle.digest("SHA-256", clientDataBytes.buffer as ArrayBuffer));
    const signedData = concatBytes(authData, clientDataHash);

    const spkiBytes = fromBase64Url(input.credential.publicKeySpki);
    const sigBytes = fromBase64Url(input.signature);

    let verified = false;
    if (input.credential.algorithm === -7) {
        const publicKey = await crypto.subtle.importKey(
            "spki",
            spkiBytes.buffer as ArrayBuffer,
            { name: "ECDSA", namedCurve: "P-256" },
            false,
            ["verify"]
        );
        const rawSig = derToP1363(sigBytes);
        verified = await crypto.subtle.verify(
            { name: "ECDSA", hash: "SHA-256" },
            publicKey,
            rawSig.buffer as ArrayBuffer,
            signedData.buffer as ArrayBuffer
        );
    } else if (input.credential.algorithm === -257) {
        const publicKey = await crypto.subtle.importKey(
            "spki",
            spkiBytes.buffer as ArrayBuffer,
            { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
            false,
            ["verify"]
        );
        verified = await crypto.subtle.verify(
            { name: "RSASSA-PKCS1-v1_5" },
            publicKey,
            sigBytes.buffer as ArrayBuffer,
            signedData.buffer as ArrayBuffer
        );
    }

    if (!verified) {
        throw new Error("Passkey signature verification failed");
    }

    return { newCounter: signCount || input.credential.counter + 1 };
}
