"use client";

import { useActiveSection } from "@/hooks/use-active-section";
import { useIsMobile } from "@/hooks/use-mobile";
import { scrollToSection } from "@/lib/navigation-utils";
import { cn, commonClasses } from "@/lib/utils";

interface NavLink {
    href: string;
    label: string;
}

interface InstagramMobileNavProps {
    navLinks?: NavLink[];
}

/**
 * Instagram-style bottom navigation for mobile with smooth scrolling using custom hooks
 * Features blur backdrop, safe area padding, and animated indicators
 */
export function InstagramMobileNav({ navLinks = [] }: InstagramMobileNavProps) {
    const isMobile = useIsMobile();

    // Use custom hook for active section management
    const { activeSection, sections } = useActiveSection({
        navLinks,
        offset: 0,
        isMobile: true,
        enabled: isMobile, // Only track on mobile
    });

    if (!isMobile) return null;

    const handleNavigationClick = (sectionId: string) => {
        scrollToSection(sectionId, 0, 0, true);
    };

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-t border-border/50 pb-safe"
            data-tour="instagram-navigation"
        >
            <div className="flex items-center justify-around px-4 py-3">
                {sections.map((section) => {
                    const isActive = activeSection === section.id;
                    const Icon = section.icon;

                    if (!Icon) return null;

                    return (
                        <button
                            key={section.id}
                            onClick={() => handleNavigationClick(section.id)}
                            className={cn(
                                `relative flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${commonClasses.transition}`,
                                "min-w-0 flex-1 max-w-20",
                                isActive
                                    ? "text-primary bg-primary/10"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                            aria-label={`Navigate to ${section.label}`}
                        >
                            <Icon
                                className={cn(
                                    commonClasses.transition,
                                    isActive ? "size-6" : "size-5"
                                )}
                            />
                            <span
                                className={cn(
                                    `text-xs font-medium ${commonClasses.transition} truncate w-full text-center`,
                                    isActive ? "opacity-100" : "opacity-70"
                                )}
                            >
                                {section.label}
                            </span>

                            {/* Active indicator */}
                            <div
                                className={cn(
                                    `absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full ${commonClasses.transition}`,
                                    isActive
                                        ? "w-8 opacity-100"
                                        : "w-0 opacity-0"
                                )}
                            />
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
