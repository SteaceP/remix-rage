import { describe, expect, it } from "vitest";
import {
    clearAdminCookieHeader,
    createAdminCookieHeader,
    createAdminSessionToken,
    fromBase64Url,
    getAdminSessionFromRequest,
    hashPasscode,
    parseCookies,
    resolveSigningSecret,
    toBase64Url,
    verifyAdminSessionToken,
    verifyPasscodeHash,
} from "./auth.server";

describe("auth.server", () => {
    describe("Base64Url encoding/decoding", () => {
        it("handles empty arrays", () => {
            const empty = new Uint8Array(0);
            const b64 = toBase64Url(empty);
            expect(b64).toBe("");
            expect(fromBase64Url(b64)).toEqual(new Uint8Array(0));
        });

        it("accepts ArrayBuffer directly in toBase64Url", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5]);
            const b64 = toBase64Url(bytes.buffer);
            expect(fromBase64Url(b64)).toEqual(bytes);
        });

        it("replaces + and / with - and _ and strips padding", () => {
            // Bytes that produce + and / in standard base64: [251, 239] -> ++8= or similar
            const bytes = new Uint8Array([251, 239, 255]);
            const b64 = toBase64Url(bytes);
            expect(b64).not.toContain("+");
            expect(b64).not.toContain("/");
            expect(b64).not.toContain("=");
            expect(fromBase64Url(b64)).toEqual(bytes);
        });

        it("correctly decodes strings with various padding modulo lengths", () => {
            for (let len = 1; len <= 16; len++) {
                const arr = new Uint8Array(len);
                for (let i = 0; i < len; i++) arr[i] = (i * 37 + 13) % 256;
                const encoded = toBase64Url(arr);
                const decoded = fromBase64Url(encoded);
                expect(decoded).toEqual(arr);
            }
        });
    });

    describe("Admin Session Tokens", () => {
        const secret = "test-session-secret-key-at-least-32-bytes";

        it("defaults authMethod to passcode when not specified", async () => {
            const token = await createAdminSessionToken(secret);
            const payload = await verifyAdminSessionToken(token, secret);
            expect(payload?.authMethod).toBe("passcode");
            expect(payload?.role).toBe("admin");
            expect(payload?.exp).toBeGreaterThan(payload?.iat ?? 0);
        });

        it("supports passkey authMethod", async () => {
            const token = await createAdminSessionToken(secret, "passkey");
            const payload = await verifyAdminSessionToken(token, secret);
            expect(payload?.authMethod).toBe("passkey");
        });

        it("rejects tokens verified with wrong secret", async () => {
            const token = await createAdminSessionToken(secret);
            const payload = await verifyAdminSessionToken(token, "wrong-secret-key-32-bytes-long");
            expect(payload).toBeNull();
        });

        it("rejects malformed token strings", async () => {
            expect(await verifyAdminSessionToken("not-a-token", secret)).toBeNull();
            expect(await verifyAdminSessionToken("part1.part2.part3", secret)).toBeNull();
            expect(await verifyAdminSessionToken("", secret)).toBeNull();
            expect(await verifyAdminSessionToken("invalid_b64.invalid_b64", secret)).toBeNull();
        });

        it("rejects token when role is not admin", async () => {
            const encoder = new TextEncoder();
            const fakePayload = {
                role: "visitor",
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 3600,
                authMethod: "passcode",
            };
            const payloadB64 = toBase64Url(encoder.encode(JSON.stringify(fakePayload)));
            const key = await crypto.subtle.importKey(
                "raw",
                encoder.encode(secret),
                { name: "HMAC", hash: "SHA-256" },
                false,
                ["sign"]
            );
            const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
            const token = `${payloadB64}.${toBase64Url(signature)}`;

            expect(await verifyAdminSessionToken(token, secret)).toBeNull();
        });

        it("rejects expired token", async () => {
            const encoder = new TextEncoder();
            const expiredPayload = {
                role: "admin",
                iat: Math.floor(Date.now() / 1000) - 7200,
                exp: Math.floor(Date.now() / 1000) - 3600,
                authMethod: "passcode",
            };
            const payloadB64 = toBase64Url(encoder.encode(JSON.stringify(expiredPayload)));
            const key = await crypto.subtle.importKey(
                "raw",
                encoder.encode(secret),
                { name: "HMAC", hash: "SHA-256" },
                false,
                ["sign"]
            );
            const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
            const token = `${payloadB64}.${toBase64Url(signature)}`;

            expect(await verifyAdminSessionToken(token, secret)).toBeNull();
        });

        it("rejects token with non-numeric exp", async () => {
            const encoder = new TextEncoder();
            const badPayload = {
                role: "admin",
                iat: Math.floor(Date.now() / 1000),
                exp: "never",
                authMethod: "passcode",
            };
            const payloadB64 = toBase64Url(encoder.encode(JSON.stringify(badPayload)));
            const key = await crypto.subtle.importKey(
                "raw",
                encoder.encode(secret),
                { name: "HMAC", hash: "SHA-256" },
                false,
                ["sign"]
            );
            const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
            const token = `${payloadB64}.${toBase64Url(signature)}`;

            expect(await verifyAdminSessionToken(token, secret)).toBeNull();
        });
    });

    describe("parseCookies", () => {
        it("returns empty object for null, empty or undefined header", () => {
            expect(parseCookies(null)).toEqual({});
            expect(parseCookies("")).toEqual({});
        });

        it("parses single and multiple cookies with trimming", () => {
            const header = "sessionId=abc123xyz; theme=dark; user=john%20doe";
            const parsed = parseCookies(header);
            expect(parsed).toEqual({
                sessionId: "abc123xyz",
                theme: "dark",
                user: "john doe",
            });
        });

        it("handles values with equal signs correctly", () => {
            const header = "cr_admin_session=part1.part2=something; simple=1";
            const parsed = parseCookies(header);
            expect(parsed.cr_admin_session).toBe("part1.part2=something");
            expect(parsed.simple).toBe("1");
        });

        it("skips segments without equal sign", () => {
            const header = "valid=yes; malformed_entry; another=ok";
            const parsed = parseCookies(header);
            expect(parsed).toEqual({
                valid: "yes",
                another: "ok",
            });
        });
    });

    describe("getAdminSessionFromRequest", () => {
        const secret = "test-request-secret-32-bytes-minimum";

        it("returns null when no Cookie header is present", async () => {
            const req = new Request("https://example.com/api/admin");
            const session = await getAdminSessionFromRequest(req, secret);
            expect(session).toBeNull();
        });

        it("returns null when cr_admin_session cookie is not present", async () => {
            const req = new Request("https://example.com/api/admin", {
                headers: { Cookie: "other=value; something=else" },
            });
            const session = await getAdminSessionFromRequest(req, secret);
            expect(session).toBeNull();
        });

        it("returns payload when cr_admin_session cookie is valid", async () => {
            const token = await createAdminSessionToken(secret, "passkey");
            const req = new Request("https://example.com/api/admin", {
                headers: { Cookie: `foo=bar; cr_admin_session=${token}` },
            });
            const session = await getAdminSessionFromRequest(req, secret);
            expect(session).not.toBeNull();
            expect(session?.authMethod).toBe("passkey");
        });

        it("returns null when cr_admin_session token is invalid", async () => {
            const req = new Request("https://example.com/api/admin", {
                headers: { Cookie: `cr_admin_session=invalid.token` },
            });
            const session = await getAdminSessionFromRequest(req, secret);
            expect(session).toBeNull();
        });
    });

    describe("createAdminCookieHeader & clearAdminCookieHeader", () => {
        it("creates cookie header with Secure for https requests", () => {
            const req = new Request("https://example.com/admin");
            const header = createAdminCookieHeader("sample-token", req);
            expect(header).toContain("cr_admin_session=sample-token");
            expect(header).toContain("Path=/");
            expect(header).toContain("HttpOnly");
            expect(header).toContain("SameSite=Strict");
            expect(header).toContain("Secure");
            expect(header).toContain("Max-Age=2592000");
        });

        it("creates cookie header without Secure for http requests", () => {
            const req = new Request("http://localhost:3000/admin");
            const header = createAdminCookieHeader("sample-token", req);
            expect(header).not.toContain("Secure");
            expect(header).toContain("HttpOnly");
        });

        it("clears cookie with Max-Age=0 and Secure on https", () => {
            const req = new Request("https://example.com/logout");
            const header = clearAdminCookieHeader(req);
            expect(header).toContain("cr_admin_session=");
            expect(header).toContain("Max-Age=0");
            expect(header).toContain("Secure");
        });

        it("clears cookie without Secure on http", () => {
            const req = new Request("http://localhost:3000/logout");
            const header = clearAdminCookieHeader(req);
            expect(header).not.toContain("Secure");
            expect(header).toContain("Max-Age=0");
        });
    });

    describe("verifyPasscodeHash error handling", () => {
        it("returns false for invalid hash format", async () => {
            expect(await verifyPasscodeHash("mypassword", "malformed")).toBe(false);
            expect(await verifyPasscodeHash("mypassword", ".")).toBe(false);
            expect(await verifyPasscodeHash("mypassword", "salt_only.")).toBe(false);
            expect(await verifyPasscodeHash("mypassword", ".hash_only")).toBe(false);
        });

        it("catches base64 decoding errors and returns false", async () => {
            expect(await verifyPasscodeHash("mypassword", "invalid-char!@#.valid")).toBe(false);
        });
    });

    describe("resolveSigningSecret", () => {
        it("returns ADMIN_SECRET if present in env", () => {
            const secret = resolveSigningSecret({ ADMIN_SECRET: "my-custom-env-secret-string" });
            expect(secret).toBe("my-custom-env-secret-string");
        });

        it("returns fallback in dev environment or generates secret", () => {
            const secret1 = resolveSigningSecret({});
            expect(typeof secret1).toBe("string");
            expect(secret1.length).toBeGreaterThan(10);
            const secret2 = resolveSigningSecret(undefined);
            expect(typeof secret2).toBe("string");
        });
    });
});
