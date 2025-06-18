"use client";

import { ResponsiveMedia } from "@/components/shared/responsive-media";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { MediaItem } from "@/types/portfolio";
import { useEffect, useRef, useState } from "react";

interface ProjectMediaCarouselProps {
    media?: MediaItem | MediaItem[];
    title: string;
    aspectRatio?: "square" | "landscape" | "portrait" | string;
    className?: string;
    priority?: boolean;
}

/**
 * Project media component that automatically uses a carousel when multiple media files are present
 * Falls back to single ResponsiveMedia component for single media files
 */
export function ProjectMediaCarousel({
    media,
    title,
    aspectRatio = "landscape",
    className = "",
    priority = false,
}: ProjectMediaCarouselProps) {
    const isMobile = useIsMobile();
    const [api, setApi] = useState<CarouselApi>();
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle keyboard navigation
    useEffect(() => {
        if (!api || !containerRef.current) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                api.scrollPrev();
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                api.scrollNext();
            }
        };

        const container = containerRef.current;

        // Add event listeners
        container.addEventListener("keydown", handleKeyDown);

        return () => {
            container.removeEventListener("keydown", handleKeyDown);
        };
    }, [api]);

    // Handle mouse enter to enable keyboard navigation
    const handleMouseEnter = () => {
        if (containerRef.current) {
            containerRef.current.focus();
        }
    };

    // Handle click to enable keyboard navigation
    const handleClick = () => {
        if (containerRef.current) {
            containerRef.current.focus();
        }
    };

    // Handle the case where media is undefined or empty
    if (!media) {
        return (
            <ResponsiveMedia
                media={undefined}
                alt={title}
                aspectRatio={aspectRatio}
                className={className}
                priority={priority}
            />
        );
    }

    // Convert single media to array for uniform handling
    const mediaArray = Array.isArray(media) ? media : [media];

    // If only one media item, render it directly without carousel
    if (mediaArray.length === 1) {
        return (
            <ResponsiveMedia
                media={mediaArray[0]}
                alt={title}
                aspectRatio={mediaArray[0]?.aspectRatio || aspectRatio}
                className={className}
                priority={priority}
            />
        );
    }

    // Multiple media items - use carousel with keyboard support
    return (
        <div
            ref={containerRef}
            className={cn(
                "relative group outline-none focus:outline-none focus-visible:outline-none",
                className
            )}
            tabIndex={0}
            role="region"
            aria-label={`${title} media gallery with ${mediaArray.length} items`}
            onMouseEnter={handleMouseEnter}
            onClick={handleClick}
        >
            <Carousel
                setApi={setApi}
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {mediaArray.map((mediaItem, index) => (
                        <CarouselItem key={index}>
                            <ResponsiveMedia
                                media={mediaItem}
                                alt={`${title} - Item ${index + 1} of ${mediaArray.length}`}
                                aspectRatio={
                                    mediaItem?.aspectRatio || aspectRatio
                                }
                                priority={priority && index === 0} // Only prioritize first image
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Navigation buttons - positioned inside the image container */}
                {mediaArray.length > 1 && (
                    <>
                        <CarouselPrevious
                            className={cn(
                                "absolute top-1/2 left-3 -translate-y-1/2 z-10",
                                "size-9 bg-black/20 hover:bg-black/40 border-0",
                                "backdrop-blur-sm text-white hover:text-white",
                                "transition-all duration-200 outline-none focus:outline-none focus-visible:outline-none",
                                "shadow-none focus:shadow-none focus-visible:shadow-none",
                                "opacity-0 group-hover:opacity-100 focus:opacity-100",
                                isMobile && "opacity-100" // Always visible on mobile
                            )}
                            aria-label="Previous image"
                        />
                        <CarouselNext
                            className={cn(
                                "absolute top-1/2 right-3 -translate-y-1/2 z-10",
                                "size-9 bg-black/20 hover:bg-black/40 border-0",
                                "backdrop-blur-sm text-white hover:text-white",
                                "transition-all duration-200 outline-none focus:outline-none focus-visible:outline-none",
                                "shadow-none focus:shadow-none focus-visible:shadow-none",
                                "opacity-0 group-hover:opacity-100 focus:opacity-100",
                                isMobile && "opacity-100" // Always visible on mobile
                            )}
                            aria-label="Next image"
                        />
                    </>
                )}
            </Carousel>

            {/* Media counter indicator - only show for multiple items */}
            {mediaArray.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-medium z-10">
                    {mediaArray.length} items
                </div>
            )}
        </div>
    );
}
