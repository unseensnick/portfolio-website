"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { FolderOpen, Home, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";

const iconMap = {
    Home: Home,
    FolderOpen: FolderOpen,
    User: User,
    Mail: Mail,
};

export function InstagramMobileNav({ navLinks = [] }) {
    const [activeSection, setActiveSection] = useState(
        navLinks[0]?.href?.replace("#", "") || "home"
    );
    const isMobile = useIsMobile();

    // Convert navLinks to sections format
    const sections = navLinks.map((link) => ({
        id: link.href.replace("#", ""),
        label: link.label,
        icon: link.icon,
    }));

    // Update active section on scroll
    useEffect(() => {
        if (!isMobile) return;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Update active section
            const scrollPosition = currentScrollY + 100;
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = document.getElementById(sections[i].id);
                if (section) {
                    const sectionTop = section.offsetTop;
                    if (scrollPosition >= sectionTop) {
                        setActiveSection(sections[i].id);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isMobile, sections]);

    // Don't render on desktop
    if (!isMobile) return null;

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerHeight = 40;
            const extraOffset = 160; // Additional offset to scroll further down
            const elementPosition =
                element.offsetTop - headerHeight + extraOffset;

            window.scrollTo({
                top: elementPosition,
                behavior: "smooth",
            });
        }
    };

    return (
        <>
            {/* Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
                {/* Background with blur effect */}
                <div className="bg-background/95 backdrop-blur-xl border-t border-border/50">
                    {/* Safe area padding for devices with home indicator */}
                    <div className="pb-safe">
                        <nav className="flex items-center justify-around px-4 py-2">
                            {sections.map((section, index) => {
                                const IconComponent = iconMap[section.icon];
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
                                        {/* Icon container with Instagram-style animation */}
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

                                        {/* Label with fade in/out */}
                                        <span
                                            className={`text-xs font-medium mt-1 transition-all duration-300 ${
                                                isActive
                                                    ? "text-primary opacity-100 scale-100"
                                                    : "text-muted-foreground opacity-70 scale-95 group-hover:opacity-100 group-hover:scale-100"
                                            }`}
                                        >
                                            {section.label}
                                        </span>

                                        {/* Active dot indicator (Instagram style) */}
                                        <div
                                            className={`absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary transition-all duration-300 ${
                                                isActive
                                                    ? "opacity-100 scale-100"
                                                    : "opacity-0 scale-50"
                                            }`}
                                        />

                                        {/* Ripple effect on tap */}
                                        <div className="absolute inset-0 rounded-full bg-primary/10 scale-0 group-active:scale-150 group-active:opacity-20 transition-all duration-150" />
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Home indicator safe area (for newer iPhones) */}
                <div className="h-safe bg-background/95 backdrop-blur-xl" />
            </div>

            {/* Bottom padding to prevent content from being hidden behind nav */}
            <div className="h-20 w-full" />
        </>
    );
}
