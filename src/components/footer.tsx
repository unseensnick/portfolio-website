"use client";

import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Props for the Footer component
 * @property copyright - The copyright text to display (defaults to current year)
 */
interface FooterProps {
    copyright?: string;
}

/**
 * Responsive footer component that displays copyright information
 *
 * Features:
 * - Automatically adapts layout for mobile and desktop viewports
 * - Adds extra padding on mobile to accommodate the bottom navigation bar
 * - Uses backdrop blur effect on mobile for a modern glass-like appearance
 * - Maintains consistent theming with border colors matching site design
 *
 * @param copyright - The copyright text to display
 */
export function Footer({
    copyright = "© 2024 All rights reserved.",
}: FooterProps) {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
                <div className="px-6 py-8 text-center text-xs text-muted-foreground">
                    {copyright}
                </div>
                {/* Extra padding for mobile navigation bar - increased height */}
                <div className="h-24 pb-safe"></div>
            </footer>
        );
    }

    // Desktop version
    return (
        <footer className="border-t border-border">
            <div className="max-w-6xl mx-auto px-8 py-12 text-center text-sm text-muted-foreground">
                {copyright}
            </div>
        </footer>
    );
}
