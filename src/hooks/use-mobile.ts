"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect mobile devices based on screen width
 * @returns {boolean} True if the device is mobile
 */
export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        // Check if window is defined (client-side)
        if (typeof window === "undefined") return;

        // Initial check
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Run on mount
        checkMobile();

        // Add resize listener
        window.addEventListener("resize", checkMobile);

        // Clean up
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return isMobile;
}
