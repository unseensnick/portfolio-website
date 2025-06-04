"use client";

import { ResponsiveImage } from "@/components/shared/responsive-image";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

/**
 * Styled tag component for displaying technology keywords
 */
function TechTag({ text }: { text: string }) {
    return (
        <Badge
            variant="secondary"
            className={cn(
                "rounded-full font-medium bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-300",
                "px-3 py-1.5 text-sm"
            )}
        >
            {text}
        </Badge>
    );
}

/**
 * Styled list item for displaying interest points
 */
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
 * About section displaying bio, technologies, and interests
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
                    {/* Profile image */}
                    <div className="mx-auto max-w-sm">
                        <ResponsiveImage
                            src={image}
                            alt="About"
                            aspectRatio="square"
                        />
                    </div>

                    {/* Bio, technologies and interests */}
                    <div className="space-y-8">
                        {/* Bio paragraphs */}
                        <div className="space-y-4">
                            {paragraphs.map((paragraph, index) => (
                                <p
                                    key={index}
                                    className="text-base text-muted-foreground leading-relaxed"
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* Technologies list */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground">
                                {technologiesHeading}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {technologies.map((tech, index) => (
                                    <TechTag key={index} text={tech} />
                                ))}
                            </div>
                        </div>

                        {/* Interests list */}
                        <div className="space-y-4">
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

        // Desktop version
        return (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-20">
                {/* Profile image column */}
                <div className="lg:col-span-2">
                    <ResponsiveImage
                        src={image}
                        alt="About"
                        aspectRatio="portrait"
                    />
                </div>

                {/* Bio, technologies and interests column */}
                <div className="lg:col-span-3 space-y-12">
                    {/* Bio paragraphs */}
                    <div className="space-y-6">
                        {paragraphs.map((paragraph, index) => (
                            <p
                                key={index}
                                className="text-lg text-muted-foreground leading-relaxed"
                            >
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {/* Technologies list */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-foreground">
                            {technologiesHeading}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {technologies.map((tech, index) => (
                                <TechTag key={index} text={tech} />
                            ))}
                        </div>
                    </div>

                    {/* Interests list */}
                    <div className="space-y-6">
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
        <SectionWrapper id="about" title={title}>
            {renderContent()}
        </SectionWrapper>
    );
}
