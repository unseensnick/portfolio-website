"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

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
 * - Shows a placeholder when no image is provided or when image fails to load
 * - Applies hover effects on desktop
 * - Adjusts border radius and shadow based on viewport
 * - Graceful fallback handling for broken/missing images
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
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

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

    // Determine if we should show placeholder
    const shouldShowPlaceholder =
        !src || imageError || src === "/placeholder-image.svg";

    /**
     * Renders the placeholder content
     */
    const renderPlaceholder = () => (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <div
                className={cn(
                    "rounded-full bg-primary/10 flex items-center justify-center mb-3",
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
            <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                    Placeholder Image
                </p>
                <p className="text-xs text-muted-foreground/70">
                    Add content via PayloadCMS
                </p>
            </div>
        </div>
    );

    /**
     * Renders the actual image with error handling
     */
    const renderImage = () => (
        <>
            {/* Loading state */}
            {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50 animate-pulse">
                    <div
                        className={cn(
                            "rounded-full bg-primary/10",
                            isMobile ? "size-8" : "size-12"
                        )}
                    ></div>
                </div>
            )}

            {/* Actual image */}
            <Image
                src={src!}
                alt={alt}
                fill={fillContainer}
                className={cn(
                    "object-cover transition-opacity duration-300",
                    isMobile
                        ? "rounded-2xl"
                        : "rounded-xl transition-transform duration-700 group-hover:scale-105",
                    imageLoading ? "opacity-0" : "opacity-100"
                )}
                priority={priority}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                    console.warn(
                        `[ResponsiveImage] Failed to load image: ${src}`
                    );
                }}
            />
        </>
    );

    return (
        <div className={containerClasses}>
            {shouldShowPlaceholder ? renderPlaceholder() : renderImage()}
        </div>
    );
}
