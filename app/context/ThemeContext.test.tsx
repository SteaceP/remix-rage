// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./ThemeContext";

describe("ThemeContext & useTheme", () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.classList.remove("dark");

        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: vi.fn().mockImplementation((query) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("throws error when useTheme is called outside ThemeProvider", () => {
        expect(() => renderHook(() => useTheme())).toThrow("useTheme must be used within a ThemeProvider");
    });

    it("defaults to light theme when localStorage is empty and system theme is light", () => {
        const { result } = renderHook(() => useTheme(), {
            wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
        });

        expect(result.current.theme).toBe("light");
        expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("initializes from localStorage saved theme", () => {
        localStorage.setItem("theme", "dark");

        const { result } = renderHook(() => useTheme(), {
            wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
        });

        expect(result.current.theme).toBe("dark");
        expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("initializes from system prefers-color-scheme when localStorage is unset", () => {
        window.matchMedia = vi.fn().mockImplementation((query) => ({
            matches: query === "(prefers-color-scheme: dark)",
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }));

        const { result } = renderHook(() => useTheme(), {
            wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
        });

        expect(result.current.theme).toBe("dark");
        expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("toggles theme between light and dark", () => {
        const { result } = renderHook(() => useTheme(), {
            wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
        });

        expect(result.current.theme).toBe("light");
        expect(document.documentElement.classList.contains("dark")).toBe(false);

        act(() => {
            result.current.toggleTheme();
        });

        expect(result.current.theme).toBe("dark");
        expect(document.documentElement.classList.contains("dark")).toBe(true);
        expect(localStorage.getItem("theme")).toBe("dark");

        act(() => {
            result.current.toggleTheme();
        });

        expect(result.current.theme).toBe("light");
        expect(document.documentElement.classList.contains("dark")).toBe(false);
        expect(localStorage.getItem("theme")).toBe("light");
    });

    it("allows direct setTheme call", () => {
        const { result } = renderHook(() => useTheme(), {
            wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
        });

        act(() => {
            result.current.setTheme("dark");
        });

        expect(result.current.theme).toBe("dark");
        expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
});
