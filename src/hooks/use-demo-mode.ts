"use client";

import { shouldUseDemoMode } from "@/lib/demo-utils";
import { useEffect, useState } from "react";

/**
 * Custom hook to detect if demo mode is active
 * Checks both environment variables and URL parameters
 * Updates when URL parameters change (environment variables don't change at runtime)
 * @returns boolean indicating if demo mode is currently active
 */
export function useDemoMode(): boolean {
    const [isDemoMode, setIsDemoMode] = useState(() => {
        // Initialize with environment variable check (available on first render)
        return shouldUseDemoMode();
    });

    useEffect(() => {
        // Check demo mode on client side
        const checkDemoMode = () => {
            if (typeof window === 'undefined') return false;
            
            const urlParams = new URLSearchParams(window.location.search);
            const searchParams = Object.fromEntries(urlParams.entries());
            
            return shouldUseDemoMode(searchParams);
        };

        // Update state if initial value differs from client-side check
        const currentDemoMode = checkDemoMode();
        if (currentDemoMode !== isDemoMode) {
            setIsDemoMode(currentDemoMode);
        }

        // Only listen for URL changes if environment variable is not set
        // (environment variable takes precedence and doesn't change at runtime)
        if (!shouldUseDemoMode()) {
            const handleUrlChange = () => {
                const newDemoMode = checkDemoMode();
                setIsDemoMode(newDemoMode);
            };

            window.addEventListener('popstate', handleUrlChange);

            return () => {
                window.removeEventListener('popstate', handleUrlChange);
            };
        }
    }, [isDemoMode]);

    return isDemoMode;
} 