"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";

interface ResponsiveImageProps {
    src?: string;
    alt: string;
    aspectRatio?: "square" | "landscape" | "portrait" | string;
    className?: string;
    fillContainer?: boolean;
    priority?: boolean;
}

/**
 * Shared responsive image component with consistent styling
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

    // Calculate aspect ratio class
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

    const containerClasses = `${aspectRatioClass} bg-gradient-to-br from-muted via-muted to-muted/50 relative overflow-hidden border border-border/50 ${
        isMobile
            ? "rounded-2xl shadow-xl"
            : "rounded-xl shadow-2xl shadow-black/5"
    } ${className}`;

    return (
        <div className={containerClasses}>
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    fill={fillContainer}
                    className={`object-cover ${
                        isMobile
                            ? "rounded-2xl"
                            : "rounded-xl transition-transform duration-700 group-hover:scale-105"
                    }`}
                    priority={priority}
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className={`rounded-full bg-primary/10 flex items-center justify-center ${
                            isMobile ? "size-12" : "size-16"
                        }`}
                    >
                        <div
                            className={`rounded-full bg-primary/20 ${
                                isMobile ? "size-6" : "size-8"
                            }`}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
}
