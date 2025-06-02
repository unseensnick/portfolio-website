"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { FolderOpen, Home, Mail, User, X } from "lucide-react";
import { useEffect } from "react";

const iconMap = {
    Home: Home,
    FolderOpen: FolderOpen,
    User: User,
    Mail: Mail,
};

export function MobileNavigation({ isOpen, onClose, navLinks }) {
    const isMobile = useIsMobile();

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    // Don't render on desktop
    if (!isMobile) return null;

    const handleLinkClick = (href) => {
        onClose();
        // Small delay to allow menu to close before scrolling
        setTimeout(() => {
            const element = document.getElementById(href.replace("#", ""));
            if (element) {
                const headerHeight = 80;
                const elementPosition = element.offsetTop - headerHeight;
                window.scrollTo({
                    top: elementPosition,
                    behavior: "smooth",
                });
            }
        }, 300);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={onClose}
            />

            {/* Mobile Menu */}
            <div
                className={`fixed inset-x-0 top-0 bg-background border-b border-border z-50 transition-transform duration-300 ease-out ${
                    isOpen ? "translate-y-0" : "-translate-y-full"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Home className="size-4 text-primary" />
                        </div>
                        <span className="text-lg font-semibold text-foreground">
                            Navigation
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="size-10"
                    >
                        <X className="size-5" />
                    </Button>
                </div>

                {/* Navigation Links */}
                <div className="p-6">
                    <nav className="space-y-2">
                        {navLinks.map((link) => {
                            const IconComponent = iconMap[link.icon];
                            return (
                                <button
                                    key={link.href}
                                    onClick={() => handleLinkClick(link.href)}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-card hover:bg-muted transition-all duration-200 text-left group border border-border/50 hover:border-border"
                                >
                                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <IconComponent className="size-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
                                            {link.label}
                                        </span>
                                    </div>
                                    <div className="size-6 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <div className="size-1.5 rounded-full bg-muted-foreground group-hover:bg-primary transition-colors" />
                                    </div>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer */}
                <div className="p-6 pt-0">
                    <div className="text-center py-4 text-sm text-muted-foreground border-t border-border">
                        Tap outside to close
                    </div>
                </div>
            </div>
        </>
    );
}
