"use client";

import { ResponsiveImage } from "@/components/shared/responsive-image";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { TechBadgeGroup } from "@/components/ui/tech-badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

/**
 * Simple component to display an interest item with a bullet point
 *
 * @param text - The interest text to display
 */
function InterestItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-2 text-muted-foreground">
            <div className="rounded-full bg-primary size-1.5"></div>
            <span className="text-sm">{text}</span>
        </div>
    );
}

/**
 * Props for the About component
 * @property title - Section heading
 * @property paragraphs - Array of bio paragraphs to display
 * @property technologies - Array of technology names to display as badges
 * @property interests - Array of interests to display as bullet points
 * @property image - URL for profile image
 * @property technologiesHeading - Custom heading for technologies section
 * @property interestsHeading - Custom heading for interests section
 */
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
 * About section component displaying profile, bio, technologies, and interests
 *
 * Features:
 * - Responsive layout with different designs for mobile and desktop
 * - Profile image display with appropriate aspect ratio
 * - Bio paragraphs with proper typography and spacing
 * - Technology badges showcasing skills
 * - Interests displayed as bullet points
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

    /**
     * Renders appropriate layout based on viewport size
     */
    const renderContent = () => {
        if (isMobile) {
            // Mobile layout: stacked with image at top
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
                            <TechBadgeGroup
                                technologies={technologies}
                                size="sm"
                            />
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

        // Desktop layout: two columns with image on left
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
                        <TechBadgeGroup technologies={technologies} size="lg" />
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
