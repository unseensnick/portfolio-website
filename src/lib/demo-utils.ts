/**
 * Utility functions for demo mode detection and configuration
 */
import { logger } from "@/lib/utils";

// Track if we've already logged demo mode status to avoid spam
let hasLoggedDemoMode = false;

/**
 * Checks if demo mode is enabled via environment variable
 * @returns true if NEXT_PUBLIC_DEMO_MODE is set to "true"
 */
export function isDemoModeEnabled(): boolean {
    return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}

/**
 * Determines if demo mode should be active based on environment and URL parameters
 * Environment variable takes precedence over URL parameters
 * @param searchParams - URL search parameters to check for demo=true
 * @returns true if demo mode should be active
 */
export function shouldUseDemoMode(searchParams?: URLSearchParams | { [key: string]: string | string[] | undefined }): boolean {
    // Environment variable takes precedence
    if (isDemoModeEnabled()) {
        return true;
    }
    
    // Check URL parameter if search params are provided
    if (searchParams) {
        if (searchParams instanceof URLSearchParams) {
            return searchParams.get("demo") === "true";
        }
        return searchParams.demo === "true";
    }
    
    return false;
}

/**
 * Gets the demo mode indicator text for display
 */
export function getDemoModeIndicator(): string {
    return "Demo Mode";
}

/**
 * Logs demo mode status for debugging - only once to avoid spam
 */
export function logDemoModeStatus(isDemo: boolean, source: "env" | "url" | "disabled"): void {
    if (process.env.NODE_ENV === "development" && !hasLoggedDemoMode && isDemo) {
        const demoLogger = logger.createFeatureLogger("Demo Mode");
        demoLogger.log(`Enabled (source: ${source})`);
        hasLoggedDemoMode = true;
    }
} 