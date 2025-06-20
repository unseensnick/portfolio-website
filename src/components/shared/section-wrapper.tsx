"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import {
    cn,
    commonClasses,
    createResponsiveClasses,
    createResponsiveSpacing,
    createResponsiveText,
} from "@/lib/utils";
import { ReactNode } from "react";

interface SectionWrapperProps {
    id?: string;
    title?: string;
    description?: string;
    children: ReactNode;
    className?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    "data-tour"?: string;
}

/**
 * Standardized section container with responsive spacing and gradient titles using utility patterns
 */
export function SectionWrapper({
    id,
    title,
    description,
    children,
    className = "",
    titleClassName = "",
    descriptionClassName = "",
    ...props
}: SectionWrapperProps) {
    const isMobile = useIsMobile();

    const titleClasses = cn(
        "font-bold",
        commonClasses.gradientText,
        createResponsiveClasses(
            "text-3xl mb-4",
            "text-4xl lg:text-5xl mb-6",
            isMobile
        ),
        titleClassName
    );

    const descriptionClasses = cn(
        "text-muted-foreground",
        createResponsiveText("description", isMobile),
        descriptionClassName
    );

    return (
        <section
            id={id}
            className={cn(
                createResponsiveSpacing("sectionPadding", isMobile),
                className
            )}
            {...props}
        >
            <div
                className={cn(
                    createResponsiveClasses(
                        "px-6",
                        "max-w-7xl mx-auto px-8 w-full",
                        isMobile
                    )
                )}
            >
                {(title || description) && (
                    <div
                        className={cn(
                            "text-center",
                            createResponsiveClasses(
                                "mb-12",
                                "mb-16 lg:mb-20",
                                isMobile
                            )
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
