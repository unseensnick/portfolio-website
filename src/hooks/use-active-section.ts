"use client";

import { setupScrollListener } from "@/lib/navigation-utils";
import { getSectionIcon } from "@/lib/utils";
import { NavLink } from "@/types/portfolio";
import { useEffect, useState } from "react";

interface UseActiveSectionOptions {
    navLinks: NavLink[];
    offset?: number;
    isMobile?: boolean;
    enabled?: boolean;
}

/**
 * Custom hook for managing active section state in navigation components
 * Eliminates duplicate logic across site-header, section-navigation, and mobile-nav
 * 
 * @param options Configuration options for active section tracking
 * @returns Object with activeSection state and section mapping
 */
export function useActiveSection({
    navLinks,
    offset = 100,
    isMobile = false,
    enabled = true,
}: UseActiveSectionOptions) {
    const [activeSection, setActiveSection] = useState<string>(
        navLinks[0]?.href?.replace("#", "") || "home"
    );

    const scrollSections = navLinks.map((link) => {
        const sectionId = link.href.replace("#", "");
        return {
            id: sectionId,
            label: link.label,
            icon: link.icon || sectionId,
        };
    });

    const sections = navLinks.map((link) => {
        const sectionId = link.href.replace("#", "");
        return {
            id: sectionId,
            label: link.label,
            icon: getSectionIcon(link.icon || sectionId),
        };
    });

    useEffect(() => {
        if (!enabled) return;

        const cleanup = setupScrollListener(
            scrollSections,
            setActiveSection,
            offset,
            isMobile
        );
        return cleanup;
    }, [enabled, scrollSections, offset, isMobile]);

    return {
        activeSection,
        setActiveSection,
        sections,
    };
} 