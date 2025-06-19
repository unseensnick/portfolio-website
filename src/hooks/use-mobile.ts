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

/**
 * Detects if viewport is tablet-sized (768px - 1024px)
 * Returns true for tablet breakpoint range
 */
export function useIsTablet(): boolean {
    const [isTablet, setIsTablet] = useState<boolean>(false);

    useEffect(() => {
        // Skip setup if running on server
        if (typeof window === "undefined") return;

        const checkTablet = () => {
            const width = window.innerWidth;
            setIsTablet(width >= 768 && width < 1024);
        };

        // Initial check
        checkTablet();
        
        // Set up listener
        window.addEventListener("resize", checkTablet);

        return () => window.removeEventListener("resize", checkTablet);
    }, []);

    return isTablet;
}

/**
 * Returns true if viewport should use mobile-style layout
 * This includes both mobile (<768px) and tablet (768px-1024px) for hero section
 */
export function useIsMobileOrTablet(): boolean {
    const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>(false);

    useEffect(() => {
        // Skip setup if running on server
        if (typeof window === "undefined") return;

        const checkMobileOrTablet = () => {
            setIsMobileOrTablet(window.innerWidth < 1024);
        };

        // Initial check
        checkMobileOrTablet();
        
        // Set up listener
        window.addEventListener("resize", checkMobileOrTablet);

        return () => window.removeEventListener("resize", checkMobileOrTablet);
    }, []);

    return isMobileOrTablet;
}