"use client";

import { HexagonLogo } from "@/components/hexagon-logo";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { TourControls } from "@/components/tour-controls";
import { useActiveSection } from "@/hooks/use-active-section";
import { useIsMobile } from "@/hooks/use-mobile";
import { scrollToSection } from "@/lib/navigation-utils";
import { commonClasses } from "@/lib/utils";
import { NavLink } from "@/types/portfolio";
import { useState } from "react";

interface SiteHeaderProps {
    logo?: string;
    subtitle?: string;
    navLinks?: NavLink[];
    logoSplitAt?: number;
}

/**
 * Main site header with hexagon logo and navigation using custom hooks
 */
export function SiteHeader({
    logo = "YourName",
    subtitle = "Web Developer",
    navLinks = [],
    logoSplitAt,
}: SiteHeaderProps) {
    const isMobile = useIsMobile(900);
    const [isLogoHovered, setIsLogoHovered] = useState(false);

    const { activeSection } = useActiveSection({
        navLinks,
        offset: 100,
        isMobile: false,
        enabled: !isMobile, // Only track on desktop
    });

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
                                splitAt={logoSplitAt}
                                isHovered={isLogoHovered}
                                onClick={handleLogoClick}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        {!isMobile && (
                            <nav
                                className="flex items-center gap-8"
                                data-tour="desktop-navigation"
                            >
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
                                            className={`text-sm font-medium ${commonClasses.transition} relative group ${
                                                isActive
                                                    ? "text-primary"
                                                    : "text-foreground/80 hover:text-primary"
                                            }`}
                                        >
                                            {link.label}
                                            <span
                                                className={`absolute -bottom-1 left-0 h-0.5 bg-primary ${commonClasses.transition} ${
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

                        <div className="flex items-center gap-2">
                            {isMobile && <TourControls variant="compact" />}
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </header>

            <MobileNav navLinks={navLinks} />
        </>
    );
}
