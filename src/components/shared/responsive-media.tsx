import { cn } from "@/lib/utils";
import VideoPlayer from "../VideoPlayer";
import { ResponsiveImage } from "./responsive-image";

interface ResponsiveMediaProps {
    // Legacy props for backward compatibility
    src?: string;
    videoSrc?: string;
    videoFile?: any;
    videoTitle?: string;
    videoDescription?: string;

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
    aspectRatio?: "square" | "landscape" | "portrait";
    className?: string;
    priority?: boolean;
}

/**
 * Responsive media component that can display either an image or video
 * Prioritizes video if both are provided
 * Supports both legacy props and new consolidated media structure
 */
export function ResponsiveMedia({
    // Legacy props
    src,
    videoSrc,
    videoFile,
    videoTitle,
    videoDescription,

    // New consolidated props
    media,

    alt,
    aspectRatio = "landscape",
    className = "",
    priority = false,
}: ResponsiveMediaProps) {
    // Determine video source - prioritize new structure, then legacy
    let finalVideoSrc: string | undefined;
    let finalVideoTitle: string | undefined;
    let finalVideoDescription: string | undefined;
    let finalImageSrc: string | undefined;

    if (media) {
        // New consolidated structure
        finalVideoSrc = media.video?.file?.url || media.video?.src;
        finalVideoTitle = media.video?.title;
        finalVideoDescription = media.video?.description;
        finalImageSrc =
            media.image?.url ||
            (typeof media.image === "string" ? media.image : undefined);
    } else {
        // Legacy structure for backward compatibility
        finalVideoSrc = videoFile?.url || videoSrc;
        finalVideoTitle = videoTitle;
        finalVideoDescription = videoDescription;
        finalImageSrc = src;
    }

    // If video source is provided, render video player
    if (finalVideoSrc) {
        return (
            <div className={cn("relative w-full", className)}>
                <VideoPlayer
                    src={finalVideoSrc}
                    title={finalVideoTitle}
                    description={finalVideoDescription}
                    className="w-full"
                    poster={finalImageSrc} // Use image as poster if available
                />
            </div>
        );
    }

    // Fallback to image if no video
    return (
        <ResponsiveImage
            src={finalImageSrc}
            alt={alt}
            aspectRatio={aspectRatio}
            className={className}
            priority={priority}
        />
    );
}
