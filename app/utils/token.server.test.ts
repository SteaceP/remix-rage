import { describe, it, expect } from "vitest";
import { generateToken, validateToken } from "./token.server";

describe("generateToken", () => {
    it("generates a 64-character hex string", () => {
        const token = generateToken();
        expect(token).toHaveLength(64);
        expect(token).toMatch(/^[0-9a-f]+$/);
    });

    it("generates unique tokens", () => {
        const tokens = new Set(Array.from({ length: 100 }, () => generateToken()));
        expect(tokens.size).toBe(100);
    });
});

describe("validateToken", () => {
    it("returns true for matching tokens", () => {
        const token = generateToken();
        expect(validateToken(token, token)).toBe(true);
    });

    it("returns false for non-matching tokens", () => {
        const token1 = generateToken();
        const token2 = generateToken();
        expect(validateToken(token1, token2)).toBe(false);
    });

    it("returns false for empty stored token", () => {
        expect(validateToken("", "sometoken")).toBe(false);
    });

    it("returns false for empty form token", () => {
        expect(validateToken("sometoken", "")).toBe(false);
    });

    it("returns false for different length tokens", () => {
        expect(validateToken("short", "muchlongertoken")).toBe(false);
    });
});
