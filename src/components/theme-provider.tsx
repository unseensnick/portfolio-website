"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useMounted } from "@/hooks/use-mounted";
import * as React from "react";

interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: "light" | "dark" | "system";
    attribute?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
    [key: string]: any;
}

interface ThemeContextType {
    theme: string;
    setTheme: (theme: string) => void;
    isMobile: boolean;
}

const ThemeContext = React.createContext<ThemeContextType | null>(null);

/**
 * Theme provider with system detection and smooth transitions
 * Integrates mobile detection into theme context for convenience
 */
export function ThemeProvider({
    children,
    defaultTheme = "system",
    enableSystem = true,
    disableTransitionOnChange = false,
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = React.useState<string>(defaultTheme);
    const mounted = useMounted();
    const isMobile = useIsMobile();

    // Update DOM classes when theme changes (with smooth transitions)
    React.useEffect(() => {
        const root = window.document.documentElement;

        if (!disableTransitionOnChange) {
            root.style.setProperty(
                "transition",
                "color 0.3s ease-in-out, background-color 0.3s ease-in-out, border-color 0.3s ease-in-out"
            );
        }

        root.classList.remove("light", "dark");

        if (theme === "system" && enableSystem) {
            const systemTheme = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
                ? "dark"
                : "light";
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    }, [theme, disableTransitionOnChange, enableSystem]);

    const value = React.useMemo<ThemeContextType>(
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
 * Throws error if used outside provider
 */
export function useTheme(): ThemeContextType {
    const context = React.useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
