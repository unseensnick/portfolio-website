"use client";

import { useEffect, useState } from "react";

/**
 * Detects if viewport is mobile-sized (default: <768px)
 * Safe for SSR - always returns false on server
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