"use client";

import { ButtonGroup } from "@/components/shared/button-group";
import { IconCard, ResponsiveCard } from "@/components/shared/responsive-card";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatExternalUrl } from "@/lib/url-utils";
import { cn } from "@/lib/utils";
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
 * Contact section with responsive layout using standard Tailwind responsive classes
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

    return (
        <SectionWrapper id="contact" title={title} description={description}>
            {/* Contact cards */}
            <div className="space-y-4 mb-12 md:grid md:grid-cols-2 md:gap-8 md:space-y-0 lg:mb-16">
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

            {/* CTA card */}
            <div className="md:text-center">
                <ResponsiveCard className="bg-gradient-to-br from-muted/50 via-muted/30 to-transparent">
                    <div className="text-center space-y-6 lg:space-y-8">
                        <div className="space-y-4 lg:space-y-6">
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                                {ctaTitle}
                            </h3>
                            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-4 lg:px-0 text-muted-foreground">
                                {ctaDescription}
                            </p>
                        </div>

                        <ButtonGroup
                            buttons={buttons}
                            fullWidthMobile={isMobile}
                            className={cn(
                                isMobile ? "pt-2" : "pt-4 justify-center"
                            )}
                        />
                    </div>
                </ResponsiveCard>
            </div>
        </SectionWrapper>
    );
}
