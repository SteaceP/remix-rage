// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useScrollDirection } from "./useScrollDirection";

describe("useScrollDirection", () => {
    let originalRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    let addEventListenerSpy: any;
    let removeEventListenerSpy: any;

    beforeEach(() => {
        originalRequestAnimationFrame = window.requestAnimationFrame;
        window.requestAnimationFrame = vi.fn().mockImplementation((cb) => {
            cb(0);
            return 1;
        });

        addEventListenerSpy = vi.spyOn(window, "addEventListener");
        removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

        Object.defineProperty(window, "scrollY", {
            writable: true,
            configurable: true,
            value: 0,
        });
    });

    afterEach(() => {
        window.requestAnimationFrame = originalRequestAnimationFrame;
        vi.restoreAllMocks();
    });

    it("defaults to visible (true) initially", () => {
        const { result } = renderHook(() => useScrollDirection());
        expect(result.current).toBe(true);
    });

    it("keeps visible when scrolling down 20px or less", () => {
        const { result } = renderHook(() => useScrollDirection());

        act(() => {
            window.scrollY = 15;
            window.dispatchEvent(new Event("scroll"));
        });

        expect(result.current).toBe(true);
    });

    it("hides header when scrolling down past 20px", () => {
        const { result } = renderHook(() => useScrollDirection());

        act(() => {
            window.scrollY = 50;
            window.dispatchEvent(new Event("scroll"));
        });

        expect(result.current).toBe(false);
    });

    it("shows header again when scrolling up", () => {
        const { result } = renderHook(() => useScrollDirection());

        // First scroll down past 20px
        act(() => {
            window.scrollY = 100;
            window.dispatchEvent(new Event("scroll"));
        });
        expect(result.current).toBe(false);

        // Now scroll back up
        act(() => {
            window.scrollY = 60;
            window.dispatchEvent(new Event("scroll"));
        });
        expect(result.current).toBe(true);
    });

    it("cleans up scroll event listener on unmount", () => {
        const { unmount } = renderHook(() => useScrollDirection());
        expect(addEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));

        unmount();
        expect(removeEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
    });
});
