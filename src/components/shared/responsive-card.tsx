"use client";

import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatExternalUrl } from "@/lib/url-utils";
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
 * Shared responsive card component with consistent hover effects
 */
export function ResponsiveCard({
    children,
    className = "",
    href,
    isExternal = false,
    hoverEffect = true,
}: ResponsiveCardProps) {
    const isMobile = useIsMobile();

    const cardClasses = `group ${
        isMobile ? "p-6 border-border bg-card" : "p-8 border-border bg-card"
    } ${
        hoverEffect
            ? isMobile
                ? "hover:bg-muted/50 transition-all duration-500 hover:shadow-lg hover:shadow-black/5"
                : "hover:bg-muted/50 transition-all duration-500 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1"
            : ""
    } ${className}`;

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
 * Specialized card with icon, title and optional link
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

    const iconSize = isMobile ? "size-12" : "size-16";
    const iconContainerSize = isMobile ? "rounded-xl" : "rounded-2xl";
    const titleSize = isMobile ? "text-lg" : "text-xl";
    const subtitleSize = isMobile ? "text-sm" : "text-base";

    // Use the shared utility function to format links
    const textLinkHref = linkHref || href;
    const isEmailLink =
        textLinkHref?.startsWith && textLinkHref.startsWith("mailto:");
    const formattedTextLinkHref = textLinkHref
        ? formatExternalUrl(textLinkHref)
        : "#";

    const renderContent = () => (
        <div className="text-center space-y-3 sm:space-y-4">
            <div
                className={`${iconSize} mx-auto ${iconContainerSize} bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300`}
            >
                <Icon
                    className={`${isMobile ? "size-6" : "size-8"} text-primary`}
                />
            </div>

            <div className={`space-y-${isMobile ? "1" : "2"}`}>
                <h3
                    className={`${titleSize} font-bold text-foreground group-hover:text-primary transition-colors duration-300`}
                >
                    {title}
                </h3>
                <p className={`${subtitleSize} text-muted-foreground`}>
                    {subtitle}
                </p>
            </div>

            {/* Render link text with or without clickable link */}
            {linkText &&
                (linkHref ? (
                    <Link
                        href={formattedTextLinkHref}
                        target={isExternal && !isEmailLink ? "_blank" : "_self"}
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-all duration-300 group-hover:underline"
                    >
                        {linkText}
                        {isExternal && !isEmailLink && (
                            <ExternalLink className="size-3.5" />
                        )}
                    </Link>
                ) : (
                    <span className="inline-flex items-center gap-2 text-primary font-medium">
                        {linkText}
                        {isExternal && !isEmailLink && (
                            <ExternalLink className="size-3.5" />
                        )}
                    </span>
                ))}
        </div>
    );

    // If the card has a href but not a linkHref, make the whole card clickable
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

    // Otherwise just render the card content with a possible link inside
    return (
        <ResponsiveCard className={className}>{renderContent()}</ResponsiveCard>
    );
}
