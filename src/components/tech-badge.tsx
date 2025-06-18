"use client";

import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { safelyExtractNames } from "@/lib/payload-safe-helpers";
import { cn, createResponsiveBadge, createResponsiveGap } from "@/lib/utils";

interface TechBadgeProps {
    text: string;
    className?: string;
    size?: "sm" | "md" | "lg";
    isMobile?: boolean;
}

/**
 * Technology badge with responsive sizing using utility patterns
 */
export function TechBadge({
    text,
    className,
    size = "md",
    isMobile = false,
}: TechBadgeProps) {
    return (
        <Badge
            variant="secondary"
            className={cn(
                "rounded-full font-medium transition-colors duration-300 flex-shrink-0",
                "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary",
                "dark:bg-primary/25 dark:text-foreground",
                "dark:hover:bg-primary/35 dark:hover:text-foreground",
                createResponsiveBadge(size, isMobile),
                className
            )}
        >
            {text}
        </Badge>
    );
}

interface TechBadgeGroupProps {
    technologies?: string[] | { name?: string }[];
    size?: "sm" | "md" | "lg";
    className?: string;
    maxRows?: number;
    showCount?: boolean;
}

/**
 * Displays technology badges with natural wrapping and optional row limiting
 * Uses safe helpers to handle PayloadCMS live preview null values
 */
export function TechBadgeGroup({
    technologies = [],
    size = "md",
    className,
    maxRows,
    showCount = true,
}: TechBadgeGroupProps) {
    const isMobile = useIsMobile();
    const validTechnologies = safelyExtractNames(technologies);

    if (validTechnologies.length === 0) return null;

    const containerClass = cn(
        "flex flex-wrap items-start justify-start",
        createResponsiveGap(isMobile),
        className
    );

    // Limit badges shown with "+X more" indicator when maxRows is set
    let displayTechnologies = validTechnologies;
    let hiddenCount = 0;

    if (maxRows && maxRows > 0) {
        const estimatedBadgesPerRow = isMobile ? 3 : 5;
        const maxBadges = maxRows * estimatedBadgesPerRow;

        if (validTechnologies.length > maxBadges) {
            displayTechnologies = validTechnologies.slice(0, maxBadges - 1);
            hiddenCount = validTechnologies.length - displayTechnologies.length;
        }
    }

    return (
        <div className={containerClass}>
            {displayTechnologies.map((tech, index) => (
                <TechBadge
                    key={`${tech}-${index}`}
                    text={tech}
                    size={size}
                    isMobile={isMobile}
                />
            ))}

            {hiddenCount > 0 && showCount && (
                <Badge
                    variant="outline"
                    className={cn(
                        "rounded-full font-medium transition-colors duration-300 flex-shrink-0",
                        "text-muted-foreground border-muted-foreground/30 hover:bg-muted/50",
                        "dark:text-foreground/70 dark:bg-muted/50 dark:hover:bg-muted/70 dark:hover:text-foreground dark:border-none",
                        createResponsiveBadge("md", isMobile)
                    )}
                >
                    +{hiddenCount} more
                </Badge>
            )}
        </div>
    );
}
