"use client";

import { SectionWrapper } from "@/components/shared/section-wrapper";
import { SimpleMedia } from "@/components/shared/simple-media";
import { TechBadgeGroup } from "@/components/tech-badge";
import { useIsMobile } from "@/hooks/use-mobile";
import {
    cn,
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
    paragraphs?: string[];
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
    aspectRatio?: "square" | "landscape" | "portrait" | string;
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
    paragraphs = [
        "I'm a passionate developer with experience in web development.",
    ],
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
    const { container, content, spacing } = createContentWrapper(isMobile);

    // Create MediaItem structure for ResponsiveMedia
    const aboutMedia: MediaItem | undefined = image
        ? {
              image: {
                  url: image,
                  alt: "About",
              },
              imagePosition,
              aspectRatio,
              imageZoom,
              imageFinePosition,
          }
        : undefined;

    const renderImage = () => (
        <div className={isMobile ? "mx-auto max-w-sm" : "lg:col-span-2"}>
            <SimpleMedia media={aboutMedia} alt="About" />
        </div>
    );

    const renderContent = () => (
        <div className={cn(content, spacing)}>
            <div className="space-y-4" data-tour="about-paragraphs">
                {paragraphs.map((paragraph, index) => (
                    <p
                        key={index}
                        className={cn(
                            "text-muted-foreground leading-relaxed",
                            createResponsiveText("body", isMobile)
                        )}
                    >
                        {paragraph}
                    </p>
                ))}
            </div>

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
