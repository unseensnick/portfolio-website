"use client";

import { useIsMobile } from "@/hooks/use-mobile";

interface FooterProps {
    copyright?: string;
}

/**
 * Simple footer component with copyright text
 * Adapts layout and adds padding for mobile navigation on small screens
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
