import { validateToken } from "./token.server";

const ADMIN_COOKIE_NAME = "cr_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function toBase64Url(bytes: Uint8Array | ArrayBuffer): string {
    const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    let binary = "";
    for (let i = 0; i < arr.length; i++) {
        binary += String.fromCharCode(arr[i]);
    }
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function fromBase64Url(base64url: string): Uint8Array {
    const padded = base64url.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((base64url.length + 3) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
        "sign",
        "verify",
    ]);
}

export interface AdminSessionPayload {
    role: "admin";
    iat: number;
    exp: number;
    authMethod: "passkey" | "passcode";
}

export async function createAdminSessionToken(
    secret: string,
    authMethod: "passkey" | "passcode" = "passcode"
): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const payload: AdminSessionPayload = {
        role: "admin",
        iat: now,
        exp: now + SESSION_TTL_SECONDS,
        authMethod,
    };
    const encoder = new TextEncoder();
    const payloadB64 = toBase64Url(encoder.encode(JSON.stringify(payload)));
    const key = await getHmacKey(secret);
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
    const sigB64 = toBase64Url(signature);
    return `${payloadB64}.${sigB64}`;
}

export async function verifyAdminSessionToken(token: string, secret: string): Promise<AdminSessionPayload | null> {
    try {
        const parts = token.split(".");
        if (parts.length !== 2) return null;
        const [payloadB64, sigB64] = parts;
        const encoder = new TextEncoder();
        const key = await getHmacKey(secret);
        const sigBytes = fromBase64Url(sigB64);
        const valid = await crypto.subtle.verify(
            "HMAC",
            key,
            sigBytes.buffer as ArrayBuffer,
            encoder.encode(payloadB64)
        );
        if (!valid) return null;

        const payloadJson = new TextDecoder().decode(fromBase64Url(payloadB64));
        const payload = JSON.parse(payloadJson) as AdminSessionPayload;
        if (payload.role !== "admin") return null;
        const now = Math.floor(Date.now() / 1000);
        if (typeof payload.exp !== "number" || payload.exp < now) return null;

        return payload;
    } catch {
        return null;
    }
}

export function parseCookies(cookieHeader: string | null): Record<string, string> {
    if (!cookieHeader) return {};
    const out: Record<string, string> = {};
    for (const pair of cookieHeader.split(";")) {
        const idx = pair.indexOf("=");
        if (idx === -1) continue;
        const k = pair.slice(0, idx).trim();
        const v = pair.slice(idx + 1).trim();
        out[k] = decodeURIComponent(v);
    }
    return out;
}

export async function getAdminSessionFromRequest(
    request: Request,
    secret: string
): Promise<AdminSessionPayload | null> {
    const cookies = parseCookies(request.headers.get("Cookie"));
    const token = cookies[ADMIN_COOKIE_NAME];
    if (!token) return null;
    return verifyAdminSessionToken(token, secret);
}

export function createAdminCookieHeader(token: string, request: Request): string {
    const url = new URL(request.url);
    const isSecure = url.protocol === "https:";
    const directives = [
        `${ADMIN_COOKIE_NAME}=${encodeURIComponent(token)}`,
        "Path=/",
        "HttpOnly",
        "SameSite=Lax",
        `Max-Age=${SESSION_TTL_SECONDS}`,
    ];
    if (isSecure) {
        directives.push("Secure");
    }
    return directives.join("; ");
}

export function clearAdminCookieHeader(request: Request): string {
    const url = new URL(request.url);
    const isSecure = url.protocol === "https:";
    const directives = [`${ADMIN_COOKIE_NAME}=`, "Path=/", "HttpOnly", "SameSite=Lax", "Max-Age=0"];
    if (isSecure) {
        directives.push("Secure");
    }
    return directives.join("; ");
}

export async function hashPasscode(passcode: string): Promise<string> {
    const salt = new Uint8Array(16);
    crypto.getRandomValues(salt);
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(passcode), "PBKDF2", false, ["deriveBits"]);
    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: salt.buffer as ArrayBuffer,
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        256
    );
    return `${toBase64Url(salt)}.${toBase64Url(derivedBits)}`;
}

export async function verifyPasscodeHash(passcode: string, storedHash: string): Promise<boolean> {
    try {
        const [saltB64, hashB64] = storedHash.split(".");
        if (!saltB64 || !hashB64) return false;
        const salt = fromBase64Url(saltB64);
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(passcode), "PBKDF2", false, [
            "deriveBits",
        ]);
        const derivedBits = await crypto.subtle.deriveBits(
            {
                name: "PBKDF2",
                salt: salt.buffer as ArrayBuffer,
                iterations: 100000,
                hash: "SHA-256",
            },
            keyMaterial,
            256
        );
        const candidateHashB64 = toBase64Url(derivedBits);
        return validateToken(hashB64, candidateHashB64);
    } catch {
        return false;
    }
}

export function resolveSigningSecret(env: Record<string, unknown> | undefined): string {
    const secret = typeof env?.ADMIN_SECRET === "string" && env.ADMIN_SECRET;
    if (secret) return secret;
    // Fallback for local dev when .dev.vars is not present
    return "coderage-local-dev-signing-secret-32chars";
}
