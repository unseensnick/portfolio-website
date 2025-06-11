"use client";

import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { safelyExtractTechnologyNames } from "@/lib/payload-safe-helpers";
import { cn } from "@/lib/utils";

/**
 * Props for the TechBadge component
 * @property text - Badge text content
 * @property className - Additional CSS classes
 * @property size - Size variant: "sm" (small), "md" (medium), or "lg" (large)
 * @property isMobile - Whether to use mobile-optimized styling
 */
interface TechBadgeProps {
    text: string;
    className?: string;
    size?: "sm" | "md" | "lg";
    isMobile?: boolean;
}

/**
 * A pill-shaped badge for displaying technology names
 *
 * Provides consistent styling with hover effects and size variants
 * Used for technology tags in projects and skills sections
 */
export function TechBadge({
    text,
    className,
    size = "md",
    isMobile = false,
}: TechBadgeProps) {
    // Responsive size variants - smaller on mobile for better density
    const sizeClasses = {
        sm: isMobile ? "px-1.5 py-0.5 text-xs" : "px-2 py-0.5 text-xs",
        md: isMobile ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-[0.8125rem]",
        lg: isMobile ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
    };

    return (
        <Badge
            variant="secondary"
            className={cn(
                "rounded-full font-medium transition-colors duration-300 flex-shrink-0",
                // Light mode styling
                "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary",
                // Dark mode styling - no borders for cleaner look
                "dark:bg-primary/25 dark:text-foreground",
                "dark:hover:bg-primary/35 dark:hover:text-foreground",
                sizeClasses[size],
                className
            )}
        >
            {text}
        </Badge>
    );
}

/**
 * Props for TechBadgeGroup component
 * @property technologies - Array of tech names (string or object with name property)
 * @property size - Size variant for all badges in the group
 * @property className - Additional CSS classes for the container
 * @property maxRows - Optional limit on number of rows (for compact display)
 * @property showCount - Whether to show "+X more" indicator when truncated
 */
interface TechBadgeGroupProps {
    technologies?: string[] | { name?: string }[];
    size?: "sm" | "md" | "lg";
    className?: string;
    maxRows?: number;
    showCount?: boolean;
}

/**
 * Displays multiple technology badges with responsive natural wrapping
 *
 * Features:
 * - Natural flex-wrap layout that adapts to available space
 * - Responsive sizing and spacing for mobile and desktop
 * - Optional row limiting with "show more" indicator
 * - Handles both string arrays and object arrays with name property
 * - Safely handles null/undefined values during live preview using centralized helpers
 * - No more orphaned badges from artificial chunking
 */
export function TechBadgeGroup({
    technologies = [],
    size = "md",
    className,
    maxRows,
    showCount = true,
}: TechBadgeGroupProps) {
    const isMobile = useIsMobile();

    // Use centralized helper to safely extract technology names
    const validTechnologies = safelyExtractTechnologyNames(technologies);

    // Don't render anything if no valid technologies after filtering
    if (validTechnologies.length === 0) return null;

    // Responsive gap and container styling
    const gapClass = isMobile ? "gap-1.5" : "gap-2.5";
    const containerClass = cn(
        "flex flex-wrap items-start justify-start",
        gapClass,
        className
    );

    // Handle row limiting if maxRows is specified
    let displayTechnologies = validTechnologies;
    let hiddenCount = 0;

    if (maxRows && maxRows > 0) {
        // Estimate badges per row based on viewport
        const estimatedBadgesPerRow = isMobile ? 3 : 5;
        const maxBadges = maxRows * estimatedBadgesPerRow;

        if (validTechnologies.length > maxBadges) {
            displayTechnologies = validTechnologies.slice(0, maxBadges - 1); // Reserve space for "+X more"
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

            {/* Show "+X more" indicator if there are hidden technologies */}
            {hiddenCount > 0 && showCount && (
                <Badge
                    variant="outline"
                    className={cn(
                        "rounded-full font-medium transition-colors duration-300 flex-shrink-0",
                        // Light mode styling
                        "text-muted-foreground border-muted-foreground/30 hover:bg-muted/50",
                        // Dark mode styling - no borders for cleaner look
                        "dark:text-foreground/70 dark:bg-muted/50 dark:hover:bg-muted/70 dark:hover:text-foreground dark:border-none",
                        isMobile
                            ? "px-2 py-0.5 text-xs"
                            : "px-2.5 py-1 text-[0.8125rem]"
                    )}
                >
                    +{hiddenCount} more
                </Badge>
            )}
        </div>
    );
}

/**
 * Compact variant for displaying technologies in tight spaces
 * Automatically limits to 2 rows with show more indicator
 */
export function TechBadgeGroupCompact({
    technologies = [],
    size = "sm",
    className,
}: Omit<TechBadgeGroupProps, "maxRows" | "showCount">) {
    return (
        <TechBadgeGroup
            technologies={technologies}
            size={size}
            className={className}
            maxRows={2}
            showCount={true}
        />
    );
}
