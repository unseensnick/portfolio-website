"use client";

import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatExternalUrl } from "@/lib/url-utils";
import {
    cn,
    commonClasses,
    createIconContainer,
    createResponsiveCardHover,
    createResponsiveCardPadding,
    createResponsiveSpacing,
    createResponsiveText,
} from "@/lib/utils";
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
        createResponsiveCardPadding(isMobile),
        hoverEffect && [
            commonClasses.transitionSlow,
            createResponsiveCardHover(isMobile),
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
 * Card with centered icon, title, subtitle and optional link using responsive utilities
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
                    createIconContainer(isMobile ? "sm" : "lg"),
                    "mx-auto bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300"
                )}
            >
                <Icon
                    className={cn(
                        "text-primary",
                        isMobile ? "size-6" : "size-8"
                    )}
                />
            </div>

            <div className={createResponsiveSpacing("section", isMobile)}>
                <h3
                    className={cn(
                        "font-bold text-foreground group-hover:text-primary transition-colors duration-300",
                        createResponsiveText("cardTitle", isMobile)
                    )}
                >
                    {title}
                </h3>
                <p
                    className={cn(
                        "text-muted-foreground",
                        createResponsiveText("cardSubtitle", isMobile)
                    )}
                >
                    {subtitle}
                </p>
            </div>

            {linkText && textLinkHref && (
                <Link
                    href={formattedTextLinkHref}
                    target={isEmailLink || isExternal ? "_blank" : undefined}
                    className={cn(
                        "inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium group-hover:underline",
                        commonClasses.transition
                    )}
                >
                    {linkText}
                    {!isEmailLink && <ExternalLink className="size-4" />}
                </Link>
            )}
        </div>
    );

    return (
        <ResponsiveCard
            href={href}
            isExternal={isExternal}
            className={className}
        >
            {renderContent()}
        </ResponsiveCard>
    );
}
