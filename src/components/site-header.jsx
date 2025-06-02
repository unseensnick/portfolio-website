"use client";

import { InstagramMobileNav } from "@/components/instagram-mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Code, Menu } from "lucide-react";
import { useState } from "react";

/**
 * Site header with logo, navigation links and theme toggle
 * Adapts between mobile and desktop layouts
 */
export function SiteHeader({
    logo = "unseensnick",
    subtitle = "Full Stack Developer",
    navLinks = [],
}) {
    // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isMobile = useIsMobile();

    return (
        <>
            <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 flex w-full items-center border-b border-border/50">
                <div className="flex h-20 w-full items-center justify-between px-8">
                    {/* Logo and brand identity */}
                    <div className="flex items-center gap-4">
                        {/*{isMobile && (
                            <Button
                                className="size-10"
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMobileMenuOpen(true)}
                            >
                                <Menu className="size-5" />
                            </Button>
                        )}*/}
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
                                {navLinks.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-300 relative group"
                                    >
                                        {link.label}
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                                    </a>
                                ))}
                            </nav>
                        )}
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Mobile Navigation
            <MobileNavigation
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                navLinks={navLinks}
            />*/}

            {/* Instagram-style mobile navigation bar */}
            <InstagramMobileNav navLinks={navLinks} />
        </>
    );
}
