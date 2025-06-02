import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, Github, Mail } from "lucide-react";
import Link from "next/link";

function ContactCard({ icon: Icon, title, subtitle, href, isEmail = false }) {
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

                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <ContactCard
                        icon={Mail}
                        title="Email"
                        subtitle={emailSubtitle}
                        href={email}
                        isEmail={true}
                    />
                    <ContactCard
                        icon={Github}
                        title="GitHub"
                        subtitle={githubSubtitle}
                        href={github}
                    />
                </div>

                {/* Call to Action */}
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
