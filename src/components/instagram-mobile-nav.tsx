"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import {
    Section,
    scrollToSection,
    setupScrollListener,
} from "@/lib/navigation-utils";
import { FolderOpen, Home, LucideIcon, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Mapping of icon names to Lucide icon components
 * Used to dynamically render icons based on string names
 */
const iconMap: Record<string, LucideIcon> = {
    Home: Home,
    FolderOpen: FolderOpen,
    User: User,
    Mail: Mail,
};

/**
 * Navigation link data structure
 * @property href - URL or anchor for the link (e.g. "#about")
 * @property label - Display text for the link
 * @property icon - Optional icon name from iconMap
 */
interface NavLink {
    href: string;
    label: string;
    icon?: string;
}

/**
 * Props for the InstagramMobileNav component
 * @property navLinks - Array of navigation links to display
 */
interface InstagramMobileNavProps {
    navLinks?: NavLink[];
}

/**
 * Instagram-inspired mobile navigation bar for small viewports
 *
 * Features:
 * - Fixed position at the bottom of the screen
 * - Animated active section indicators
 * - Support for custom icons
 * - Smooth scrolling to sections
 * - Touch feedback effects and animations
 * - Backdrop blur for modern glass effect
 * - Safe area padding for mobile devices with home indicators
 */
export function InstagramMobileNav({ navLinks = [] }: InstagramMobileNavProps) {
    const [activeSection, setActiveSection] = useState<string>(
        navLinks[0]?.href?.replace("#", "") || "home"
    );
    const isMobile = useIsMobile();

    // Convert navigation links to section format for scroll utilities
    const sections: Section[] = navLinks.map((link) => ({
        id: link.href.replace("#", ""),
        label: link.label,
        icon: link.icon,
    }));

    // Set up scroll listener to track active section (mobile only)
    useEffect(() => {
        if (!isMobile) return;

        // setupScrollListener returns a cleanup function
        const cleanup = setupScrollListener(
            sections,
            setActiveSection,
            0,
            true
        );
        return cleanup;
    }, [isMobile, sections]);

    // Don't render on desktop viewports
    if (!isMobile) return null;

    // Handle navigation item click with smooth scroll
    const handleNavigationClick = (sectionId: string) => {
        scrollToSection(sectionId, 0, 0, true);
    };

    return (
        <>
            {/* Fixed mobile navigation bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
                {/* Blurred background with subtle border */}
                <div className="bg-background/95 backdrop-blur-xl border-t border-border/50">
                    {/* Safe area padding for devices with home indicator */}
                    <div className="pb-safe">
                        <nav className="flex items-center justify-around px-4 py-2">
                            {sections.map((section) => {
                                // Get icon component or fallback to Home icon
                                const IconComponent = section.icon
                                    ? iconMap[section.icon]
                                    : Home;
                                const isActive = activeSection === section.id;

                                return (
                                    <button
                                        key={section.id}
                                        onClick={() =>
                                            handleNavigationClick(section.id)
                                        }
                                        className="group relative flex flex-col items-center justify-center p-3 min-w-[64px] transition-all duration-300"
                                        aria-label={`Navigate to ${section.label}`}
                                    >
                                        {/* Icon container with animation effects */}
                                        <div className="relative">
                                            {/* Active indicator background */}
                                            <div
                                                className={`absolute inset-0 rounded-full transition-all duration-300 ${
                                                    isActive
                                                        ? "bg-primary/10 scale-125"
                                                        : "bg-transparent scale-100 group-hover:bg-muted/50 group-hover:scale-110"
                                                }`}
                                            />

                                            {/* Icon with active state styling */}
                                            <div className="relative z-10 p-2">
                                                <IconComponent
                                                    className={`size-6 transition-all duration-300 ${
                                                        isActive
                                                            ? "text-primary scale-110"
                                                            : "text-muted-foreground group-hover:text-foreground group-hover:scale-105"
                                                    }`}
                                                />
                                            </div>
                                        </div>

                                        {/* Section label with animation */}
                                        <span
                                            className={`text-xs font-medium mt-1 transition-all duration-300 ${
                                                isActive
                                                    ? "text-primary opacity-100 scale-100"
                                                    : "text-muted-foreground opacity-70 scale-95 group-hover:opacity-100 group-hover:scale-100"
                                            }`}
                                        >
                                            {section.label}
                                        </span>

                                        {/* Active indicator dot at top */}
                                        <div
                                            className={`absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary transition-all duration-300 ${
                                                isActive
                                                    ? "opacity-100 scale-100"
                                                    : "opacity-0 scale-50"
                                            }`}
                                        />

                                        {/* Touch feedback ripple effect */}
                                        <div className="absolute inset-0 rounded-full bg-primary/10 scale-0 group-active:scale-150 group-active:opacity-20 transition-all duration-150" />
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Safe area for iPhone home indicator */}
                <div className="h-safe bg-background/95 backdrop-blur-xl" />
            </div>

            {/* Bottom padding to prevent content from being hidden behind navigation */}
            <div className="h-4 w-full" />
        </>
    );
}
