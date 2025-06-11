"use client";

import { cn } from "@/lib/utils";

/**
 * Props for the HexagonLogo component
 * @property logoText - Main logo text (e.g., "unseensnick")
 * @property subtitle - Subtitle text (e.g., "Full Stack Developer")
 * @property size - Size variant for the logo
 * @property splitAt - Number of characters to keep in normal color before applying gradient
 * @property className - Additional CSS classes
 * @property isHovered - Whether the logo is in hovered state
 * @property onClick - Click handler for the logo
 */
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
 * Hexagon Typography Logo Component
 *
 * Features:
 * - Modern hexagon icon with code brackets
 * - Customizable split typography with gradient effect
 * - Responsive sizing
 * - Hover animations
 * - Full customization of text content
 */
export function HexagonLogo({
    logoText = "unseensnick",
    subtitle = "Full Stack Developer",
    size = "lg",
    splitAt,
    className = "",
    isHovered = false,
    onClick,
}: HexagonLogoProps) {
    // Size configurations
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

    // Auto-calculate split point if not provided
    // Default: split after first word or halfway through if one word
    const calculateSplitAt = () => {
        if (splitAt !== undefined) return splitAt;

        const spaceIndex = logoText.indexOf(" ");
        if (spaceIndex > 0) return spaceIndex;

        // If no space, split roughly in the middle
        return Math.floor(logoText.length * 0.6);
    };

    const splitIndex = calculateSplitAt();
    const firstPart = logoText.slice(0, splitIndex);
    const secondPart = logoText.slice(splitIndex);

    return (
        <div
            className={cn(
                "flex items-center gap-3 transition-transform duration-300",
                onClick && "cursor-pointer hover:scale-105",
                className
            )}
            onClick={onClick}
        >
            {/* Hexagon Icon with Code Brackets */}
            <div className={cn("relative", iconSizes[size])}>
                {/* Hexagon Background */}
                <div
                    className={cn(
                        "absolute inset-0 bg-gradient-to-br from-primary to-primary/80 transition-all duration-300",
                        isHovered &&
                            "scale-110 rotate-12 from-primary/90 to-primary"
                    )}
                    style={{
                        clipPath:
                            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    }}
                />

                {/* White Inner Hexagon */}
                <div
                    className={cn(
                        "absolute inset-1 bg-background transition-transform duration-300",
                        isHovered && "scale-95"
                    )}
                    style={{
                        clipPath:
                            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    }}
                />

                {/* Code Brackets Symbol */}
                <div
                    className={cn(
                        "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary font-bold font-mono",
                        iconTextSizes[size]
                    )}
                >
                    &lt;/&gt;
                </div>
            </div>

            {/* Text Content */}
            <div className="flex flex-col">
                {/* Main Logo Text with Split Typography */}
                <div
                    className={cn(
                        sizeClasses[size],
                        "font-semibold leading-none"
                    )}
                >
                    <span className="text-muted-foreground">{firstPart}</span>
                    <span
                        className={cn(
                            "bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent transition-all duration-300",
                            isHovered && "from-primary/90 to-primary"
                        )}
                    >
                        {secondPart}
                    </span>
                </div>

                {/* Subtitle */}
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

/**
 * Example usage with different configurations
 */
export function HexagonLogoExamples() {
    return (
        <div className="space-y-8 p-8">
            <h2 className="text-2xl font-bold">Hexagon Logo Examples</h2>

            <div className="space-y-6">
                {/* Default */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        Default (unseensnick)
                    </h3>
                    <HexagonLogo />
                </div>

                {/* Custom Text */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Custom Text</h3>
                    <HexagonLogo
                        logoText="JohnDoe"
                        subtitle="Frontend Developer"
                        splitAt={4}
                    />
                </div>

                {/* Single Word */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Single Word</h3>
                    <HexagonLogo
                        logoText="Portfolio"
                        subtitle="Creative Studio"
                        splitAt={4}
                    />
                </div>

                {/* Two Words */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Two Words</h3>
                    <HexagonLogo
                        logoText="Code Master"
                        subtitle="Full Stack Engineer"
                    />
                </div>

                {/* Different Sizes */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        Different Sizes
                    </h3>
                    <div className="space-y-4">
                        <HexagonLogo size="sm" logoText="Small Logo" />
                        <HexagonLogo size="md" logoText="Medium Logo" />
                        <HexagonLogo size="lg" logoText="Large Logo" />
                    </div>
                </div>
            </div>
        </div>
    );
}
