"use client";

import { Badge } from "@/components/ui/badge";
import { safelyExtractTechnologyNames } from "@/lib/payload-safe-helpers";
import { cn } from "@/lib/utils";

/**
 * Props for the TechBadge component
 * @property text - Badge text content
 * @property className - Additional CSS classes
 * @property size - Size variant: "sm" (small), "md" (medium), or "lg" (large)
 */
interface TechBadgeProps {
    text: string;
    className?: string;
    size?: "sm" | "md" | "lg";
}

/**
 * A pill-shaped badge for displaying technology names
 *
 * Provides consistent styling with hover effects and size variants
 * Used for technology tags in projects and skills sections
 */
export function TechBadge({ text, className, size = "md" }: TechBadgeProps) {
    // Predefined size variants with appropriate spacing and text size
    const sizeClasses = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-[0.8125rem]",
        lg: "px-3 py-1.5 text-sm",
    };

    return (
        <Badge
            variant="secondary"
            className={cn(
                "rounded-full font-medium bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-300",
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
 */
interface TechBadgeGroupProps {
    technologies?: string[] | { name?: string }[];
    size?: "sm" | "md" | "lg";
    className?: string;
}

/**
 * Displays multiple technology badges in an organized grid
 *
 * Features:
 * - Arranges badges in rows with proper spacing
 * - Groups badges into chunks for better visual organization
 * - Handles both string arrays and object arrays with name property
 * - Safely handles null/undefined values during live preview using centralized helpers
 */
export function TechBadgeGroup({
    technologies = [],
    size = "md",
    className,
}: TechBadgeGroupProps) {
    // Use centralized helper to safely extract technology names
    const validTechnologies = safelyExtractTechnologyNames(technologies);

    // Don't render anything if no valid technologies after filtering
    if (validTechnologies.length === 0) return null;

    // Group technologies in chunks of 4 for better visual arrangement
    const chunkSize = 4;
    const techGroups = [];

    for (let i = 0; i < validTechnologies.length; i += chunkSize) {
        techGroups.push(validTechnologies.slice(i, i + chunkSize));
    }

    return (
        <div className={cn("space-y-2.5", className)}>
            {techGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="flex flex-wrap gap-2.5">
                    {group.map((tech, index) => (
                        <TechBadge
                            key={`${tech}-${index}`}
                            text={tech}
                            size={size}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
