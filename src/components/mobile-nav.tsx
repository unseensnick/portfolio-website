"use client";

import { useActiveSection } from "@/hooks/use-active-section";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMounted } from "@/hooks/use-mounted";
import { scrollToSection } from "@/lib/navigation-utils";
import { cn, commonClasses } from "@/lib/utils";
import { NavLink } from "@/types/portfolio";

interface MobileNavProps {
    navLinks?: NavLink[];
}

/**
 * Mobile navigation for bottom navigation with smooth scrolling using custom hooks
 * Features blur backdrop, safe area padding, and animated indicators
 * iPhone safe with proper home indicator spacing
 */
export function MobileNav({ navLinks = [] }: MobileNavProps) {
    const isMobile = useIsMobile(900);
    const mounted = useMounted();

    const { activeSection, sections } = useActiveSection({
        navLinks,
        offset: 0,
        isMobile: true,
        enabled: isMobile && mounted,
    });

    if (!mounted || !isMobile) return null;

    const handleNavigationClick = (sectionId: string) => {
        scrollToSection(sectionId, 0, 0, true);
    };

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50"
            style={{
                background: "hsl(var(--background) / 0.9)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
                paddingLeft: "max(1rem, env(safe-area-inset-left))",
                paddingRight: "max(1rem, env(safe-area-inset-right))",
            }}
            data-tour="mobile-navigation"
        >
            <div className="flex items-center justify-around px-4 py-3 relative">
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
                                "min-h-[44px]", // iPhone touch target requirement
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

                            {isActive && (
                                <div
                                    className={cn(
                                        `absolute left-1/2 -translate-x-1/2 h-1 bg-primary rounded-full ${commonClasses.transition}`,
                                        "w-8"
                                    )}
                                    style={{
                                        bottom: `calc(-0.75rem - max(0rem, env(safe-area-inset-bottom) - 0.75rem))`,
                                    }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
