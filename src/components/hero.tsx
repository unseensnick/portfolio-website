"use client";

import { ButtonGroup } from "@/components/shared/button-group";
import { ResponsiveImage } from "@/components/shared/responsive-image";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatExternalUrl } from "@/lib/url-utils";
import { cn } from "@/lib/utils";
import { Github } from "lucide-react";

interface HeroProps {
    greeting?: string;
    title?: string;
    description?: string;
    githubUrl?: string;
    image?: string;
    ctaText?: string;

    secondaryCtaText?: string;
    secondaryCtaLink?: string;
}

/**
 * Hero section with different layouts for mobile and desktop
 */
export function Hero({
    greeting = "Welcome",
    title = "Full Stack Developer",
    description = "Building modern web applications",
    githubUrl = "https://github.com",
    image,
    ctaText = "View GitHub",

    secondaryCtaText = "View Projects",
    secondaryCtaLink = "#projects",
}: HeroProps) {
    const isMobile = useIsMobile();

    const buttons = [
        {
            text: ctaText,
            href: formatExternalUrl(githubUrl),
            icon: Github,
            external: true,
        },
        {
            text: secondaryCtaText,
            href: secondaryCtaLink,
            variant: "outline" as const,
        },
    ];

    const renderContent = () => {
        // Mobile: single column, image on top
        if (isMobile) {
            return (
                <div className="w-full">
                    {/* Hero image with decorative blur effect */}
                    <div className="relative mb-8 mx-auto max-w-sm">
                        <ResponsiveImage
                            src={image}
                            alt="Hero"
                            aspectRatio="square"
                            priority={true}
                        />
                        <div className="absolute -inset-3 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-2xl -z-10 opacity-50 blur-lg"></div>
                    </div>

                    <div className="text-center space-y-6">
                        <div className="space-y-4">
                            <p className="text-xs text-primary font-medium uppercase tracking-wider">
                                {greeting}
                            </p>
                            <h1 className="text-3xl font-bold leading-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                                {title}
                            </h1>
                            <p className="text-base text-muted-foreground leading-relaxed px-4">
                                {description}
                            </p>
                        </div>

                        <ButtonGroup
                            buttons={buttons}
                            fullWidthMobile={true}
                            className="px-4"
                            data-tour="hero-cta"
                        />
                    </div>
                </div>
            );
        }

        // Desktop: side-by-side layout with content on left, image on right
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                <div className="space-y-8 max-w-xl">
                    <div className="space-y-6">
                        <p className="text-sm text-primary font-medium uppercase tracking-wider">
                            {greeting}
                        </p>
                        <h1 className="text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                            {title}
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <ButtonGroup
                        buttons={buttons}
                        fullWidthMobile={false}
                        data-tour="hero-cta"
                    />
                </div>

                <div className="relative group">
                    <ResponsiveImage
                        src={image}
                        alt="Hero"
                        aspectRatio="landscape"
                        priority={true}
                    />
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-3xl -z-10 opacity-50 blur-xl"></div>
                </div>
            </div>
        );
    };

    return (
        <SectionWrapper
            id="home"
            className={cn(
                isMobile
                    ? "min-h-[85vh] flex items-center pt-8 pb-16"
                    : "min-h-[90vh] flex items-center"
            )}
            data-tour="hero-section"
        >
            {renderContent()}
        </SectionWrapper>
    );
}
