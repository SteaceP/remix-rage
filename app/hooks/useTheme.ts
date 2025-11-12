import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

function getInitialTheme(): Theme {
    if (typeof window === 'undefined') return 'light';
    
    // Check if dark class is already set by pre-hydration script
    if (document.documentElement.classList.contains('dark')) {
        return 'dark';
    }
    return 'light';
}

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
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
        setTheme((prev) => prev === "light" ? "dark" : "light");
    };

    return { theme, toggleTheme };
}
