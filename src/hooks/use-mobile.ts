"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect mobile screen sizes (< 768px)
 */
export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Check on mount
        checkIsMobile();

        // Add event listener
        window.addEventListener("resize", checkIsMobile);

        // Cleanup
        return () => window.removeEventListener("resize", checkIsMobile);
    }, []);

    return isMobile;
}

/**
 * Hook to detect tablet screen sizes (768px - 1024px)
 */
export function useIsTablet(): boolean {
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const checkIsTablet = () => {
            const width = window.innerWidth;
            setIsTablet(width >= 768 && width < 1024);
        };

        // Check on mount
        checkIsTablet();

        // Add event listener
        window.addEventListener("resize", checkIsTablet);

        // Cleanup
        return () => window.removeEventListener("resize", checkIsTablet);
    }, []);

    return isTablet;
}

/**
 * Hook to detect mobile or tablet screen sizes (< 1024px)
 */
export function useIsMobileOrTablet(): boolean {
    const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

    useEffect(() => {
        const checkIsMobileOrTablet = () => {
            setIsMobileOrTablet(window.innerWidth < 1024);
        };

        // Check on mount
        checkIsMobileOrTablet();

        // Add event listener
        window.addEventListener("resize", checkIsMobileOrTablet);

        // Cleanup
        return () => window.removeEventListener("resize", checkIsMobileOrTablet);
    }, []);

    return isMobileOrTablet;
}