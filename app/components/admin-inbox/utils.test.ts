import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatShortTime, fromBase64UrlClient, playAdminAlertSound, QUICK_REPLIES, toBase64UrlClient } from "./utils";

describe("admin-inbox/utils", () => {
    describe("QUICK_REPLIES", () => {
        it("contains pre-defined quick reply strings", () => {
            expect(Array.isArray(QUICK_REPLIES)).toBe(true);
            expect(QUICK_REPLIES.length).toBeGreaterThan(0);
            QUICK_REPLIES.forEach((reply) => {
                expect(typeof reply).toBe("string");
                expect(reply.trim().length).toBeGreaterThan(5);
            });
        });
    });

    describe("toBase64UrlClient & fromBase64UrlClient", () => {
        it("handles empty arrays", () => {
            const empty = new Uint8Array(0);
            const encoded = toBase64UrlClient(empty);
            expect(encoded).toBe("");
            expect(fromBase64UrlClient(encoded)).toEqual(new Uint8Array(0));
        });

        it("accepts ArrayBuffer directly", () => {
            const buffer = new Uint8Array([10, 20, 30, 40]).buffer;
            const encoded = toBase64UrlClient(buffer);
            expect(fromBase64UrlClient(encoded)).toEqual(new Uint8Array([10, 20, 30, 40]));
        });

        it("encodes without +, / or = symbols", () => {
            const bytes = new Uint8Array([255, 254, 253, 252, 251]);
            const encoded = toBase64UrlClient(bytes);
            expect(encoded).not.toContain("+");
            expect(encoded).not.toContain("/");
            expect(encoded).not.toContain("=");
            expect(fromBase64UrlClient(encoded)).toEqual(bytes);
        });

        it("roundtrips arbitrary byte sequences of varying lengths", () => {
            for (let len = 1; len <= 32; len++) {
                const src = new Uint8Array(len);
                for (let i = 0; i < len; i++) src[i] = (i * 29 + 7) & 0xff;
                const encoded = toBase64UrlClient(src);
                const decoded = fromBase64UrlClient(encoded);
                expect(decoded).toEqual(src);
            }
        });
    });

    describe("formatShortTime", () => {
        it("formats timestamps from today with time formatting", () => {
            const now = new Date();
            const formatted = formatShortTime(now.getTime());
            expect(typeof formatted).toBe("string");
            expect(formatted.length).toBeGreaterThan(0);
            // In 2-digit format, it includes a colon (e.g. 12:34 PM or 12:34)
            expect(formatted).toMatch(/:/);
        });

        it("formats timestamps from earlier dates with month and day", () => {
            const past = new Date(2025, 0, 15, 10, 30).getTime();
            const formatted = formatShortTime(past);
            expect(typeof formatted).toBe("string");
            expect(formatted.length).toBeGreaterThan(0);
            // Matches month name (Jan or similar) and day number
            expect(formatted).toMatch(/Jan|15/);
        });

        it("handles invalid timestamps gracefully", () => {
            // NaN produces "Invalid Date" from toLocaleTimeString or throws, caught by try/catch
            const formatted = formatShortTime(NaN);
            expect(typeof formatted).toBe("string");
        });
    });

    describe("playAdminAlertSound", () => {
        let originalWindow: any;

        beforeEach(() => {
            originalWindow = (globalThis as any).window;
            (globalThis as any).window = {};
        });

        afterEach(() => {
            (globalThis as any).window = originalWindow;
            vi.restoreAllMocks();
        });

        it("safely exits if window.AudioContext is not supported", () => {
            delete (globalThis as any).window.AudioContext;
            delete (globalThis as any).window.webkitAudioContext;
            expect(() => playAdminAlertSound()).not.toThrow();
        });

        it("creates oscillator and gain nodes when AudioContext is available", () => {
            vi.useFakeTimers();

            const mockOscillator = {
                type: "sine",
                frequency: { setValueAtTime: vi.fn() },
                connect: vi.fn(),
                start: vi.fn(),
                stop: vi.fn(),
            };

            const mockGain = {
                gain: {
                    setValueAtTime: vi.fn(),
                    exponentialRampToValueAtTime: vi.fn(),
                },
                connect: vi.fn(),
            };

            const mockClose = vi.fn().mockResolvedValue(undefined);
            const mockContextInstance = {
                currentTime: 0,
                destination: {},
                createOscillator: vi.fn().mockReturnValue(mockOscillator),
                createGain: vi.fn().mockReturnValue(mockGain),
                close: mockClose,
            };

            function MockAudioContext() {
                return mockContextInstance;
            }

            (globalThis as any).window.AudioContext = vi.fn().mockImplementation(MockAudioContext);

            playAdminAlertSound();

            expect(mockContextInstance.createOscillator).toHaveBeenCalledTimes(2);
            expect(mockContextInstance.createGain).toHaveBeenCalledTimes(2);
            expect(mockOscillator.start).toHaveBeenCalledTimes(2);
            expect(mockOscillator.stop).toHaveBeenCalledTimes(2);

            vi.advanceTimersByTime(700);
            expect(mockClose).toHaveBeenCalled();

            vi.useRealTimers();
        });

        it("catches errors silently if AudioContext throws", () => {
            function FailingAudioContext() {
                throw new Error("Audio blocked by autoplay policy");
            }
            (globalThis as any).window.AudioContext = vi.fn().mockImplementation(FailingAudioContext);

            expect(() => playAdminAlertSound()).not.toThrow();
        });
    });
});
