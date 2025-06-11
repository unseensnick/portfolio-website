"use client";

import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import * as React from "react";

interface ThemeToggleProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
}

/**
 * Animated theme toggle with sun/moon icons
 * Shows loading skeleton until mounted to prevent hydration mismatch
 */
export function ThemeToggle({ className, ...props }: ThemeToggleProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState<boolean>(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Resolve actual theme considering system preference
    const resolvedTheme = React.useMemo(() => {
        if (!mounted) return theme;

        if (theme === "system") {
            return window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
        }

        return theme;
    }, [theme, mounted]);

    const handleToggle = () => {
        setTheme(resolvedTheme === "light" ? "dark" : "light");
    };

    if (!mounted) {
        return (
            <div className="size-10 rounded-full bg-muted/50 animate-pulse" />
        );
    }

    const isDark = resolvedTheme === "dark";

    return (
        <button
            onClick={handleToggle}
            className={cn(
                "group relative size-8 rounded-full bg-muted/50 hover:bg-muted transition-all duration-300 flex items-center justify-center",
                "hover:shadow-lg hover:shadow-black/5 hover:scale-105",
                "focus:outline-none focus:ring-0 focus:ring-primary/30 focus:ring-offset-0",
                className
            )}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            {...props}
        >
            {/* Background transition effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Icon with rotation */}
            <div className="relative transition-transform duration-500 group-hover:scale-110">
                {isDark ? (
                    <Sun className="size-4 text-foreground/80 group-hover:text-primary transition-colors duration-300" />
                ) : (
                    <Moon className="size-4 text-foreground/80 group-hover:text-primary transition-colors duration-300" />
                )}
            </div>

            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-xl" />
        </button>
    );
}
