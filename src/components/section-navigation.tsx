"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { scrollToSection, setupScrollListener } from "@/lib/navigation-utils";
import { useEffect, useState } from "react";

interface NavLink {
    href: string;
    label: string;
}

interface Section {
    id: string;
    label: string;
}

interface SectionNavigationProps {
    navLinks?: NavLink[];
}

/**
 * Desktop-only section navigation with animated tooltips
 * Provides visual indicators for the current active section
 */
export function SectionNavigation({ navLinks = [] }: SectionNavigationProps) {
    const [activeSection, setActiveSection] = useState<string>(
        navLinks[0]?.href?.replace("#", "") || "home"
    );
    const isMobile = useIsMobile();

    // Convert navLinks to sections format
    const sections: Section[] = navLinks.map((link) => ({
        id: link.href.replace("#", ""),
        label: link.label,
    }));

    useEffect(() => {
        // Don't set up scroll listener on mobile
        if (isMobile) return;

        const cleanup = setupScrollListener(sections, setActiveSection, 100);
        return cleanup;
    }, [isMobile, sections]);

    // Don't render on mobile - moved after all hooks
    if (isMobile) return null;

    // Handle navigation click using utility function
    const handleSectionClick = (sectionId: string) => {
        scrollToSection(sectionId, 100, 0); // decrease if scrolling too far
    };

    return (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
            <nav className="flex flex-col gap-6">
                {sections.map((section) => {
                    const isActive = activeSection === section.id;

                    return (
                        <button
                            key={section.id}
                            onClick={() => handleSectionClick(section.id)}
                            className="group relative flex items-center"
                            aria-label={`Navigate to ${section.label}`}
                        >
                            {/* Section indicator dot */}
                            <div
                                className={`size-3 rounded-full transition-all duration-300 ${
                                    isActive
                                        ? "bg-primary scale-125"
                                        : "bg-muted-foreground/30 hover:bg-muted-foreground/60 hover:scale-110"
                                }`}
                            />

                            {/* Section label tooltip */}
                            <div
                                className={`absolute right-6 px-3 py-1.5 bg-card border border-border rounded-lg shadow-lg transition-all duration-300 whitespace-nowrap ${
                                    isActive
                                        ? "opacity-100 translate-x-0"
                                        : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                                }`}
                            >
                                <span className="text-sm font-medium text-foreground">
                                    {section.label}
                                </span>

                                {/* Tooltip arrow */}
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1 size-2 bg-card border-l border-b border-border rotate-45" />
                            </div>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
