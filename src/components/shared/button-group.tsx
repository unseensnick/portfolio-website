"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

/**
 * Button configuration for use in ButtonGroup
 * @property text - Button label text
 * @property href - URL destination (internal or external)
 * @property icon - Optional Lucide icon component
 * @property variant - Button styling variant
 * @property external - Whether link opens in new tab
 * @property className - Additional CSS classes
 */
interface ButtonItem {
    text: string;
    href: string;
    icon?: LucideIcon;
    variant?:
        | "default"
        | "outline"
        | "secondary"
        | "destructive"
        | "ghost"
        | "link";
    external?: boolean;
    className?: string;
}

/**
 * Props for ButtonGroup component
 * @property buttons - Array of button configurations
 * @property fullWidthMobile - Whether buttons take full width on mobile
 * @property className - Additional CSS classes for container
 */
interface ButtonGroupProps {
    buttons: ButtonItem[];
    fullWidthMobile?: boolean;
    className?: string;
}

/**
 * Renders a responsive group of buttons with consistent styling
 *
 * Automatically adapts between mobile (stacked) and desktop (row) layouts
 * Handles external links and icon placement consistently
 */
export function ButtonGroup({
    buttons,
    fullWidthMobile = true,
    className = "",
}: ButtonGroupProps) {
    const isMobile = useIsMobile();

    if (!buttons.length) return null;

    return (
        <div
            className={cn(
                isMobile
                    ? fullWidthMobile
                        ? "flex flex-col gap-3 pt-4"
                        : "flex flex-wrap gap-3 pt-4"
                    : "flex flex-col sm:flex-row gap-4 pt-4",
                className
            )}
        >
            {buttons.map((button, index) => {
                const IconComponent = button.icon;
                const isDefault = button.variant !== "outline";

                return (
                    <Button
                        key={index}
                        variant={button.variant || "default"}
                        size={isMobile ? "lg" : "default"}
                        className={cn(
                            // Width control
                            isMobile && fullWidthMobile ? "w-full" : "",
                            // Custom styling based on variant
                            isDefault
                                ? "bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-lg hover:shadow-primary/20"
                                : "border-2 hover:bg-muted",
                            // Consistent sizing based on viewport
                            isMobile
                                ? "py-4 text-base font-medium"
                                : "px-8 py-6 text-base font-medium",
                            "transition-all duration-300",
                            button.className
                        )}
                        asChild
                    >
                        <Link
                            href={button.href}
                            target={button.external ? "_blank" : undefined}
                        >
                            {IconComponent && (
                                <IconComponent
                                    className={cn(
                                        isMobile ? "size-4" : "size-5",
                                        "mr-2"
                                    )}
                                />
                            )}
                            {button.text}
                        </Link>
                    </Button>
                );
            })}
        </div>
    );
}
