"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Create a context to override mobile detection
const MobileOverrideContext = createContext<boolean | null>(null);

// Provider component to force mobile mode
export const MobileOverrideProvider = ({ 
    children, 
    forceMobile = false 
}: { 
    children: React.ReactNode; 
    forceMobile?: boolean; 
}) => {
    return (
        React.createElement(MobileOverrideContext.Provider, { value: forceMobile }, children)
    );
};

/**
 * Detects if viewport is mobile-sized (default: <768px)
 * Safe for SSR - always returns false on server
 * Can be overridden via MobileOverrideProvider for demo purposes
 */
export function useIsMobile(breakpoint: number = 768): boolean {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const mobileOverride = useContext(MobileOverrideContext);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (mobileOverride !== null) return; // Don't set up listener if overridden

        const checkMobile = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, [breakpoint, mobileOverride]);

    // Return override value if set, otherwise return computed value
    return mobileOverride !== null ? mobileOverride : isMobile;
}