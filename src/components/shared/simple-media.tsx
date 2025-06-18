"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { MediaItem } from "@/types/portfolio";
import Image from "next/image";
import { useState } from "react";

interface SimpleMediaProps {
    media?: MediaItem;
    alt: string;
    aspectRatio?: "square" | "landscape" | "portrait" | string;
    className?: string;
    priority?: boolean;
    imageZoom?: number;
    imageFinePosition?: {
        x?: number;
        y?: number;
    };
}

// Simple aspect ratio mapping
const ASPECT_RATIOS: Record<string, number> = {
    square: 1,
    landscape: 16 / 9,
    portrait: 3 / 4,
} as const;

function getAspectRatioValue(aspectRatio: string): number {
    if (aspectRatio in ASPECT_RATIOS) {
        return ASPECT_RATIOS[aspectRatio];
    }

    // Parse custom ratios like "16/9"
    if (aspectRatio.includes("/")) {
        const [width, height] = aspectRatio.split("/").map(Number);
        return width && height ? width / height : ASPECT_RATIOS.landscape;
    }

    return ASPECT_RATIOS.landscape;
}

// Simple YouTube utilities
function isYouTubeUrl(url: string): boolean {
    return /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/.test(
        url
    );
}

function getYouTubeEmbedUrl(url: string): string {
    const videoId = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/
    )?.[1];
    return videoId
        ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&controls=1`
        : url;
}

// Simple positioning helper
function getImagePosition(
    finePosition?: { x?: number; y?: number },
    fallbackPosition?: string
): string {
    if (
        finePosition &&
        (typeof finePosition.x === "number" ||
            typeof finePosition.y === "number")
    ) {
        const x = finePosition.x ?? 50;
        const y = finePosition.y ?? 50;
        return `${x}% ${y}%`;
    }

    // Simple fallback positions
    const positions: Record<string, string> = {
        top: "center top",
        bottom: "center bottom",
        left: "left center",
        right: "right center",
        center: "center center",
    };

    return positions[fallbackPosition || "center"] || "center center";
}

export function SimpleMedia({
    media,
    alt,
    aspectRatio = "landscape",
    className = "",
    priority = false,
    imageZoom,
    imageFinePosition,
}: SimpleMediaProps) {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    // Extract media sources
    const videoSrc = media?.video?.file?.url || media?.video?.src;
    const imageSrc =
        media?.image?.url ||
        (typeof media?.image === "string" ? media.image : undefined);

    // Use media-specific controls or fallback to props
    const effectiveZoom =
        typeof (media?.imageZoom ?? imageZoom) === "number"
            ? (media?.imageZoom ?? imageZoom)
            : 100;
    const effectiveFinePosition = media?.imageFinePosition ?? imageFinePosition;

    const ratioValue = getAspectRatioValue(aspectRatio);

    // YouTube video handling (simplified)
    if (videoSrc && isYouTubeUrl(videoSrc)) {
        return (
            <AspectRatio
                ratio={ratioValue}
                className={cn(
                    "relative w-full overflow-hidden rounded-lg",
                    className
                )}
            >
                <iframe
                    src={getYouTubeEmbedUrl(videoSrc)}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={media?.video?.title || alt}
                />
            </AspectRatio>
        );
    }

    // Image handling
    const shouldShowPlaceholder =
        !imageSrc ||
        imageError ||
        imageSrc === "/placeholder-image.svg" ||
        !imageSrc.trim();

    if (shouldShowPlaceholder) {
        return (
            <AspectRatio
                ratio={ratioValue}
                className={cn(
                    "relative w-full overflow-hidden rounded-lg bg-muted border border-border/50 flex items-center justify-center",
                    className
                )}
            >
                <div className="text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-muted-foreground/10 flex items-center justify-center mx-auto mb-3">
                        <div className="w-6 h-6 rounded-full bg-muted-foreground/20" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                        Placeholder Image
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                        Add content via PayloadCMS
                    </p>
                </div>
            </AspectRatio>
        );
    }

    // Calculate position and zoom
    const backgroundPosition = getImagePosition(
        effectiveFinePosition,
        media?.imagePosition
    );
    const backgroundSize =
        effectiveZoom !== 100 ? `${effectiveZoom}%` : "cover";

    return (
        <AspectRatio
            ratio={ratioValue}
            className={cn(
                "relative w-full overflow-hidden rounded-lg bg-muted border border-border/50",
                className
            )}
        >
            {/* Loading state */}
            {imageLoading && (
                <div className="absolute inset-0 bg-muted/50 flex items-center justify-center animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-muted-foreground/20" />
                </div>
            )}

            {/* Main image with zoom and positioning */}
            <div
                className={cn(
                    "absolute inset-0 transition-opacity duration-300",
                    imageLoading ? "opacity-0" : "opacity-100"
                )}
                style={{
                    backgroundImage: `url("${imageSrc}")`,
                    backgroundSize: backgroundSize,
                    backgroundPosition: backgroundPosition,
                    backgroundRepeat: "no-repeat",
                }}
            />

            {/* Hidden image for loading/error handling */}
            <Image
                src={imageSrc}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="opacity-0 pointer-events-none"
                priority={priority}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                }}
            />
        </AspectRatio>
    );
}
