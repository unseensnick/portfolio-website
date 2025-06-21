"use client";

import { useDemoMode } from "@/hooks/use-demo-mode";
import { getDemoModeIndicator } from "@/lib/demo-utils";

interface DemoModeIndicatorProps {
    /** Additional CSS classes to apply */
    className?: string;
    /** Whether to offset position when other indicators are present */
    offset?: boolean;
}

/**
 * Demo Mode Indicator Component
 * Shows a blue "Demo Mode" badge when demo mode is active
 * Follows DRY principles by centralizing demo mode visual indication
 */
export function DemoModeIndicator({
    className = "",
    offset = false,
}: DemoModeIndicatorProps) {
    const isDemoMode = useDemoMode();

    if (!isDemoMode) {
        return null;
    }

    return (
        <div
            className={`absolute ${offset ? "top-16" : "top-4"} right-4 z-50 bg-primary text-primary-foreground px-3 py-1 rounded text-sm font-medium shadow-lg ${className}`}
        >
            {getDemoModeIndicator()}
        </div>
    );
}
