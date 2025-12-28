import { describe, it, expect, beforeEach, vi } from "vitest";
import { checkRateLimit, getRateLimitKey } from "./rate-limit.server";

describe("checkRateLimit", () => {
    beforeEach(() => {
        // Reset rate limit store between tests by using unique identifiers
        vi.useFakeTimers();
    });

    it("allows first request", () => {
        const id = `test-${Date.now()}-${Math.random()}`;
        const result = checkRateLimit(id, 3, 60000);

        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(2);
    });

    it("allows requests up to the limit", () => {
        const id = `test-${Date.now()}-${Math.random()}`;

        const r1 = checkRateLimit(id, 3, 60000);
        expect(r1.allowed).toBe(true);
        expect(r1.remaining).toBe(2);

        const r2 = checkRateLimit(id, 3, 60000);
        expect(r2.allowed).toBe(true);
        expect(r2.remaining).toBe(1);

        const r3 = checkRateLimit(id, 3, 60000);
        expect(r3.allowed).toBe(true);
        expect(r3.remaining).toBe(0);
    });

    it("blocks requests after limit exceeded", () => {
        const id = `test-${Date.now()}-${Math.random()}`;

        checkRateLimit(id, 2, 60000);
        checkRateLimit(id, 2, 60000);

        const blocked = checkRateLimit(id, 2, 60000);
        expect(blocked.allowed).toBe(false);
        expect(blocked.remaining).toBe(0);
    });

    it("resets after window expires", () => {
        const id = `test-${Date.now()}-${Math.random()}`;

        checkRateLimit(id, 1, 1000);
        const blocked = checkRateLimit(id, 1, 1000);
        expect(blocked.allowed).toBe(false);

        // Advance time past the window
        vi.advanceTimersByTime(1500);

        const afterReset = checkRateLimit(id, 1, 1000);
        expect(afterReset.allowed).toBe(true);
    });
});

describe("getRateLimitKey", () => {
    it("extracts IP from CF-Connecting-IP header", () => {
        const request = new Request("https://example.com", {
            headers: { "CF-Connecting-IP": "1.2.3.4" },
        });
        expect(getRateLimitKey(request)).toBe("contact-form:1.2.3.4");
    });

    it("falls back to X-Forwarded-For header", () => {
        const request = new Request("https://example.com", {
            headers: { "X-Forwarded-For": "5.6.7.8, 9.10.11.12" },
        });
        expect(getRateLimitKey(request)).toBe("contact-form:5.6.7.8");
    });

    it("returns unknown when no IP headers present", () => {
        const request = new Request("https://example.com");
        expect(getRateLimitKey(request)).toBe("contact-form:unknown");
    });
});
