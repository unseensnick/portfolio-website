"use client";

import { InstagramMobileNav } from "@/components/instagram-mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { HexagonLogo } from "@/components/ui/hexagon-logo";
import { useIsMobile } from "@/hooks/use-mobile";
import { scrollToSection, setupScrollListener } from "@/lib/navigation-utils";
import { useEffect, useState } from "react";

/**
 * Navigation link data structure
 */
interface NavLink {
    href: string;
    label: string;
}

/**
 * Section data for scroll utilities
 */
interface Section {
    id: string;
    label: string;
}

/**
 * Props for the SiteHeader component
 */
interface SiteHeaderProps {
    logo?: string;
    subtitle?: string;
    navLinks?: NavLink[];
    logoSplitAt?: number;
}

/**
 * Site header with guaranteed working hexagon logo
 */
export function SiteHeader({
    logo = "unseensnick",
    subtitle = "Web Developer", // Using "Web Developer" to match your screenshot
    navLinks = [],
    logoSplitAt,
}: SiteHeaderProps) {
    const isMobile = useIsMobile();
    const [activeSection, setActiveSection] = useState<string>(
        navLinks[0]?.href?.replace("#", "") || "home"
    );
    const [isLogoHovered, setIsLogoHovered] = useState(false);

    // Convert navLinks to sections format for utility functions
    const sections: Section[] = navLinks.map((link) => ({
        id: link.href.replace("#", ""),
        label: link.label,
    }));

    // Set up scroll listener to track active section (desktop only)
    useEffect(() => {
        if (isMobile) return;
        const cleanup = setupScrollListener(sections, setActiveSection, 100);
        return cleanup;
    }, [isMobile, sections]);

    // Handle navigation link click with smooth scroll
    const handleNavClick = (e: React.MouseEvent, href: string) => {
        e.preventDefault();
        const sectionId = href.replace("#", "");
        scrollToSection(sectionId, 100, 0);
    };

    // Handle logo click to scroll to top
    const handleLogoClick = () => {
        scrollToSection("home", 100, 0);
    };

    return (
        <>
            <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 flex w-full items-center border-b border-border/50">
                <div className="flex h-20 w-full items-center justify-between px-8">
                    {/* HEXAGON LOGO - GUARANTEED TO SHOW */}
                    <div
                        className="flex items-center" // Extra wrapper for safety
                        onMouseEnter={() => setIsLogoHovered(true)}
                        onMouseLeave={() => setIsLogoHovered(false)}
                    >
                        {/* Force visible with explicit styling */}
                        <div className="relative z-10">
                            <HexagonLogo
                                logoText={logo}
                                subtitle={subtitle}
                                size={isMobile ? "sm" : "md"}
                                splitAt={logoSplitAt}
                                isHovered={isLogoHovered}
                                onClick={handleLogoClick}
                                className="cursor-pointer" // Ensure it's clickable
                            />
                        </div>
                    </div>

                    {/* Navigation and theme toggle */}
                    <div className="flex items-center gap-8">
                        {!isMobile && (
                            <nav className="flex items-center gap-8">
                                {navLinks.map((link) => {
                                    const sectionId = link.href.replace(
                                        "#",
                                        ""
                                    );
                                    const isActive =
                                        activeSection === sectionId;

                                    return (
                                        <button
                                            key={link.href}
                                            onClick={(e) =>
                                                handleNavClick(e, link.href)
                                            }
                                            className={`text-sm font-medium transition-all duration-300 relative group ${
                                                isActive
                                                    ? "text-primary"
                                                    : "text-foreground/80 hover:text-primary"
                                            }`}
                                        >
                                            {link.label}
                                            <span
                                                className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                                                    isActive
                                                        ? "w-full"
                                                        : "w-0 group-hover:w-full"
                                                }`}
                                            />
                                        </button>
                                    );
                                })}
                            </nav>
                        )}
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Mobile navigation */}
            <InstagramMobileNav navLinks={navLinks} />
        </>
    );
}
