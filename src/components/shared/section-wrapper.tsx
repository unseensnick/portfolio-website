"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

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
 * Standardized section container with responsive spacing and gradient titles
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

    const titleClasses = cn(
        "font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent",
        isMobile ? "text-3xl mb-4" : "text-4xl lg:text-5xl mb-6",
        titleClassName
    );

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
