"use client";

import { ButtonGroup } from "@/components/shared/button-group";
import { IconCard, ResponsiveCard } from "@/components/shared/responsive-card";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatExternalUrl } from "@/lib/url-utils";
import { Github, Mail } from "lucide-react";

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
 * Contact section with contact cards and call-to-action buttons
 * Provides different layouts for mobile and desktop
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

    const renderContactCards = () => (
        <div
            className={
                isMobile
                    ? "space-y-4 mb-12"
                    : "grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
            }
        >
            <IconCard
                icon={Mail}
                title="Email"
                subtitle={emailSubtitle}
                linkText={email}
                linkHref={`mailto:${email}`}
            />
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

    const renderCtaCard = () => (
        <div className={isMobile ? "" : "text-center"}>
            <ResponsiveCard className="bg-gradient-to-br from-muted/50 via-muted/30 to-transparent">
                <div
                    className={`space-y-4 text-center ${isMobile ? "" : "space-y-6"}`}
                >
                    <div className={`space-y-${isMobile ? "3" : "4"}`}>
                        <h3
                            className={`font-bold text-foreground ${isMobile ? "text-xl" : "text-2xl lg:text-3xl"}`}
                        >
                            {ctaTitle}
                        </h3>
                        <p
                            className={`text-muted-foreground ${isMobile ? "text-sm leading-relaxed" : "text-lg max-w-md mx-auto"}`}
                        >
                            {ctaDescription}
                        </p>
                    </div>

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
        <SectionWrapper
            id="contact"
            title={title}
            description={description}
            className={isMobile ? "" : ""}
        >
            {renderContactCards()}
            {renderCtaCard()}
        </SectionWrapper>
    );
}
