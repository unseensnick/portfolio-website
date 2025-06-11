"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect mobile viewport size
 * 
 * Returns true when viewport width is below the breakpoint.
 * Handles SSR safely by defaulting to false.
 */
export function useIsMobile(breakpoint: number = 768): boolean {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const checkMobile = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, [breakpoint]);

    return isMobile;
}