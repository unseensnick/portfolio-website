"use client";

import { setupScrollListener } from "@/lib/navigation-utils";
import { getSectionIcon } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface NavLink {
    href: string;
    label: string;
    icon?: string | LucideIcon;
}

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

    // Map nav links to sections for scroll listener (needs string icons)
    const scrollSections = navLinks.map((link) => {
        const sectionId = link.href.replace("#", "");
        return {
            id: sectionId,
            label: link.label,
            icon: typeof link.icon === "string" ? link.icon : sectionId,
        };
    });

    // Map nav links to sections for components (needs LucideIcon components)
    const sections = navLinks.map((link) => {
        const sectionId = link.href.replace("#", "");
        return {
            id: sectionId,
            label: link.label,
            icon: typeof link.icon === "string" ? getSectionIcon(link.icon) : 
                  typeof link.icon === "function" ? link.icon : 
                  getSectionIcon(sectionId), // Fallback to section ID mapping
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