"use client";

import { useEffect, useState } from "react";

/**
 * Hook to track component mount state for SSR safety
 * Prevents hydration mismatches by ensuring client-only code runs after mount
 * 
 * @returns boolean indicating if component is mounted
 */
export function useMounted(): boolean {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return mounted;
} 