"use client";

import { cn } from "@/lib/utils";
import { MediaItem } from "@/types/portfolio";
import { useEffect, useRef, useState } from "react";
import { SimpleMedia } from "./simple-media";

interface SimpleMediaCarouselProps {
    media?: MediaItem | MediaItem[];
    title: string;
    aspectRatio?: "square" | "landscape" | "portrait" | string;
    className?: string;
    priority?: boolean;
}

// Simple carousel navigation buttons
function CarouselButton({ 
    direction, 
    onClick, 
    className 
}: { 
    direction: "prev" | "next"; 
    onClick: () => void;
    className?: string;
}) {
    const isPrev = direction === "prev";
    
    return (
        <button
            onClick={onClick}
            className={cn(
                "absolute top-1/2 z-10 size-9 -translate-y-1/2 rounded-full",
                "bg-black/20 backdrop-blur-sm text-white transition-all duration-200",
                "hover:bg-black/40 hover:text-white opacity-0 group-hover:opacity-100 focus:opacity-100",
                isPrev ? "left-3" : "right-3",
                className
            )}
            aria-label={`${direction === "prev" ? "Previous" : "Next"} image`}
        >
            <svg
                className="size-4 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isPrev ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                />
            </svg>
        </button>
    );
}

export function SimpleMediaCarousel({
    media,
    title,
    aspectRatio = "landscape",
    className = "",
    priority = false,
}: SimpleMediaCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

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

    // Single media item - no carousel needed
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

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % mediaArray.length);
    };

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + mediaArray.length) % mediaArray.length);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                goToPrev();
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                goToNext();
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("keydown", handleKeyDown);
            return () => container.removeEventListener("keydown", handleKeyDown);
        }
    }, []);

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
            {/* Current media item */}
            <SimpleMedia
                media={mediaArray[currentIndex]}
                alt={`${title} - Item ${currentIndex + 1} of ${mediaArray.length}`}
                priority={priority && currentIndex === 0}
            />

            {/* Navigation controls */}
            {mediaArray.length > 1 && (
                <>
                    <CarouselButton direction="prev" onClick={goToPrev} />
                    <CarouselButton direction="next" onClick={goToNext} />
                </>
            )}

            {/* Item counter */}
            {mediaArray.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-medium z-10">
                    {currentIndex + 1} / {mediaArray.length}
                </div>
            )}

            {/* Dot indicators */}
            {mediaArray.length > 1 && mediaArray.length <= 5 && (
                <div className="absolute bottom-3 left-3 flex gap-1.5 z-10">
                    {mediaArray.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={cn(
                                "size-2 rounded-full transition-all duration-200",
                                index === currentIndex
                                    ? "bg-white"
                                    : "bg-white/50 hover:bg-white/75"
                            )}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}