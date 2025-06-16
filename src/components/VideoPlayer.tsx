import Video, { VideoProps } from "next-video";

interface VideoPlayerProps extends Omit<VideoProps, "src"> {
    src: string | any; // Can be import or URL string
    title?: string;
    description?: string;
    className?: string;
}

// Helper function to detect YouTube URLs
function isYouTubeUrl(url: string): boolean {
    if (typeof url !== "string") return false;

    const youtubePatterns = [
        /^https?:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
        /^https?:\/\/(www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
        /^https?:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/,
        /^https?:\/\/(www\.)?youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]+)/,
    ];

    return youtubePatterns.some((pattern) => pattern.test(url));
}

// Helper function to extract YouTube video ID
function getYouTubeVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
        /youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }

    return null;
}

// Helper function to create YouTube embed URL
function createYouTubeEmbedUrl(videoId: string): string {
    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&controls=1`;
}

export default function VideoPlayer({
    src,
    title,
    description,
    className = "",
    ...props
}: VideoPlayerProps) {
    // Convert src to string if it's an object (imported video)
    const srcString = typeof src === "string" ? src : src?.src || "";

    return (
        <div className={`video-container ${className}`}>
            {title && <h3 className="text-xl font-semibold mb-2">{title}</h3>}
            {description && <p className="text-gray-600 mb-4">{description}</p>}

            {isYouTubeUrl(srcString) ? (
                // YouTube iframe embed
                (() => {
                    const videoId = getYouTubeVideoId(srcString);
                    if (!videoId) {
                        return (
                            <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                                <p className="text-gray-500">
                                    Invalid YouTube URL
                                </p>
                            </div>
                        );
                    }

                    return (
                        <div className="relative w-full aspect-video">
                            <iframe
                                src={createYouTubeEmbedUrl(videoId)}
                                className="absolute inset-0 w-full h-full rounded-lg shadow-lg"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={title || "YouTube Video"}
                                style={{
                                    border: "2px solid #3b82f6",
                                    borderRadius: "0.5rem",
                                }}
                            />
                        </div>
                    );
                })()
            ) : (
                // Regular video using next-video
                <Video
                    src={src}
                    className="w-full rounded-lg shadow-lg"
                    controls
                    style={{
                        "--media-primary-color": "#3b82f6",
                        "--media-secondary-color": "#1e40af",
                        "--media-accent-color": "#60a5fa",
                    }}
                    {...props}
                />
            )}
        </div>
    );
}
