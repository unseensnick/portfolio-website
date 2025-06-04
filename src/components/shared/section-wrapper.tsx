"use client";

import { useIsMobile } from "@/hooks/use-mobile";
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
 * Shared section wrapper component that handles mobile/desktop layout differences
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

    const titleClasses = `font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent ${
        isMobile ? "text-3xl mb-4" : "text-4xl lg:text-5xl mb-6"
    } ${titleClassName}`;

    const descriptionClasses = `text-muted-foreground ${
        isMobile
            ? "text-base px-4 leading-relaxed"
            : "text-lg max-w-2xl mx-auto leading-relaxed"
    } ${descriptionClassName}`;

    return (
        <section
            id={id}
            className={`${isMobile ? "py-16" : "py-24 lg:py-32"} ${className}`}
        >
            <div
                className={isMobile ? "px-6" : "max-w-7xl mx-auto px-8 w-full"}
            >
                {(title || description) && (
                    <div
                        className={`text-center ${isMobile ? "mb-12" : "mb-16 lg:mb-20"}`}
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
