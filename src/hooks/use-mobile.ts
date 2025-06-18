"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Create a context to override mobile detection (completely optional)
const MobileOverrideContext = createContext<boolean | null>(null);

// Root provider component (optional - only used when override needed)
export function MobileDetectionProvider({ children }: { children: React.ReactNode }) {
    return React.createElement(
        MobileOverrideContext.Provider,
        { value: null },
        children
    );
}

// Provider component to force mobile mode (used for demos)  
export function MobileOverrideProvider({ 
    children, 
    forceMobile = false 
}: { 
    children: React.ReactNode; 
    forceMobile?: boolean; 
}) {
    return React.createElement(
        MobileOverrideContext.Provider,
        { value: forceMobile },
        children
    );
}

/**
 * Detects if viewport is mobile-sized (default: <768px)
 * Safe for SSR - always returns false on server
 * Safe for any context - works with or without provider
 * Can be overridden via MobileOverrideProvider for demo purposes
 * Native mobile detection works alongside override functionality
 */
export function useIsMobile(breakpoint: number = 768): boolean {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    
    // Safely get override value - will be null if no provider exists (which is fine)
    const mobileOverride = useContext(MobileOverrideContext);

    useEffect(() => {
        // Skip setup if running on server
        if (typeof window === "undefined") return;
        
        // If override is set, don't set up native detection
        if (mobileOverride !== null) return;

        const checkMobile = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        // Initial check
        checkMobile();
        
        // Set up listener for native mobile detection
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, [breakpoint, mobileOverride]);

    // Return override value if set, otherwise return native detection
    return mobileOverride !== null ? mobileOverride : isMobile;
}