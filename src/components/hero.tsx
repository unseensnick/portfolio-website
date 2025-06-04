"use client";

import { ButtonGroup } from "@/components/shared/button-group";
import { ResponsiveImage } from "@/components/shared/responsive-image";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatExternalUrl } from "@/lib/url-utils";
import { Github } from "lucide-react";

interface HeroProps {
    greeting?: string;
    title?: string;
    description?: string;
    githubUrl?: string;
    image?: string;
    ctaText?: string;
    ctaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
}

export function Hero({
    greeting = "Welcome",
    title = "Full Stack Developer",
    description = "Building modern web applications",
    githubUrl = "https://github.com",
    image,
    ctaText = "View GitHub",
    ctaLink,
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
        if (isMobile) {
            return (
                <div className="w-full">
                    {/* Hero image with decorative elements */}
                    <div className="relative mb-8 mx-auto max-w-sm">
                        <ResponsiveImage
                            src={image}
                            alt="Hero"
                            aspectRatio="square"
                            priority={true}
                        />
                        {/* Decorative blur effect */}
                        <div className="absolute -inset-3 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-2xl -z-10 opacity-50 blur-lg"></div>
                    </div>

                    {/* Hero content and call-to-action buttons */}
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
                        />
                    </div>
                </div>
            );
        }

        // Desktop version
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                {/* Left column: content and call-to-action */}
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

                    <ButtonGroup buttons={buttons} fullWidthMobile={false} />
                </div>

                {/* Right column: hero image with effects */}
                <div className="relative group">
                    <ResponsiveImage
                        src={image}
                        alt="Hero"
                        aspectRatio="landscape"
                        priority={true}
                    />

                    {/* Decorative blur effect */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-3xl -z-10 opacity-50 blur-xl"></div>
                </div>
            </div>
        );
    };

    return (
        <SectionWrapper
            id="home"
            className={
                isMobile
                    ? "min-h-[85vh] flex items-center pt-8 pb-16"
                    : "min-h-[90vh] flex items-center"
            }
        >
            {renderContent()}
        </SectionWrapper>
    );
}
