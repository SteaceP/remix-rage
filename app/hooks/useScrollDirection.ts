import { useState, useEffect } from "react";

export function useScrollDirection() {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlHeader = () => {
            const currentScrollY = window.scrollY;

            // Only hide header after scrolling down at least 20px
            if (currentScrollY > lastScrollY && currentScrollY > 20) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        const throttledControlHeader = () => {
            window.requestAnimationFrame(controlHeader);
        };

        window.addEventListener("scroll", throttledControlHeader);

        return () => {
            window.removeEventListener("scroll", throttledControlHeader);
        };
    }, [lastScrollY]);

    return isVisible;
}
