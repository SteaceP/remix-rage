// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTheme } from "./useTheme";
import { ThemeProvider } from "~/context/ThemeContext";

describe("useTheme hook re-export", () => {
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
    it("provides the current theme and toggle function when wrapped in ThemeProvider", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => <ThemeProvider>{children}</ThemeProvider>;

        const { result } = renderHook(() => useTheme(), { wrapper });

        expect(result.current.theme).toBe("light");
        expect(typeof result.current.toggleTheme).toBe("function");

        act(() => {
            result.current.toggleTheme();
        });

        expect(result.current.theme).toBe("dark");
    });
});
