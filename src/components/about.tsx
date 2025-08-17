"use client";

import { SectionWrapper } from "@/components/shared/section-wrapper";
import { SimpleMedia } from "@/components/shared/simple-media";
import { TechBadgeGroup } from "@/components/tech-badge";
import { RichText } from '@payloadcms/richtext-lexical/react';
import {
    useIsMobile,
    useIsMobileOrTablet,
    useIsTablet,
} from "@/hooks/use-mobile";
import {
    cn,
    commonClasses,
    createContentWrapper,
    createResponsiveLayout,
    createResponsiveText,
} from "@/lib/utils";
import { MediaItem } from "@/types/portfolio";

function InterestItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-2 text-muted-foreground">
            <div className="rounded-full bg-primary size-1.5"></div>
            <span className="text-sm">{text}</span>
        </div>
    );
}

interface AboutProps {
    title?: string;
    content?: any;
    technologies?: string[];
    interests?: string[];
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
    technologiesHeading?: string;
    interestsHeading?: string;
}

export function About({
    title = "About Me",
    content = null,
    technologies = ["React", "TypeScript", "Next.js"],
    interests = ["Web Development", "UI/UX Design", "Open Source"],
    image,
    imagePosition = "center",
    aspectRatio = "portrait",
    imageZoom,
    imageFinePosition,
    technologiesHeading = "Technologies",
    interestsHeading = "Interests",
}: AboutProps) {
    const isMobile = useIsMobile();
    const isTablet = useIsTablet();
    const isMobileOrTablet = useIsMobileOrTablet();

    // Use mobile layout for both mobile and tablet, desktop layout only for desktop
    const { container, content: contentWrapper, spacing } =
        createContentWrapper(isMobileOrTablet);

    // Create MediaItem structure for ResponsiveMedia - always create it to show placeholder if no image
    const aboutMedia: MediaItem = {
        image: image
            ? {
                  url: image,
                  alt: "About",
              }
            : {
                  url: "/placeholder-image.svg",
                  alt: "About placeholder image",
              },
        imagePosition,
        aspectRatio,
        imageZoom,
        imageFinePosition,
    };

    const renderImage = () => {
        // Determine image container size based on screen size
        let containerClass = "";
        if (isMobile) {
            containerClass = "mx-auto max-w-xs"; // Smaller on mobile
        } else if (isTablet) {
            containerClass = "mx-auto max-w-sm"; // Medium on tablet
        } else {
            containerClass = "lg:col-span-2"; // Full size on desktop
        }

        return (
            <div className={containerClass}>
                <div className="relative">
                    <SimpleMedia media={aboutMedia} alt="About" />
                    {/* Decorative blur effect like hero section */}
                    <div
                        className={`absolute -inset-2 ${commonClasses.backgroundGradient} rounded-2xl -z-10 opacity-30 blur-lg`}
                    ></div>
                </div>
            </div>
        );
    };

    const renderContent = () => (
        <div className={cn(contentWrapper, spacing)}>
            {content ? (
                <div className={cn(
                    "text-muted-foreground leading-relaxed [&>p]:mb-4 [&>p:last-child]:mb-0",
                    createResponsiveText("body", isMobile)
                )}>
                    <RichText data={content} />
                </div>
            ) : (
                <p className={cn(
                    "text-muted-foreground leading-relaxed",
                    createResponsiveText("body", isMobile)
                )}>
                    I&apos;m a passionate developer with experience in web development.
                </p>
            )}

            <div className="space-y-4" data-tour="technologies">
                <h3
                    className={cn(
                        "font-semibold text-foreground",
                        createResponsiveText("subheading", isMobile)
                    )}
                >
                    {technologiesHeading}
                </h3>
                <TechBadgeGroup
                    technologies={technologies}
                    size={isMobile ? "sm" : "lg"}
                />
            </div>

            <div className="space-y-4" data-tour="interests">
                <h3
                    className={cn(
                        "font-semibold text-foreground",
                        createResponsiveText("subheading", isMobile)
                    )}
                >
                    {interestsHeading}
                </h3>
                <div
                    className={cn(
                        "gap-3",
                        createResponsiveLayout("simpleGrid", isMobile)
                    )}
                >
                    {interests.map((interest, index) => (
                        <InterestItem key={index} text={interest} />
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <SectionWrapper id="about" title={title}>
            <div className={container}>
                {renderImage()}
                {renderContent()}
            </div>
        </SectionWrapper>
    );
}
