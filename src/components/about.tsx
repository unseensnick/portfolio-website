"use client";

import { ResponsiveImage } from "@/components/shared/responsive-image";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { TechBadgeGroup } from "@/components/tech-badge";
import { useIsMobile } from "@/hooks/use-mobile";

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
    technologiesHeading?: string;
    interestsHeading?: string;
}

/**
 * About section with different layouts for mobile (stacked) and desktop (two-column)
 */
export function About({
    title = "About Me",
    paragraphs = [
        "I'm a passionate developer with experience in web development.",
    ],
    technologies = ["React", "TypeScript", "Next.js"],
    interests = ["Web Development", "UI/UX Design", "Open Source"],
    image,
    technologiesHeading = "Technologies",
    interestsHeading = "Interests",
}: AboutProps) {
    const isMobile = useIsMobile();

    const renderContent = () => {
        if (isMobile) {
            return (
                <div className="space-y-10">
                    <div className="mx-auto max-w-sm">
                        <ResponsiveImage
                            src={image}
                            alt="About"
                            aspectRatio="square"
                        />
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4" data-tour="about-paragraphs">
                            {paragraphs.map((paragraph, index) => (
                                <p
                                    key={index}
                                    className="text-base text-muted-foreground leading-relaxed"
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        <div className="space-y-4" data-tour="technologies">
                            <h3 className="text-lg font-semibold text-foreground">
                                {technologiesHeading}
                            </h3>
                            <TechBadgeGroup
                                technologies={technologies}
                                size="sm"
                            />
                        </div>

                        <div className="space-y-4" data-tour="interests">
                            <h3 className="text-lg font-semibold text-foreground">
                                {interestsHeading}
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {interests.map((interest, index) => (
                                    <InterestItem key={index} text={interest} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-20">
                <div className="lg:col-span-2">
                    <ResponsiveImage
                        src={image}
                        alt="About"
                        aspectRatio="portrait"
                    />
                </div>

                <div className="lg:col-span-3 space-y-12">
                    <div className="space-y-6" data-tour="about-paragraphs">
                        {paragraphs.map((paragraph, index) => (
                            <p
                                key={index}
                                className="text-lg text-muted-foreground leading-relaxed"
                            >
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    <div className="space-y-6" data-tour="technologies">
                        <h3 className="text-xl font-semibold text-foreground">
                            {technologiesHeading}
                        </h3>
                        <TechBadgeGroup technologies={technologies} size="lg" />
                    </div>

                    <div className="space-y-6" data-tour="interests">
                        <h3 className="text-xl font-semibold text-foreground">
                            {interestsHeading}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {interests.map((interest, index) => (
                                <InterestItem key={index} text={interest} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <SectionWrapper id="about" title={title} data-tour="about-section">
            {renderContent()}
        </SectionWrapper>
    );
}
