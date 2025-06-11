"use client";

import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatExternalUrl } from "@/lib/url-utils";
import { cn } from "@/lib/utils";
import { ExternalLink, LucideIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface ResponsiveCardProps {
    children: ReactNode;
    className?: string;
    href?: string;
    isExternal?: boolean;
    hoverEffect?: boolean;
}

/**
 * Card component with responsive padding and optional hover effects
 */
export function ResponsiveCard({
    children,
    className = "",
    href,
    isExternal = false,
    hoverEffect = true,
}: ResponsiveCardProps) {
    const isMobile = useIsMobile();

    const cardClasses = cn(
        "group",
        isMobile ? "p-6" : "p-8",
        hoverEffect && [
            "transition-all duration-500",
            isMobile
                ? "hover:bg-muted/50 hover:shadow-lg hover:shadow-black/5"
                : "hover:bg-muted/50 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1",
        ],
        className
    );

    const content = <Card className={cardClasses}>{children}</Card>;

    if (href) {
        return (
            <Link
                href={href}
                target={isExternal ? "_blank" : undefined}
                className="block"
            >
                {content}
            </Link>
        );
    }

    return content;
}

interface IconCardProps {
    icon: LucideIcon;
    title: string;
    subtitle: string;
    href?: string;
    isExternal?: boolean;
    linkText?: string;
    linkHref?: string;
    className?: string;
}

/**
 * Card with centered icon, title, subtitle and optional link
 */
export function IconCard({
    icon: Icon,
    title,
    subtitle,
    href,
    isExternal = false,
    linkText,
    linkHref,
    className = "",
}: IconCardProps) {
    const isMobile = useIsMobile();

    const textLinkHref = linkHref || href;
    const isEmailLink =
        textLinkHref?.startsWith && textLinkHref.startsWith("mailto:");
    const formattedTextLinkHref = textLinkHref
        ? formatExternalUrl(textLinkHref)
        : "#";

    const renderContent = () => (
        <div className="text-center space-y-3 sm:space-y-4">
            <div
                className={cn(
                    "mx-auto flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300",
                    isMobile ? "size-12 rounded-xl" : "size-16 rounded-2xl"
                )}
            >
                <Icon
                    className={cn(
                        "text-primary",
                        isMobile ? "size-6" : "size-8"
                    )}
                />
            </div>

            <div className={cn("space-y-", isMobile ? "1" : "2")}>
                <h3
                    className={cn(
                        "font-bold text-foreground group-hover:text-primary transition-colors duration-300",
                        isMobile ? "text-lg" : "text-xl"
                    )}
                >
                    {title}
                </h3>
                <p
                    className={cn(
                        "text-muted-foreground",
                        isMobile ? "text-sm" : "text-base"
                    )}
                >
                    {subtitle}
                </p>
            </div>

            {linkText &&
                renderLinkText(
                    linkText,
                    formattedTextLinkHref,
                    !!isExternal,
                    !!isEmailLink
                )}
        </div>
    );

    const renderLinkText = (
        text: string,
        href: string,
        isExternal: boolean,
        isEmailLink: boolean
    ) => {
        if (href && href !== "#") {
            return (
                <Link
                    href={href}
                    target={isExternal && !isEmailLink ? "_blank" : "_self"}
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-all duration-300 group-hover:underline"
                >
                    {text}
                    {isExternal && !isEmailLink && (
                        <ExternalLink className="size-3.5" />
                    )}
                </Link>
            );
        }

        return (
            <span className="inline-flex items-center gap-2 text-primary font-medium">
                {text}
                {isExternal && !isEmailLink && (
                    <ExternalLink className="size-3.5" />
                )}
            </span>
        );
    };

    // Make whole card clickable if no separate link
    if (href && !linkHref) {
        return (
            <ResponsiveCard
                href={formatExternalUrl(href)}
                isExternal={isExternal && !href.startsWith("mailto:")}
                className={className}
            >
                {renderContent()}
            </ResponsiveCard>
        );
    }

    return (
        <ResponsiveCard className={className}>{renderContent()}</ResponsiveCard>
    );
}
