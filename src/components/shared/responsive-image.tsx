"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Image from "next/image";

/**
 * Props for the ResponsiveImage component
 * @property src - Image source URL (optional for placeholder mode)
 * @property alt - Alternative text for accessibility
 * @property aspectRatio - Predefined or custom aspect ratio
 * @property className - Additional CSS classes
 * @property fillContainer - Whether image should fill its container
 * @property priority - Whether to prioritize image loading
 */
interface ResponsiveImageProps {
    src?: string;
    alt: string;
    aspectRatio?: "square" | "landscape" | "portrait" | string;
    className?: string;
    fillContainer?: boolean;
    priority?: boolean;
}

/**
 * Responsive image component with consistent styling across breakpoints
 *
 * Features:
 * - Handles different aspect ratios (square, landscape, portrait)
 * - Shows a placeholder when no image is provided
 * - Applies hover effects on desktop
 * - Adjusts border radius and shadow based on viewport
 */
export function ResponsiveImage({
    src,
    alt,
    aspectRatio = "square",
    className = "",
    fillContainer = true,
    priority = false,
}: ResponsiveImageProps) {
    const isMobile = useIsMobile();

    // Convert named aspect ratios to corresponding CSS classes
    let aspectRatioClass = "";
    switch (aspectRatio) {
        case "square":
            aspectRatioClass = "aspect-square";
            break;
        case "landscape":
            aspectRatioClass = "aspect-[16/10]";
            break;
        case "portrait":
            aspectRatioClass = "aspect-[3/4]";
            break;
        default:
            // Allow custom aspect ratio string (e.g., "aspect-[4/3]")
            aspectRatioClass = aspectRatio;
    }

    const containerClasses = cn(
        aspectRatioClass,
        "bg-gradient-to-br from-muted via-muted to-muted/50 relative overflow-hidden border border-border/50",
        isMobile
            ? "rounded-2xl shadow-xl"
            : "rounded-xl shadow-2xl shadow-black/5",
        className
    );

    return (
        <div className={containerClasses}>
            {src ? (
                // Display actual image when src is provided
                <Image
                    src={src}
                    alt={alt}
                    fill={fillContainer}
                    className={cn(
                        "object-cover",
                        isMobile
                            ? "rounded-2xl"
                            : "rounded-xl transition-transform duration-700 group-hover:scale-105"
                    )}
                    priority={priority}
                />
            ) : (
                // Display placeholder when no image is provided
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className={cn(
                            "rounded-full bg-primary/10 flex items-center justify-center",
                            isMobile ? "size-12" : "size-16"
                        )}
                    >
                        <div
                            className={cn(
                                "rounded-full bg-primary/20",
                                isMobile ? "size-6" : "size-8"
                            )}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
}
