"use client";

import { HexagonLogo } from "@/components/hexagon-logo";
import { InstagramMobileNav } from "@/components/instagram-mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
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

interface SiteHeaderProps {
    logo?: string;
    subtitle?: string;
    navLinks?: NavLink[];
    logoSplitAt?: number;
}

/**
 * Main site header with hexagon logo and navigation
 */
export function SiteHeader({
    logo = "YourName",
    subtitle = "Web Developer",
    navLinks = [],
    logoSplitAt,
}: SiteHeaderProps) {
    const isMobile = useIsMobile();
    const [activeSection, setActiveSection] = useState<string>(
        navLinks[0]?.href?.replace("#", "") || "home"
    );
    const [isLogoHovered, setIsLogoHovered] = useState(false);

    const sections: Section[] = navLinks.map((link) => ({
        id: link.href.replace("#", ""),
        label: link.label,
    }));

    // Track active section on desktop
    useEffect(() => {
        if (isMobile) return;
        const cleanup = setupScrollListener(sections, setActiveSection, 100);
        return cleanup;
    }, [isMobile, sections]);

    const handleNavClick = (e: React.MouseEvent, href: string) => {
        e.preventDefault();
        const sectionId = href.replace("#", "");
        scrollToSection(sectionId, 100, 0);
    };

    const handleLogoClick = () => {
        scrollToSection("home", 100, 0);
    };

    return (
        <>
            <header
                className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 flex w-full items-center border-b border-border/50"
                data-tour="navigation"
            >
                <div className="flex h-20 w-full items-center justify-between px-8">
                    <div
                        className="flex items-center"
                        onMouseEnter={() => setIsLogoHovered(true)}
                        onMouseLeave={() => setIsLogoHovered(false)}
                    >
                        <div className="relative z-10">
                            <HexagonLogo
                                logoText={logo}
                                subtitle={subtitle}
                                size={isMobile ? "sm" : "md"}
                                splitAt={logoSplitAt}
                                isHovered={isLogoHovered}
                                onClick={handleLogoClick}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>

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

            <InstagramMobileNav navLinks={navLinks} />
        </>
    );
}
