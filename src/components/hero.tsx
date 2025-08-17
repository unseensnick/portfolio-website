"use client";

import { ButtonGroup } from "@/components/shared/button-group";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { SimpleMedia } from "@/components/shared/simple-media";
import { RichText } from '@payloadcms/richtext-lexical/react';
import {
    useIsMobile,
    useIsMobileOrTablet,
    useIsTablet,
} from "@/hooks/use-mobile";
import {
    cn,
    commonClasses,
    createResponsiveLayout,
    createResponsiveText,
} from "@/lib/utils";
import { MediaItem } from "@/types/portfolio";
import { ExternalLink, Github } from "lucide-react";

interface HeroProps {
    greeting?: string;
    title?: string;
    description?: any;
    githubUrl?: string;
    image?: string;
    imagePosition?:
        | "center"
        | "top"
        | "bottom"
        | "left"
        | "right"
        | "top-left"
        | "top-right"
        | "bottom-left"
        | "bottom-right";
    aspectRatio?: "square" | "landscape" | "portrait" | "5/4" | "3/2" | "4/3" | string;
    imageZoom?: number;
    imageFinePosition?: {
        x?: number;
        y?: number;
    };
    ctaText?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
}

export function Hero({
    greeting = "Welcome",
    title = "Full Stack Developer",
    description = null,
    githubUrl = "https://github.com",
    image,
    imagePosition = "center",
    aspectRatio = "landscape",
    imageZoom,
    imageFinePosition,
    ctaText = "View GitHub",
    secondaryCtaText = "View Projects",
    secondaryCtaLink = "#projects",
}: HeroProps) {
    const isMobile = useIsMobile();
    const isTablet = useIsTablet();
    const isMobileOrTablet = useIsMobileOrTablet();

    const buttons = [
        {
            text: ctaText,
            href: githubUrl,
            icon: Github,
            external: true,
        },
        {
            text: secondaryCtaText,
            href: secondaryCtaLink,
            icon: ExternalLink,
            variant: "outline" as const,
        },
    ];

    // Create MediaItem structure for ResponsiveMedia
    const heroMedia: MediaItem | undefined = image
        ? {
              image: {
                  url: image,
                  alt: "Hero",
              },
              imagePosition,
              aspectRatio,
              imageZoom,
              imageFinePosition,
          }
        : undefined;

    const renderMobileLayout = () => {
        // Determine hero image container size
        const imageContainerClass = isTablet ? "max-w-md" : "max-w-sm"; // md is one step bigger than sm

        return (
            <div className="w-full">
                {/* Hero image with decorative blur effect */}
                <div className={`relative mb-8 mx-auto ${imageContainerClass}`}>
                    <SimpleMedia media={heroMedia} alt="Hero" priority={true} />
                    <div
                        className={`absolute -inset-3 ${commonClasses.backgroundGradient} rounded-2xl -z-10 opacity-50 blur-lg`}
                    ></div>
                </div>

                <div className="text-center space-y-6">
                    <div className="space-y-4">
                        <p className="text-xs text-primary font-medium uppercase tracking-wider">
                            {greeting}
                        </p>
                        <h1
                            className={cn(
                                createResponsiveText("heroTitle", isMobile),
                                "font-bold leading-tight",
                                commonClasses.gradientText
                            )}
                        >
                            {title}
                        </h1>
                        {description ? (
                            <div className="text-base text-muted-foreground leading-relaxed px-4 [&>p]:mb-0">
                                <RichText data={description} />
                            </div>
                        ) : (
                            <p className="text-base text-muted-foreground leading-relaxed px-4">
                                Building modern web applications
                            </p>
                        )}
                    </div>

                    <div data-tour="hero-cta">
                        <ButtonGroup
                            buttons={buttons}
                            fullWidthMobile={true}
                            className="px-4"
                        />
                    </div>
                </div>
            </div>
        );
    };

    const renderDesktopLayout = () => (
        <div className={createResponsiveLayout("twoColumn", false)}>
            <div className="space-y-8 max-w-xl">
                <div className="space-y-6">
                    <p className="text-sm text-primary font-medium uppercase tracking-wider">
                        {greeting}
                    </p>
                    <h1
                        className={cn(
                            createResponsiveText("heroTitle", isMobile),
                            "font-bold leading-tight",
                            commonClasses.gradientText
                        )}
                    >
                        {title}
                    </h1>
                    {description ? (
                        <div className="text-lg text-muted-foreground leading-relaxed [&>p]:mb-0">
                            <RichText data={description} />
                        </div>
                    ) : (
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Building modern web applications
                        </p>
                    )}
                </div>

                <div data-tour="hero-cta">
                    <ButtonGroup buttons={buttons} fullWidthMobile={false} />
                </div>
            </div>

            <div className="relative group">
                <SimpleMedia media={heroMedia} alt="Hero" priority={true} />
                <div
                    className={`absolute -inset-4 ${commonClasses.backgroundGradient} rounded-3xl -z-10 opacity-50 blur-xl`}
                ></div>
            </div>
        </div>
    );

    return (
        <SectionWrapper
            id="home"
            className={cn(
                isMobileOrTablet
                    ? "min-h-[85vh] flex items-center pt-8 pb-16"
                    : "min-h-[90vh] flex items-center"
            )}
        >
            {isMobileOrTablet ? renderMobileLayout() : renderDesktopLayout()}
        </SectionWrapper>
    );
}
