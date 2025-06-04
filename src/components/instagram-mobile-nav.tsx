"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { FolderOpen, Home, LucideIcon, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";

// Icon mapping for navigation items
const iconMap: Record<string, LucideIcon> = {
    Home: Home,
    FolderOpen: FolderOpen,
    User: User,
    Mail: Mail,
};

interface NavLink {
    href: string;
    label: string;
    icon?: string;
}

interface Section {
    id: string;
    label: string;
    icon?: string;
}

interface InstagramMobileNavProps {
    navLinks?: NavLink[];
}

/**
 * Instagram-style mobile navigation bar with animated indicators
 * Only renders on mobile devices and tracks active section while scrolling
 */
export function InstagramMobileNav({ navLinks = [] }: InstagramMobileNavProps) {
    const [activeSection, setActiveSection] = useState<string>(
        navLinks[0]?.href?.replace("#", "") || "home"
    );
    const isMobile = useIsMobile();

    // Convert navLinks to sections format
    const sections: Section[] = navLinks.map((link) => ({
        id: link.href.replace("#", ""),
        label: link.label,
        icon: link.icon,
    }));

    // Update active section on scroll
    useEffect(() => {
        if (!isMobile) return;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Check if user is at the bottom of the page
            const isAtBottom =
                Math.ceil(currentScrollY + windowHeight) >= documentHeight - 10;

            // If at bottom, set the last section as active
            if (isAtBottom && sections.length > 0) {
                setActiveSection(sections[sections.length - 1].id);
                return;
            }

            // Update active section based on scroll position
            const scrollPosition = currentScrollY + 150; // Increased offset for better detection

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = document.getElementById(sections[i].id);
                if (section) {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    const sectionBottom = sectionTop + sectionHeight;

                    // Check if the scroll position is within this section
                    if (
                        scrollPosition >= sectionTop &&
                        scrollPosition < sectionBottom + 100
                    ) {
                        setActiveSection(sections[i].id);
                        break;
                    }
                    // For sections that are partially visible
                    else if (scrollPosition >= sectionTop) {
                        setActiveSection(sections[i].id);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        // Call immediately to set initial state
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isMobile, sections]);

    // Don't render on desktop
    if (!isMobile) return null;

    // Smooth scroll to target section with offset
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerHeight = 40;
            let elementPosition: number;

            // Special handling for the last section (contact)
            if (sectionId === sections[sections.length - 1]?.id) {
                // Scroll to bottom for contact section
                const documentHeight = document.documentElement.scrollHeight;
                const windowHeight = window.innerHeight;
                elementPosition = documentHeight - windowHeight;
            } else {
                const extraOffset = 0; // Additional offset to scroll further down
                elementPosition =
                    element.offsetTop - headerHeight + extraOffset;
            }

            window.scrollTo({
                top: elementPosition,
                behavior: "smooth",
            });
        }
    };

    return (
        <>
            {/* Fixed mobile navigation bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
                {/* Blurred background */}
                <div className="bg-background/95 backdrop-blur-xl border-t border-border/50">
                    {/* Safe area padding for devices with home indicator */}
                    <div className="pb-safe">
                        <nav className="flex items-center justify-around px-4 py-2">
                            {sections.map((section) => {
                                const IconComponent = section.icon
                                    ? iconMap[section.icon]
                                    : Home;
                                const isActive = activeSection === section.id;

                                return (
                                    <button
                                        key={section.id}
                                        onClick={() =>
                                            scrollToSection(section.id)
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

                                            {/* Icon */}
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

                                        {/* Active indicator dot */}
                                        <div
                                            className={`absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary transition-all duration-300 ${
                                                isActive
                                                    ? "opacity-100 scale-100"
                                                    : "opacity-0 scale-50"
                                            }`}
                                        />

                                        {/* Touch feedback effect */}
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

            {/* Bottom padding to prevent content from being hidden */}
            <div className="h-4 w-full" />
        </>
    );
}
