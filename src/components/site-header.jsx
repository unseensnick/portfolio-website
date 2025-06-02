"use client";

import { ThemeToggle } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarIcon } from "lucide-react";

// Navigation data - matching the main items from app-sidebar
const navigationItems = [
    { title: "Home", url: "#" },
    { title: "Projects", url: "#" },
    { title: "About", url: "#" },
    { title: "Contact", url: "#" },
];

export function SiteHeader() {
    const { toggleSidebar } = useSidebar();
    const isMobile = useIsMobile();

    return (
        <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
            <div className="flex h-14 w-full items-center justify-between px-4">
                {/* Left side - Logo/Brand */}
                <div className="flex items-center gap-3">
                    {isMobile && (
                        <Button
                            className="h-8 w-8"
                            variant="ghost"
                            size="icon"
                            onClick={toggleSidebar}
                        >
                            <SidebarIcon className="h-4 w-4" />
                        </Button>
                    )}
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-foreground">
                            unseensnick
                        </span>
                        <span className="text-sm text-muted-foreground">
                            coding now
                        </span>
                    </div>
                </div>

                {/* Right side - Navigation + Theme Toggle */}
                <div className="flex items-center gap-6">
                    {!isMobile && (
                        <nav className="flex items-center gap-6">
                            {navigationItems.map((item) => (
                                <a
                                    key={item.title}
                                    href={item.url}
                                    className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-200"
                                >
                                    {item.title}
                                </a>
                            ))}
                        </nav>
                    )}
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
