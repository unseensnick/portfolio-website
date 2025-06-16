"use client";

import { useActiveSection } from "@/hooks/use-active-section";
import { useIsMobile } from "@/hooks/use-mobile";
import { scrollToSection } from "@/lib/navigation-utils";
import { commonClasses } from "@/lib/utils";

interface NavLink {
    href: string;
    label: string;
}

interface SectionNavigationProps {
    navLinks?: NavLink[];
}

/**
 * Desktop-only side navigation with animated dots and tooltips using custom hooks
 * Fixed position on right side, hidden completely on mobile
 */
export function SectionNavigation({ navLinks = [] }: SectionNavigationProps) {
    const isMobile = useIsMobile();

    // Use custom hook for active section management
    const { activeSection, sections } = useActiveSection({
        navLinks,
        offset: 100,
        isMobile: false,
        enabled: !isMobile, // Only track on desktop
    });

    if (isMobile) return null;

    const handleSectionClick = (sectionId: string) => {
        scrollToSection(sectionId, 100, 0, false);
    };

    return (
        <nav
            className="fixed right-8 top-1/2 -translate-y-1/2 z-30 hidden lg:block"
            data-tour="section-navigation"
        >
            <div className="flex flex-col gap-4">
                {sections.map((section) => {
                    const isActive = activeSection === section.id;

                    return (
                        <button
                            key={section.id}
                            onClick={() => handleSectionClick(section.id)}
                            className="group relative flex items-center"
                            aria-label={`Navigate to ${section.label}`}
                        >
                            {/* Dot indicator */}
                            <div
                                className={`size-3 rounded-full border-2 ${commonClasses.transition} ${
                                    isActive
                                        ? "bg-primary border-primary scale-125"
                                        : "bg-transparent border-muted-foreground/40 group-hover:border-primary group-hover:scale-110"
                                }`}
                            />

                            {/* Tooltip */}
                            <div
                                className={`absolute right-6 px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-medium whitespace-nowrap ${commonClasses.transition} ${
                                    isActive
                                        ? "opacity-100 translate-x-0"
                                        : "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                                }`}
                            >
                                {section.label}
                            </div>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
