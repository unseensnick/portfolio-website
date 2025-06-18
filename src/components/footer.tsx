"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface FooterProps {
    copyright?: string;
}

/**
 * Responsive footer with extra mobile padding for bottom navigation
 */
export function Footer({
    copyright = "© 2025 All rights reserved.",
}: FooterProps) {
    const isMobile = useIsMobile();

    return (
        <footer
            className={cn(
                "border-t border-border",
                isMobile && "bg-background/50 backdrop-blur-sm"
            )}
            data-tour="footer"
        >
            <div className="text-center text-muted-foreground px-6 py-8 text-xs md:max-w-6xl md:mx-auto md:px-8 md:py-12 md:text-sm">
                {copyright}
            </div>
            {/* Extra padding for mobile navigation bar */}
            {isMobile && <div className="h-24 pb-safe"></div>}
        </footer>
    );
}
