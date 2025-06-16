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
    copyright = "© 2024 All rights reserved.",
}: FooterProps) {
    const isMobile = useIsMobile();

    const footerClasses = cn(
        "border-t border-border",
        isMobile ? "bg-background/50 backdrop-blur-sm" : ""
    );

    const contentClasses = cn(
        "text-center text-muted-foreground",
        isMobile ? "px-6 py-8 text-xs" : "max-w-6xl mx-auto px-8 py-12 text-sm"
    );

    return (
        <footer className={footerClasses} data-tour="footer">
            <div className={contentClasses}>{copyright}</div>
            {/* Extra padding for mobile navigation bar */}
            {isMobile && <div className="h-24 pb-safe"></div>}
        </footer>
    );
}
