"use client";

import { ThemeToggle } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Code, SidebarIcon } from "lucide-react";

// Navigation data - matching the main items from app-sidebar
const navigationItems = [
    { title: "Home", url: "#home" },
    { title: "Projects", url: "#projects" },
    { title: "About", url: "#about" },
    { title: "Contact", url: "#contact" },
];

export function SiteHeader() {
    const { toggleSidebar } = useSidebar();
    const isMobile = useIsMobile();

    return (
        <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 flex w-full items-center border-b border-border/50">
            <div className="flex h-20 w-full items-center justify-between px-8">
                {/* Left side - Logo/Brand */}
                <div className="flex items-center gap-4">
                    {isMobile && (
                        <Button
                            className="h-10 w-10"
                            variant="ghost"
                            size="icon"
                            onClick={toggleSidebar}
                        >
                            <SidebarIcon className="h-5 w-5" />
                        </Button>
                    )}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Code className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-foreground leading-none">
                                unseensnick
                            </span>
                            <span className="text-xs text-muted-foreground leading-none">
                                Full Stack Developer
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right side - Navigation + Theme Toggle */}
                <div className="flex items-center gap-8">
                    {!isMobile && (
                        <nav className="flex items-center gap-8">
                            {navigationItems.map((item) => (
                                <a
                                    key={item.title}
                                    href={item.url}
                                    className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-300 relative group"
                                >
                                    {item.title}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
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
