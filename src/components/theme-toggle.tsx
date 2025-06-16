"use client";

import { useTheme } from "@/components/theme-provider";
import { useMounted } from "@/hooks/use-mounted";
import { cn, commonClasses } from "@/lib/utils";
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
    const mounted = useMounted();

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
            <div
                className={cn(
                    "size-9 md:size-8 rounded-full",
                    commonClasses.loadingPulse
                )}
            />
        );
    }

    const isDark = resolvedTheme === "dark";

    return (
        <button
            onClick={handleToggle}
            className={cn(
                "group relative size-9 md:size-8 rounded-full bg-muted/50 hover:bg-muted",
                commonClasses.flexCenter,
                commonClasses.transition,
                "hover:shadow-lg hover:shadow-black/5 hover:scale-105",
                "focus:outline-none focus:ring-0 focus:ring-primary/30 focus:ring-offset-0",
                className
            )}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            data-tour="theme-toggle"
            {...props}
        >
            {/* Background transition effect */}
            <div
                className={cn(
                    "absolute inset-0 rounded-full bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100",
                    commonClasses.transition
                )}
            />

            {/* Icon with rotation */}
            <div className="relative transition-transform duration-500 group-hover:scale-110">
                {isDark ? (
                    <Sun className="size-4 text-foreground/80 group-hover:text-primary transition-colors duration-300" />
                ) : (
                    <Moon className="size-4 text-foreground/80 group-hover:text-primary transition-colors duration-300" />
                )}
            </div>

            {/* Subtle glow effect */}
            <div
                className={cn(
                    "absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-50 blur-xl",
                    commonClasses.transition
                )}
            />
        </button>
    );
}
