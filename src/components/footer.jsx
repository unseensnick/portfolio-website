"use client";

import { useIsMobile } from "@/hooks/use-mobile";

export function Footer({ copyright }) {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
                <div className="px-6 py-8 text-center text-xs text-muted-foreground">
                    {copyright}
                </div>
                {/* Additional bottom padding for mobile navigation */}
                <div className="h-4"></div>
            </footer>
        );
    }

    // Desktop version (unchanged)
    return (
        <footer className="border-t border-border">
            <div className="max-w-6xl mx-auto px-8 py-12 text-center text-sm text-muted-foreground">
                {copyright}
            </div>
        </footer>
    );
}
