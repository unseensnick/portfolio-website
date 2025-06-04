"use client";

import { ButtonGroup } from "@/components/shared/button-group";
import { IconCard, ResponsiveCard } from "@/components/shared/responsive-card";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatExternalUrl } from "@/lib/url-utils";
import { cn } from "@/lib/utils";
import { Github, Mail } from "lucide-react";

/**
 * Props for the Contact component
 * @property title - Section heading
 * @property description - Section subheading/description
 * @property email - Your contact email address
 * @property github - Your GitHub username or profile URL
 * @property emailSubtitle - Text shown under "Email" in contact card
 * @property githubSubtitle - Text shown under "GitHub" in contact card
 * @property ctaTitle - Call-to-action card heading
 * @property ctaDescription - Call-to-action card description
 */
interface ContactProps {
    title?: string;
    description?: string;
    email?: string;
    github?: string;
    emailSubtitle?: string;
    githubSubtitle?: string;
    ctaTitle?: string;
    ctaDescription?: string;
}

/**
 * Contact section with contact cards and call-to-action area
 *
 * Features:
 * - Contact information displayed in visually appealing cards
 * - Call-to-action card with direct email and GitHub links
 * - Responsive layout that adapts between mobile and desktop
 * - Properly formatted links for email and external URLs
 */
export function Contact({
    title = "Get in Touch",
    description = "Feel free to reach out for collaborations or just a friendly hello",
    email = "hello@example.com",
    github = "github.com/username",
    emailSubtitle = "Email me anytime",
    githubSubtitle = "Check out my code",
    ctaTitle = "Let's work together",
    ctaDescription = "Have a project in mind? Let's discuss how I can help you.",
}: ContactProps) {
    const isMobile = useIsMobile();

    // Configure email and GitHub buttons for the CTA card
    const buttons = [
        {
            text: "Send Email",
            href: `mailto:${email}`,
            icon: Mail,
        },
        {
            text: "View GitHub",
            href: formatExternalUrl(github),
            icon: Github,
            external: true,
            variant: "outline" as const,
        },
    ];

    /**
     * Renders contact information cards in a responsive grid
     */
    const renderContactCards = () => (
        <div
            className={cn(
                isMobile
                    ? "space-y-4 mb-12"
                    : "grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
            )}
        >
            {/* Email contact card */}
            <IconCard
                icon={Mail}
                title="Email"
                subtitle={emailSubtitle}
                linkText={email}
                linkHref={`mailto:${email}`}
            />

            {/* GitHub contact card */}
            <IconCard
                icon={Github}
                title="GitHub"
                subtitle={githubSubtitle}
                linkText={github}
                linkHref={github}
                isExternal={true}
            />
        </div>
    );

    /**
     * Renders the call-to-action card with buttons
     */
    const renderCtaCard = () => (
        <div className={isMobile ? "" : "text-center"}>
            <ResponsiveCard className="bg-gradient-to-br from-muted/50 via-muted/30 to-transparent">
                <div
                    className={cn(
                        "space-y-4 text-center",
                        isMobile ? "" : "space-y-6"
                    )}
                >
                    {/* CTA heading and description */}
                    <div className={cn("space-y-", isMobile ? "3" : "4")}>
                        <h3
                            className={cn(
                                "font-bold text-foreground",
                                isMobile ? "text-xl" : "text-2xl lg:text-3xl"
                            )}
                        >
                            {ctaTitle}
                        </h3>
                        <p
                            className={cn(
                                "text-muted-foreground",
                                isMobile
                                    ? "text-sm leading-relaxed"
                                    : "text-lg max-w-md mx-auto"
                            )}
                        >
                            {ctaDescription}
                        </p>
                    </div>

                    {/* CTA buttons */}
                    <ButtonGroup
                        buttons={buttons}
                        fullWidthMobile={isMobile}
                        className={isMobile ? "pt-2" : "pt-4 justify-center"}
                    />
                </div>
            </ResponsiveCard>
        </div>
    );

    return (
        <SectionWrapper id="contact" title={title} description={description}>
            {renderContactCards()}
            {renderCtaCard()}
        </SectionWrapper>
    );
}
