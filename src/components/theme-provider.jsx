"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import * as React from "react";

const ThemeContext = React.createContext(null);

/**
 * Theme provider with system preference detection
 */
export function ThemeProvider({ children, defaultTheme = "system", ...props }) {
    const [theme, setTheme] = React.useState(defaultTheme);
    const [mounted, setMounted] = React.useState(false);
    const isMobile = useIsMobile();

    // Prevent hydration mismatch
    React.useEffect(() => setMounted(true), []);

    // Apply theme class to document root with smooth transitions
    React.useEffect(() => {
        const root = window.document.documentElement;

        // Add transition classes for smooth theme switching
        root.style.setProperty(
            "transition",
            "color 0.3s ease-in-out, background-color 0.3s ease-in-out, border-color 0.3s ease-in-out"
        );

        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
                ? "dark"
                : "light";
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    }, [theme]);

    // Memoize context value
    const value = React.useMemo(
        () => ({
            theme,
            setTheme,
            isMobile,
        }),
        [theme, isMobile]
    );

    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={value} {...props}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * Hook to access theme context
 */
export function useTheme() {
    const context = React.useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
