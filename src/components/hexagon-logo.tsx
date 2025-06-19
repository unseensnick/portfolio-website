"use client";

import { cn, commonClasses } from "@/lib/utils";

interface HexagonLogoProps {
    logoText?: string;
    subtitle?: string;
    splitAt?: number;
    className?: string;
    isHovered?: boolean;
    onClick?: () => void;
}

/**
 * Simplified animated logo with hexagon icon and split-color text effect
 * Shows developer-style <code/> brackets in the center
 */
export function HexagonLogo({
    logoText = "YourName",
    subtitle = "Full Stack Developer",
    splitAt,
    className = "",
    isHovered = false,
    onClick,
}: HexagonLogoProps) {
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
            {/* Simplified hexagon with responsive sizing */}
            <div className="relative w-8 h-8 md:w-12 md:h-12">
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
                        "text-xs md:text-base"
                    )}
                >
                    &lt;/&gt;
                </div>
            </div>

            {/* Logo text with split typography */}
            <div className="flex flex-col">
                <div className="text-lg md:text-xl lg:text-2xl font-semibold leading-none">
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

                <span className="text-xs md:text-sm text-muted-foreground font-medium leading-none mt-1">
                    {subtitle}
                </span>
            </div>
        </div>
    );
}
