"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn, commonClasses, createIconContainer } from "@/lib/utils";
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
 * Image component that adapts to mobile/desktop with built-in error handling
 * Shows placeholder when image fails to load or is missing
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

    // Map aspect ratio prop to Tailwind CSS classes
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
        <div
            className={cn(
                "absolute inset-0 text-center p-4",
                commonClasses.flexCenterCol
            )}
        >
            <div
                className={cn(
                    createIconContainer(isMobile ? "sm" : "md", "primary"),
                    "mb-3"
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
                <div
                    className={cn(
                        "absolute inset-0 bg-muted/50",
                        commonClasses.flexCenter,
                        commonClasses.loadingPulse
                    )}
                >
                    <div
                        className={cn(
                            createIconContainer(
                                isMobile ? "sm" : "md",
                                "primary"
                            )
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
