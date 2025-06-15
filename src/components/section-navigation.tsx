"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import {
    Section,
    scrollToSection,
    setupScrollListener,
} from "@/lib/navigation-utils";
import { useEffect, useState } from "react";

interface NavLink {
    href: string;
    label: string;
}

interface SectionNavigationProps {
    navLinks?: NavLink[];
}

/**
 * Desktop-only side navigation with animated dots and tooltips
 * Fixed position on right side, hidden completely on mobile
 */
export function SectionNavigation({ navLinks = [] }: SectionNavigationProps) {
    const [activeSection, setActiveSection] = useState<string>(
        navLinks[0]?.href?.replace("#", "") || "home"
    );
    const isMobile = useIsMobile();

    const sections: Section[] = navLinks.map((link) => ({
        id: link.href.replace("#", ""),
        label: link.label,
    }));

    useEffect(() => {
        if (isMobile) return;

        const cleanup = setupScrollListener(
            sections,
            setActiveSection,
            100,
            false
        );
        return cleanup;
    }, [isMobile, sections]);

    if (isMobile) return null;

    const handleSectionClick = (sectionId: string) => {
        scrollToSection(sectionId, 100, 0, false);
    };

    return (
        <div
            className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
            data-tour="section-navigation"
        >
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
                            {/* Navigation dot */}
                            <div
                                className={`size-3 rounded-full transition-all duration-300 ${
                                    isActive
                                        ? "bg-primary scale-125"
                                        : "bg-muted-foreground/30 hover:bg-muted-foreground/60 hover:scale-110"
                                }`}
                            />

                            {/* Tooltip */}
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
