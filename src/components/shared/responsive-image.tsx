"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface ResponsiveImageProps {
    src?: string;
    alt: string;
    aspectRatio?: "square" | "landscape" | "portrait" | string;
    className?: string;
    fillContainer?: boolean;
    priority?: boolean;
}

/**
 * Responsive image with placeholder fallback and error handling
 * Adapts styling for mobile/desktop and provides graceful fallbacks
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

    // Convert aspect ratio to CSS classes
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

    const shouldShowPlaceholder =
        !src || imageError || src === "/placeholder-image.svg";

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

    const renderImage = () => (
        <>
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
