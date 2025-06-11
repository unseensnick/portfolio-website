"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

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

interface ButtonGroupProps {
    buttons: ButtonItem[];
    fullWidthMobile?: boolean;
    className?: string;
}

/**
 * Responsive button group with automatic mobile/desktop layout adaptation
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
                            isMobile && fullWidthMobile ? "w-full" : "",
                            isDefault
                                ? "bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-lg hover:shadow-primary/20"
                                : "border-2 hover:bg-muted",
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
