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
    "data-tour"?: string;
}

/** Responsive button group for CTA sections */
export function ButtonGroup({
    buttons,
    fullWidthMobile = true,
    className = "",
    ...props
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
            {...props}
        >
            {buttons.map((button, index) => {
                const IconComponent = button.icon;

                return (
                    <Button
                        key={index}
                        variant={button.variant || "default"}
                        size="lg"
                        className={cn(
                            isMobile && fullWidthMobile ? "w-full" : "",
                            button.className
                        )}
                        asChild
                    >
                        <Link
                            href={button.href}
                            target={button.external ? "_blank" : undefined}
                        >
                            {IconComponent && (
                                <IconComponent className="mr-2" />
                            )}
                            {button.text}
                        </Link>
                    </Button>
                );
            })}
        </div>
    );
}
