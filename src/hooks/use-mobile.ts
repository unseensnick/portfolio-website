"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook that detects if the current viewport is mobile-sized
 *
 * @param breakpoint - Width in pixels below which is considered mobile (default: 768px)
 * @returns boolean - True when viewport width is less than the breakpoint
 *
 * Example:
 * ```
 * const isMobile = useIsMobile();
 * // or with custom breakpoint
 * const isSmallScreen = useIsMobile(480);
 * ```
 */
export function useIsMobile(breakpoint: number = 768): boolean {
    // State to track if viewport is mobile width
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        // Skip effect during server-side rendering
        if (typeof window === "undefined") return;

        // Function to check viewport width
        const checkMobile = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        // Run initial check
        checkMobile();

        // Update on window resize
        window.addEventListener("resize", checkMobile);

        // Clean up event listener on component unmount
        return () => window.removeEventListener("resize", checkMobile);
    }, [breakpoint]);

    return isMobile;
}
