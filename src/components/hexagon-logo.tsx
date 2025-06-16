"use client";

import { cn, commonClasses } from "@/lib/utils";

interface HexagonLogoProps {
    logoText?: string;
    subtitle?: string;
    size?: "sm" | "md" | "lg" | "xl";
    splitAt?: number;
    className?: string;
    isHovered?: boolean;
    onClick?: () => void;
}

/**
 * Animated logo with hexagon icon and split-color text effect
 * Shows developer-style <code/> brackets in the center
 */
export function HexagonLogo({
    logoText = "YourName",
    subtitle = "Full Stack Developer",
    size = "lg",
    splitAt,
    className = "",
    isHovered = false,
    onClick,
}: HexagonLogoProps) {
    const sizeClasses = {
        sm: "text-lg",
        md: "text-2xl",
        lg: "text-4xl",
        xl: "text-6xl",
    };

    const iconSizes = {
        sm: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-12 h-12",
        xl: "w-16 h-16",
    };

    const iconTextSizes = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
        xl: "text-lg",
    };

    const subtitleSizes = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
        xl: "text-lg",
    };

    // Smart split: after first word, or 60% through single word for gradient effect
    const calculateSplitAt = () => {
        if (splitAt !== undefined) return splitAt;

        const spaceIndex = logoText.indexOf(" ");
        if (spaceIndex > 0) return spaceIndex;

        return Math.floor(logoText.length * 0.6);
    };

    const splitIndex = calculateSplitAt();
    const firstPart = logoText.slice(0, splitIndex);
    const secondPart = logoText.slice(splitIndex);

    return (
        <div
            className={cn(
                "flex items-center gap-3",
                commonClasses.transition,
                onClick && "cursor-pointer hover:scale-105",
                className
            )}
            onClick={onClick}
        >
            {/* Hexagon with code brackets */}
            <div className={cn("relative", iconSizes[size])}>
                {/* Outer hexagon with gradient */}
                <div
                    className={cn(
                        "absolute inset-0 bg-gradient-to-br from-primary to-primary/80",
                        commonClasses.transition,
                        isHovered &&
                            "scale-110 rotate-12 from-primary/90 to-primary"
                    )}
                    style={{
                        clipPath:
                            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    }}
                />

                {/* Inner white hexagon */}
                <div
                    className={cn(
                        "absolute inset-1 bg-background",
                        commonClasses.transition,
                        isHovered && "scale-95"
                    )}
                    style={{
                        clipPath:
                            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    }}
                />

                {/* Code brackets symbol */}
                <div
                    className={cn(
                        "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary font-bold font-mono",
                        iconTextSizes[size]
                    )}
                >
                    &lt;/&gt;
                </div>
            </div>

            {/* Logo text with split typography */}
            <div className="flex flex-col">
                <div
                    className={cn(
                        sizeClasses[size],
                        "font-semibold leading-none"
                    )}
                >
                    <span className="text-muted-foreground">{firstPart}</span>
                    <span
                        className={cn(
                            commonClasses.primaryGradientText,
                            commonClasses.transition,
                            isHovered && "from-primary/90 to-primary"
                        )}
                    >
                        {secondPart}
                    </span>
                </div>

                <span
                    className={cn(
                        "text-muted-foreground font-medium leading-none mt-1",
                        subtitleSizes[size]
                    )}
                >
                    {subtitle}
                </span>
            </div>
        </div>
    );
}
