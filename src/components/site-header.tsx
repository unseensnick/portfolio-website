"use client";

import { InstagramMobileNav } from "@/components/instagram-mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { scrollToSection, setupScrollListener } from "@/lib/navigation-utils";
import { Code } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Navigation link data structure
 * @property href - URL or anchor for the link (e.g. "#about")
 * @property label - Display text for the link
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
 * @property logo - Text to display as the site logo
 * @property subtitle - Small text below the logo
 * @property navLinks - Array of navigation links
 */
interface SiteHeaderProps {
    logo?: string;
    subtitle?: string;
    navLinks?: NavLink[];
}

/**
 * Responsive site header with navigation and theme toggle
 *
 * Features:
 * - Adapts between mobile and desktop layouts
 * - Highlights active section based on scroll position
 * - Smooth scrolling to sections on click
 * - Fixed positioning with subtle background blur
 */
export function SiteHeader({
    logo = "unseensnick",
    subtitle = "Full Stack Developer",
    navLinks = [],
}: SiteHeaderProps) {
    const isMobile = useIsMobile();
    const [activeSection, setActiveSection] = useState<string>(
        navLinks[0]?.href?.replace("#", "") || "home"
    );

    // Convert navLinks to sections format for utility functions
    const sections: Section[] = navLinks.map((link) => ({
        id: link.href.replace("#", ""),
        label: link.label,
    }));

    // Set up scroll listener to track active section (desktop only)
    useEffect(() => {
        if (isMobile) return;

        // setupScrollListener returns a cleanup function
        const cleanup = setupScrollListener(sections, setActiveSection, 100);
        return cleanup;
    }, [isMobile, sections]);

    // Handle navigation link click with smooth scroll
    const handleNavClick = (e: React.MouseEvent, href: string) => {
        e.preventDefault();
        const sectionId = href.replace("#", "");
        scrollToSection(sectionId, 100, 0);
    };

    return (
        <>
            <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 flex w-full items-center border-b border-border/50">
                <div className="flex h-20 w-full items-center justify-between px-8">
                    {/* Logo and brand identity */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Code className="size-5 text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-foreground leading-none">
                                    {logo}
                                </span>
                                <span className="text-xs text-muted-foreground leading-none">
                                    {subtitle}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation links and theme toggle */}
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
                                            {/* Animated underline indicator */}
                                            <span
                                                className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                                                    isActive
                                                        ? "w-full"
                                                        : "w-0 group-hover:w-full"
                                                }`}
                                            ></span>
                                        </button>
                                    );
                                })}
                            </nav>
                        )}
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Mobile navigation shown at bottom of screen on small devices */}
            <InstagramMobileNav navLinks={navLinks} />
        </>
    );
}
