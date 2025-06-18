"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useIsMobile } from "@/hooks/use-mobile";
import {
    cn,
    commonClasses,
    createIconContainer,
    createResponsiveContainer,
    createResponsiveIconSize,
} from "@/lib/utils";
import { MediaItem } from "@/types/portfolio";
import Image from "next/image";
import { useState } from "react";
import VideoPlayer from "../VideoPlayer";

interface ResponsiveMediaProps {
    media?: MediaItem;
    alt: string;
    aspectRatio?: "square" | "landscape" | "portrait" | string;
    className?: string;
    priority?: boolean;
    fillContainer?: boolean;
    imageZoom?: number;
    imageFinePosition?: {
        x?: number;
        y?: number;
    };
}

// Helper function to get numeric aspect ratio value
function getAspectRatioValue(aspectRatio: string): number {
    switch (aspectRatio) {
        case "square":
            return 1;
        case "landscape":
            return 16 / 9;
        case "portrait":
            return 3 / 4;
        default:
            // Try to parse custom ratio like "16/9" or "4/3"
            if (aspectRatio.includes("/")) {
                const [width, height] = aspectRatio.split("/").map(Number);
                return width && height ? width / height : 16 / 9;
            }
            return 16 / 9;
    }
}

/**
 * Unified responsive media component that can display either an image or video
 * Prioritizes video if both are provided
 * Includes built-in error handling and loading states for images
 */
export function ResponsiveMedia({
    media,
    alt,
    aspectRatio = "landscape",
    className = "",
    priority = false,
    fillContainer = true,
    imageZoom,
    imageFinePosition,
}: ResponsiveMediaProps) {
    const isMobile = useIsMobile();
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    // Extract media sources and enhanced controls
    const videoSrc = media?.video?.file?.url || media?.video?.src;
    const videoTitle = media?.video?.title;
    const videoDescription = media?.video?.description;
    const imageSrc =
        media?.image?.url ||
        (typeof media?.image === "string" ? media.image : undefined);

    // Use media-specific controls or fallback to component props
    // Only use zoom if it's a valid number, otherwise default to 100
    const effectiveZoom =
        typeof (media?.imageZoom ?? imageZoom) === "number"
            ? (media?.imageZoom ?? imageZoom)
            : 100;
    const effectiveFinePosition = media?.imageFinePosition ?? imageFinePosition;

    // Get the numeric ratio value
    const ratioValue = getAspectRatioValue(aspectRatio);

    // If video source is provided, render video player
    if (videoSrc) {
        return (
            <AspectRatio
                ratio={ratioValue}
                className={cn("relative w-full", className)}
            >
                <VideoPlayer
                    src={videoSrc}
                    title={videoTitle}
                    description={videoDescription}
                    className="w-full h-full"
                    poster={imageSrc} // Use image as poster if available
                />
            </AspectRatio>
        );
    }

    // Container classes for the aspect ratio wrapper
    const containerClasses = cn(
        "bg-gradient-to-br from-muted via-muted to-muted/50 relative overflow-hidden border border-border/50",
        createResponsiveContainer("image", isMobile),
        className
    );

    const shouldShowPlaceholder =
        !imageSrc || imageError || imageSrc === "/placeholder-image.svg";

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
                        createResponsiveIconSize("md", isMobile)
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

    const renderImage = () => {
        // Check if fine positioning has actual numeric values
        // PayloadCMS might send { x: null, y: null } so we need to be strict
        const hasFinePositioning =
            effectiveFinePosition &&
            ((typeof effectiveFinePosition.x === "number" &&
                effectiveFinePosition.x !== null) ||
                (typeof effectiveFinePosition.y === "number" &&
                    effectiveFinePosition.y !== null));

        // Calculate background position and size for zoom and positioning
        const backgroundPosition = hasFinePositioning
            ? `${effectiveFinePosition?.x ?? 50}% ${effectiveFinePosition?.y ?? 50}%`
            : media?.imagePosition === "top"
              ? "center top"
              : media?.imagePosition === "bottom"
                ? "center bottom"
                : media?.imagePosition === "left"
                  ? "left center"
                  : media?.imagePosition === "right"
                    ? "right center"
                    : media?.imagePosition === "top-left"
                      ? "left top"
                      : media?.imagePosition === "top-right"
                        ? "right top"
                        : media?.imagePosition === "bottom-left"
                          ? "left bottom"
                          : media?.imagePosition === "bottom-right"
                            ? "right bottom"
                            : "center center";

        const backgroundSize =
            effectiveZoom !== 100 ? `${effectiveZoom}%` : "cover";

        return (
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

                {/* Use div with background-image for better zoom control */}
                <div
                    className={cn(
                        "absolute inset-0 transition-all duration-300",
                        imageLoading ? "opacity-0" : "opacity-100"
                    )}
                    style={{
                        backgroundImage: `url("${imageSrc}")`,
                        backgroundSize: backgroundSize,
                        backgroundPosition: backgroundPosition,
                        backgroundRepeat: "no-repeat",
                    }}
                />

                {/* Hidden Image for loading/error handling */}
                <Image
                    src={imageSrc!}
                    alt={alt}
                    fill={fillContainer}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="opacity-0 pointer-events-none"
                    priority={priority}
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                        setImageError(true);
                        setImageLoading(false);
                    }}
                />
            </>
        );
    };

    // Render with AspectRatio wrapper
    return (
        <AspectRatio ratio={ratioValue} className={containerClasses}>
            {shouldShowPlaceholder ? renderPlaceholder() : renderImage()}
        </AspectRatio>
    );
}
