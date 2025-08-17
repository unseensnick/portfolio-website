"use client";

import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { MediaItem } from "@/types/portfolio";
import { useEffect, useRef, useState } from "react";
import { SimpleMedia } from "./simple-media";

interface SimpleMediaCarouselProps {
    media?: MediaItem | MediaItem[];
    title: string;
    aspectRatio?: "square" | "landscape" | "portrait" | "5/4" | "3/2" | "4/3" | string;
    className?: string;
    priority?: boolean;
}

export function SimpleMediaCarousel({
    media,
    title,
    aspectRatio = "landscape",
    className = "",
    priority = false,
}: SimpleMediaCarouselProps) {
    const [api, setApi] = useState<CarouselApi>();
    const containerRef = useRef<HTMLDivElement>(null);

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
        container.addEventListener("keydown", handleKeyDown);
        return () => container.removeEventListener("keydown", handleKeyDown);
    }, [api]);

    if (!media) {
        return (
            <SimpleMedia
                media={undefined}
                alt={title}
                aspectRatio={aspectRatio}
                className={className}
                priority={priority}
            />
        );
    }

    const mediaArray = Array.isArray(media) ? media : [media];

    if (mediaArray.length === 1) {
        return (
            <SimpleMedia
                media={mediaArray[0]}
                alt={title}
                className={className}
                priority={priority}
            />
        );
    }
    return (
        <div
            ref={containerRef}
            className={cn("relative group focus:outline-none", className)}
            tabIndex={0}
            role="region"
            aria-label={`${title} media gallery with ${mediaArray.length} items`}
            onMouseEnter={() => containerRef.current?.focus()}
            onClick={() => containerRef.current?.focus()}
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
                            <SimpleMedia
                                media={mediaItem}
                                alt={`${title} - Item ${index + 1} of ${mediaArray.length}`}
                                priority={priority && index === 0}
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Navigation controls */}
                {mediaArray.length > 1 && (
                    <>
                        <CarouselPrevious
                            className="absolute top-1/2 left-3 -translate-y-1/2 z-10 size-9 bg-black/20 hover:bg-black/40 border-0 backdrop-blur-sm text-white hover:text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200"
                            aria-label="Previous image"
                        />
                        <CarouselNext
                            className="absolute top-1/2 right-3 -translate-y-1/2 z-10 size-9 bg-black/20 hover:bg-black/40 border-0 backdrop-blur-sm text-white hover:text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200"
                            aria-label="Next image"
                        />
                    </>
                )}
            </Carousel>

            {/* Item counter */}
            {mediaArray.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-medium z-10">
                    {mediaArray.length} items
                </div>
            )}
        </div>
    );
}
