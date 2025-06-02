"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Command, FolderOpen, Home, Mail, User } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

// Main navigation items (shown in header on desktop, sidebar on mobile)
const mainNavItems = [
    {
        title: "Home",
        url: "#",
        icon: Home,
    },
    {
        title: "Projects",
        url: "#",
        icon: FolderOpen,
    },
    {
        title: "About",
        url: "#",
        icon: User,
    },
    {
        title: "Contact",
        url: "#",
        icon: Mail,
    },
];

export function AppSidebar({ ...props }) {
    const isMobile = useIsMobile();

    return (
        <Sidebar className="top-14 h-[calc(100svh-3.5rem)]" {...props}>
            <SidebarContent>
                {/* Show main navigation on mobile */}
                {isMobile && (
                    <NavMain items={mainNavItems} groupLabel="Navigation" />
                )}
            </SidebarContent>
        </Sidebar>
    );
}
