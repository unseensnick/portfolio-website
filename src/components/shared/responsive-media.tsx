"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import {
    cn,
    commonClasses,
    createIconContainer,
    createResponsiveContainer,
    createResponsiveIconSize,
    getAspectRatioClass,
} from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import VideoPlayer from "../VideoPlayer";

interface ResponsiveMediaProps {
    // New consolidated media structure
    media?: {
        image?:
            | {
                  url?: string;
                  alt?: string;
              }
            | any;
        video?: {
            src?: string;
            file?:
                | {
                      url?: string;
                  }
                | any;
            title?: string;
            description?: string;
        };
    };

    alt: string;
    aspectRatio?: "square" | "landscape" | "portrait" | string;
    className?: string;
    priority?: boolean;
    fillContainer?: boolean;
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
}: ResponsiveMediaProps) {
    const isMobile = useIsMobile();
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    // Extract media sources
    const videoSrc = media?.video?.file?.url || media?.video?.src;
    const videoTitle = media?.video?.title;
    const videoDescription = media?.video?.description;
    const imageSrc =
        media?.image?.url ||
        (typeof media?.image === "string" ? media.image : undefined);

    // If video source is provided, render video player
    if (videoSrc) {
        return (
            <div className={cn("relative w-full", className)}>
                <VideoPlayer
                    src={videoSrc}
                    title={videoTitle}
                    description={videoDescription}
                    className="w-full"
                    poster={imageSrc} // Use image as poster if available
                />
            </div>
        );
    }

    // Image rendering logic (consolidated from ResponsiveImage)
    const containerClasses = cn(
        getAspectRatioClass(aspectRatio),
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
                src={imageSrc!}
                alt={alt}
                fill={fillContainer}
                className={cn(
                    "object-cover transition-opacity duration-300",
                    createResponsiveContainer("card", isMobile),
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

    // Fallback to image rendering
    return (
        <div className={containerClasses}>
            {shouldShowPlaceholder ? renderPlaceholder() : renderImage()}
        </div>
    );
}
