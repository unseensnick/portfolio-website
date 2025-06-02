"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

export function SectionNavigation({ navLinks = [] }) {
    const [activeSection, setActiveSection] = useState(
        navLinks[0]?.href?.replace("#", "") || "home"
    );
    const isMobile = useIsMobile();

    // Convert navLinks to sections format
    const sections = navLinks.map((link) => ({
        id: link.href.replace("#", ""),
        label: link.label,
    }));

    useEffect(() => {
        // Don't set up scroll listener on mobile
        if (isMobile) return;

        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100; // Offset for header

            // Find the current section based on scroll position
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

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Check initial position

        return () => window.removeEventListener("scroll", handleScroll);
    }, [isMobile, sections]);

    // Don't render on mobile - moved after all hooks
    if (isMobile) return null;

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerHeight = 50; // Account for fixed header
            const elementPosition = element.offsetTop - headerHeight;

            window.scrollTo({
                top: elementPosition,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
            <nav className="flex flex-col gap-6">
                {sections.map((section) => {
                    const isActive = activeSection === section.id;

                    return (
                        <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className="group relative flex items-center"
                            aria-label={`Navigate to ${section.label}`}
                        >
                            {/* Dot indicator */}
                            <div
                                className={`size-3 rounded-full transition-all duration-300 ${
                                    isActive
                                        ? "bg-primary scale-125"
                                        : "bg-muted-foreground/30 hover:bg-muted-foreground/60 hover:scale-110"
                                }`}
                            />

                            {/* Label tooltip */}
                            <div
                                className={`absolute right-6 px-3 py-1.5 bg-card border border-border rounded-lg shadow-lg transition-all duration-300 whitespace-nowrap ${
                                    isActive
                                        ? "opacity-100 translate-x-0"
                                        : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                                }`}
                            >
                                <span className="text-sm font-medium text-foreground">
                                    {section.label}
                                </span>

                                {/* Arrow */}
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1 size-2 bg-card border-l border-b border-border rotate-45" />
                            </div>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
