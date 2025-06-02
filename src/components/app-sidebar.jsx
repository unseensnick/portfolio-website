"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { FolderOpen, Home, Mail, User } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

// Icon mapping for navigation items
const iconMap = {
    Home: Home,
    FolderOpen: FolderOpen,
    User: User,
    Mail: Mail,
};

/**
 * Left sidebar component for desktop navigation
 * Renders content based on device type
 */
export function AppSidebar({ navLinks = [], ...props }) {
    const isMobile = useIsMobile();

    // Convert navLinks to the format expected by NavMain
    const mainNavItems = navLinks.map((link) => ({
        title: link.label,
        url: link.href,
        icon: iconMap[link.icon] || Home,
    }));

    return (
        <Sidebar className="top-14 h-[calc(100svh-3.5rem)]" {...props}>
            <SidebarContent>
                {/* Navigation menu for mobile devices */}
                {isMobile && (
                    <NavMain items={mainNavItems} groupLabel="Navigation" />
                )}
            </SidebarContent>
        </Sidebar>
    );
}
