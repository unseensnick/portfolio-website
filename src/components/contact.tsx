"use client";

import { ButtonGroup } from "@/components/shared/button-group";
import { IconCard, ResponsiveCard } from "@/components/shared/responsive-card";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatExternalUrl } from "@/lib/url-utils";
import {
    cn,
    createResponsiveLayout,
    createResponsiveSpacing,
    createResponsiveText,
} from "@/lib/utils";
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
 * Contact section with responsive layout using utility patterns
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
            className={cn(
                createResponsiveLayout("grid", isMobile),
                isMobile ? "mb-12" : "mb-16"
            )}
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
                    className={cn(
                        "text-center",
                        createResponsiveSpacing("layout", isMobile)
                    )}
                >
                    <div
                        className={createResponsiveSpacing("content", isMobile)}
                    >
                        <h3
                            className={cn(
                                "font-bold text-foreground",
                                createResponsiveText("heading", isMobile)
                            )}
                        >
                            {ctaTitle}
                        </h3>
                        <p
                            className={cn(
                                "text-muted-foreground",
                                createResponsiveText("description", isMobile)
                            )}
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
            data-tour="contact-section"
        >
            {renderContactCards()}
            {renderCtaCard()}
        </SectionWrapper>
    );
}
