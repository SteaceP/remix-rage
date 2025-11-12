import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

export function useTheme() {
    const [theme, setTheme] = useState<Theme | undefined>(undefined);

    // Initialize theme on mount (client-side only)
    useEffect(() => {
        const stored = localStorage.getItem("theme") as Theme | null;
        if (stored) {
            setTheme(stored);
            return;
        }
        setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }, []);

    useEffect(() => {
        if (!theme) return;
        const root = document.documentElement;
        // Toggle only the 'dark' class; absence implies light mode
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return { theme: theme || "light", toggleTheme };
}
