"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/**
 * Props for the SectionWrapper component
 * @property id - HTML ID for the section (used for navigation)
 * @property title - Optional section heading
 * @property description - Optional section subheading
 * @property children - Content to render inside the section
 * @property className - Additional CSS classes for the section element
 * @property titleClassName - Additional CSS classes for the title
 * @property descriptionClassName - Additional CSS classes for the description
 */
interface SectionWrapperProps {
    id?: string;
    title?: string;
    description?: string;
    children: ReactNode;
    className?: string;
    titleClassName?: string;
    descriptionClassName?: string;
}

/**
 * Standardized section container with responsive spacing and header styling
 *
 * Features:
 * - Handles consistent spacing across all sections
 * - Provides optional title and description with gradient styling
 * - Adjusts text size, padding, and margins based on viewport
 * - Ensures consistent maximum width on larger screens
 */
export function SectionWrapper({
    id,
    title,
    description,
    children,
    className = "",
    titleClassName = "",
    descriptionClassName = "",
}: SectionWrapperProps) {
    const isMobile = useIsMobile();

    // Apply gradient styling to title with responsive sizing
    const titleClasses = cn(
        "font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent",
        isMobile ? "text-3xl mb-4" : "text-4xl lg:text-5xl mb-6",
        titleClassName
    );

    // Style description text with responsive sizing and max-width
    const descriptionClasses = cn(
        "text-muted-foreground",
        isMobile
            ? "text-base px-4 leading-relaxed"
            : "text-lg max-w-2xl mx-auto leading-relaxed",
        descriptionClassName
    );

    return (
        <section
            id={id}
            className={cn(isMobile ? "py-16" : "py-24 lg:py-32", className)}
        >
            <div
                className={cn(
                    isMobile ? "px-6" : "max-w-7xl mx-auto px-8 w-full"
                )}
            >
                {/* Only render header if title or description is provided */}
                {(title || description) && (
                    <div
                        className={cn(
                            "text-center",
                            isMobile ? "mb-12" : "mb-16 lg:mb-20"
                        )}
                    >
                        {title && <h2 className={titleClasses}>{title}</h2>}
                        {description && (
                            <p className={descriptionClasses}>{description}</p>
                        )}
                    </div>
                )}
                {children}
            </div>
        </section>
    );
}
