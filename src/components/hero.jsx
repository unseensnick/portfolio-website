"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Hero({ greeting, title, description, githubUrl, image }) {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <section className="min-h-[85vh] flex items-center pt-8 pb-16">
                <div className="w-full px-6">
                    {/* Mobile Image First */}
                    <div className="relative mb-8 mx-auto max-w-sm">
                        <div className="aspect-square bg-gradient-to-br from-muted via-muted to-muted/50 rounded-2xl w-full relative overflow-hidden border border-border/50 shadow-xl">
                            {image && (
                                <Image
                                    src={image}
                                    alt="Hero"
                                    fill
                                    className="object-cover rounded-2xl"
                                    priority
                                />
                            )}
                            {!image && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                        <div className="w-10 h-10 rounded-full bg-primary/20"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Mobile decorative elements */}
                        <div className="absolute -inset-3 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-2xl -z-10 opacity-50 blur-lg"></div>
                    </div>

                    {/* Mobile Content */}
                    <div className="text-center space-y-6">
                        <div className="space-y-4">
                            <p className="text-xs text-primary font-medium uppercase tracking-wider">
                                {greeting}
                            </p>
                            <h1 className="text-3xl font-bold leading-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                                {title}
                            </h1>
                            <p className="text-base text-muted-foreground leading-relaxed px-4">
                                {description}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 pt-4 px-4">
                            <Link
                                href={githubUrl}
                                target="_blank"
                                className="inline-block"
                            >
                                <Button
                                    size="lg"
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-base font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2"
                                >
                                    <Github className="size-5" />
                                    View GitHub
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full py-4 text-base font-medium border-2 hover:bg-muted transition-all duration-300"
                                asChild
                            >
                                <Link href="#projects">View Projects</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Desktop version (unchanged)
    return (
        <section className="min-h-[90vh] flex items-center">
            <div className="max-w-7xl mx-auto px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <div className="space-y-8 max-w-xl">
                        <div className="space-y-6">
                            <p className="text-sm text-primary font-medium uppercase tracking-wider">
                                {greeting}
                            </p>
                            <h1 className="text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                                {title}
                            </h1>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {description}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link
                                href={githubUrl}
                                target="_blank"
                                className="inline-block"
                            >
                                <Button
                                    size="lg"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 flex items-center gap-2"
                                >
                                    <Github className="size-6" />
                                    View GitHub
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="lg"
                                className="px-8 py-6 text-base font-medium border-2 hover:bg-muted transition-all duration-300"
                                asChild
                            >
                                <Link href="#projects">View Projects</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="aspect-[4/3] bg-gradient-to-br from-muted via-muted to-muted/50 rounded-2xl w-full relative overflow-hidden border border-border/50 shadow-2xl shadow-black/5">
                            {image && (
                                <Image
                                    src={image}
                                    alt="Hero"
                                    fill
                                    className="object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                                    priority
                                />
                            )}
                            {!image && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-primary/20"></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-3xl -z-10 opacity-50 blur-xl"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
