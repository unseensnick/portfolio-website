"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { ExternalLink, Github, Mail } from "lucide-react";
import Link from "next/link";

/**
 * Contact card for mobile layout with icon, title and link
 */
function MobileContactCard({
    icon: Icon,
    title,
    subtitle,
    href,
    isEmail = false,
}) {
    return (
        <Card className="group p-6 border-border bg-card hover:bg-muted/50 transition-all duration-500 hover:shadow-lg hover:shadow-black/5">
            <div className="text-center space-y-3">
                <div className="size-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="size-6 text-primary" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                </div>
                <Link
                    href={isEmail ? `mailto:${href}` : `https://${href}`}
                    target={isEmail ? "_self" : "_blank"}
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-all duration-300 group-hover:underline text-sm"
                >
                    {href}
                    <ExternalLink className="size-3" />
                </Link>
            </div>
        </Card>
    );
}

/**
 * Contact card for desktop layout with icon, title and link
 */
function DesktopContactCard({
    icon: Icon,
    title,
    subtitle,
    href,
    isEmail = false,
}) {
    return (
        <Card className="group p-8 border-border bg-card hover:bg-muted/50 transition-all duration-500 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1">
            <div className="text-center space-y-4">
                <div className="size-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="size-8 text-primary" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {title}
                    </h3>
                    <p className="text-base text-muted-foreground">
                        {subtitle}
                    </p>
                </div>
                <Link
                    href={isEmail ? `mailto:${href}` : `https://${href}`}
                    target={isEmail ? "_self" : "_blank"}
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-all duration-300 group-hover:underline"
                >
                    {href}
                    <ExternalLink className="size-4" />
                </Link>
            </div>
        </Card>
    );
}

/**
 * Contact section with contact cards and call-to-action buttons
 * Provides different layouts for mobile and desktop
 */
export function Contact({
    title,
    description,
    email,
    github,
    emailSubtitle,
    githubSubtitle,
    ctaTitle,
    ctaDescription,
}) {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <section className="py-16">
                <div className="px-6">
                    {/* Section header */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                            {title}
                        </h2>
                        <p className="text-base text-muted-foreground leading-relaxed px-4">
                            {description}
                        </p>
                    </div>

                    {/* Contact method cards */}
                    <div className="space-y-4 mb-12">
                        <MobileContactCard
                            icon={Mail}
                            title="Email"
                            subtitle={emailSubtitle}
                            href={email}
                            isEmail={true}
                        />
                        <MobileContactCard
                            icon={Github}
                            title="GitHub"
                            subtitle={githubSubtitle}
                            href={github}
                        />
                    </div>

                    {/* Contact call-to-action card */}
                    <div>
                        <Card className="p-6 bg-gradient-to-br from-muted/50 via-muted/30 to-transparent border-border">
                            <div className="space-y-4 text-center">
                                <div className="space-y-3">
                                    <h3 className="text-xl font-bold text-foreground">
                                        {ctaTitle}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {ctaDescription}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 pt-2">
                                    <Button
                                        size="lg"
                                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-base font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                                        asChild
                                    >
                                        <Link href={`mailto:${email}`}>
                                            <Mail className="size-4 mr-2" />
                                            Send Email
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="w-full py-4 text-base font-medium border-2 hover:bg-muted transition-all duration-300"
                                        asChild
                                    >
                                        <Link
                                            href={`https://${github}`}
                                            target="_blank"
                                        >
                                            <Github className="size-4 mr-2" />
                                            View GitHub
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>
        );
    }

    // Desktop version
    return (
        <section className="py-24 lg:py-32">
            <div className="max-w-4xl mx-auto px-8">
                <div className="text-center mb-16 lg:mb-20">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                        {title}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Contact method cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <DesktopContactCard
                        icon={Mail}
                        title="Email"
                        subtitle={emailSubtitle}
                        href={email}
                        isEmail={true}
                    />
                    <DesktopContactCard
                        icon={Github}
                        title="GitHub"
                        subtitle={githubSubtitle}
                        href={github}
                    />
                </div>

                {/* Contact call-to-action card */}
                <div className="text-center">
                    <Card className="p-8 lg:p-12 bg-gradient-to-br from-muted/50 via-muted/30 to-transparent border-border">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                                    {ctaTitle}
                                </h3>
                                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                                    {ctaDescription}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                <Button
                                    size="lg"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                                    asChild
                                >
                                    <Link href={`mailto:${email}`}>
                                        <Mail className="size-5 mr-2" />
                                        Send Email
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="px-8 py-6 text-base font-medium border-2 hover:bg-muted transition-all duration-300"
                                    asChild
                                >
                                    <Link
                                        href={`https://${github}`}
                                        target="_blank"
                                    >
                                        <Github className="size-5 mr-2" />
                                        View GitHub
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}
