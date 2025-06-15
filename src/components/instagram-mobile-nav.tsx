"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import {
    Section,
    scrollToSection,
    setupScrollListener,
} from "@/lib/navigation-utils";
import { FolderOpen, Home, LucideIcon, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";

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

interface InstagramMobileNavProps {
    navLinks?: NavLink[];
}

/**
 * Instagram-style bottom navigation for mobile with smooth scrolling
 * Features blur backdrop, safe area padding, and animated indicators
 */
export function InstagramMobileNav({ navLinks = [] }: InstagramMobileNavProps) {
    const [activeSection, setActiveSection] = useState<string>(
        navLinks[0]?.href?.replace("#", "") || "home"
    );
    const isMobile = useIsMobile();

    const sections: Section[] = navLinks.map((link) => ({
        id: link.href.replace("#", ""),
        label: link.label,
        icon: link.icon,
    }));

    useEffect(() => {
        if (!isMobile) return;

        const cleanup = setupScrollListener(
            sections,
            setActiveSection,
            0,
            true
        );
        return cleanup;
    }, [isMobile, sections]);

    if (!isMobile) return null;

    const handleNavigationClick = (sectionId: string) => {
        scrollToSection(sectionId, 0, 0, true);
    };

    return (
        <>
            <div
                className="fixed bottom-0 left-0 right-0 z-50"
                data-tour="instagram-navigation"
            >
                <div className="bg-background/95 backdrop-blur-xl border-t border-border/50">
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
                                            handleNavigationClick(section.id)
                                        }
                                        className="group relative flex flex-col items-center justify-center p-3 min-w-[64px] transition-all duration-300"
                                        aria-label={`Navigate to ${section.label}`}
                                    >
                                        {/* Icon with animated background */}
                                        <div className="relative">
                                            <div
                                                className={`absolute inset-0 rounded-full transition-all duration-300 ${
                                                    isActive
                                                        ? "bg-primary/10 scale-125"
                                                        : "bg-transparent scale-100 group-hover:bg-muted/50 group-hover:scale-110"
                                                }`}
                                            />

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

                                        {/* Label */}
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

                <div className="h-safe bg-background/95 backdrop-blur-xl" />
            </div>

            <div className="h-4 w-full" />
        </>
    );
}
