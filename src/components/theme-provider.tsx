"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import * as React from "react";

/**
 * Props for the ThemeProvider component
 * @property children - Child components that will have access to theme context
 * @property defaultTheme - Initial theme to use (defaults to "system")
 * @property attribute - HTML attribute to apply the theme with (defaults to "class")
 * @property enableSystem - Whether to enable system theme detection (defaults to true)
 * @property disableTransitionOnChange - Whether to disable transitions when theme changes
 */
interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: "light" | "dark" | "system";
    attribute?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
    [key: string]: any;
}

/**
 * Theme context type definition
 * @property theme - Current theme value ("light", "dark", or "system")
 * @property setTheme - Function to update the theme
 * @property isMobile - Whether the current viewport is mobile
 */
interface ThemeContextType {
    theme: string;
    setTheme: (theme: string) => void;
    isMobile: boolean;
}

// Create context with null default value
const ThemeContext = React.createContext<ThemeContextType | null>(null);

/**
 * Theme provider component for managing theme state across the application
 *
 * Features:
 * - Manages theme state (light, dark, system)
 * - Applies theme to document with proper CSS classes
 * - Supports system theme preference detection
 * - Handles smooth transitions between themes
 * - Provides theme context to child components
 */
export function ThemeProvider({
    children,
    defaultTheme = "system",
    attribute = "class",
    enableSystem = true,
    disableTransitionOnChange = false,
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = React.useState<string>(defaultTheme);
    const [mounted, setMounted] = React.useState<boolean>(false);
    const isMobile = useIsMobile();

    // Set mounted flag after initial render to prevent hydration mismatch
    React.useEffect(() => setMounted(true), []);

    // Apply theme class to document root when theme changes
    React.useEffect(() => {
        const root = window.document.documentElement;

        // Add transition classes for smooth theme switching
        if (!disableTransitionOnChange) {
            root.style.setProperty(
                "transition",
                "color 0.3s ease-in-out, background-color 0.3s ease-in-out, border-color 0.3s ease-in-out"
            );
        }

        // Remove existing theme classes
        root.classList.remove("light", "dark");

        // Apply appropriate theme class
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

    // Memoize context value to prevent unnecessary re-renders
    const value = React.useMemo<ThemeContextType>(
        () => ({
            theme,
            setTheme,
            isMobile,
        }),
        [theme, isMobile]
    );

    // Don't render anything until mounted to prevent hydration issues
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
 * Custom hook to access theme context from any component
 *
 * @returns ThemeContextType object with theme state and functions
 * @throws Error if used outside of ThemeProvider
 *
 * Example:
 * ```
 * const { theme, setTheme } = useTheme();
 * ```
 */
export function useTheme(): ThemeContextType {
    const context = React.useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
