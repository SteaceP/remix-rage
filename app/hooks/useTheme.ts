import { useTheme as useThemeContext } from "~/context/ThemeContext";

// Re-export the hook from the context for backward compatibility
export const useTheme = useThemeContext;
