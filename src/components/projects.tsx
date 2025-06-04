"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/**
 * Mobile project card component with image and action buttons
 */
function MobileProjectItem({
    title,
    description,
    projectUrl,
    codeUrl,
    image,
}: {
    title: string;
    description: string;
    projectUrl?: string;
    codeUrl?: string;
    image?: string;
}) {
    // Check if we have any buttons to show
    const hasButtons = projectUrl || codeUrl;

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Project thumbnail */}
            <div className="aspect-[16/10] bg-gradient-to-br from-muted via-muted to-muted/50 relative overflow-hidden">
                {image && (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                )}
                {!image && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <div className="size-6 rounded bg-primary/20"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Project details and action buttons */}
            <div className="p-6 space-y-4">
                <div className="space-y-3">
                    <h3 className="text-xl font-bold text-foreground">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Render buttons only if URLs are provided */}
                {hasButtons && (
                    <div className="flex flex-col gap-3 pt-2">
                        {projectUrl && (
                            <Button
                                size="lg"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-base transition-all duration-300"
                                asChild
                            >
                                <Link href={projectUrl} target="_blank">
                                    <ExternalLink className="size-5 mr-2" />
                                    Live Demo
                                </Link>
                            </Button>
                        )}
                        {codeUrl && (
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full border-2 hover:bg-muted py-4 text-base transition-all duration-300"
                                asChild
                            >
                                <Link href={codeUrl} target="_blank">
                                    <Github className="size-5 mr-2" />
                                    Source Code
                                </Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Desktop project card with side-by-side layout and action buttons
 */
function DesktopProjectItem({
    title,
    description,
    projectUrl,
    codeUrl,
    image,
    reverse = false,
}: {
    title: string;
    description: string;
    projectUrl?: string;
    codeUrl?: string;
    image?: string;
    reverse?: boolean;
}) {
    // Check if we have any buttons to show
    const hasButtons = projectUrl || codeUrl;

    return (
        <div className="relative">
            <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                    reverse ? "lg:grid-flow-col-dense" : ""
                }`}
            >
                {/* Project image/thumbnail */}
                <div className={`relative ${reverse ? "lg:col-start-2" : ""}`}>
                    <div className="aspect-[16/10] bg-gradient-to-br from-muted via-muted to-muted/50 rounded-xl overflow-hidden border border-border/50 group relative">
                        {image && (
                            <Image
                                src={image}
                                alt={title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        )}
                        {!image && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="size-16 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <div className="size-8 rounded-lg bg-primary/20"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Project details and action buttons */}
                <div
                    className={`space-y-6 ${
                        reverse ? "lg:col-start-1 lg:row-start-1" : ""
                    }`}
                >
                    <div className="space-y-4">
                        <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                            {title}
                        </h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Render buttons only if URLs are provided */}
                    {hasButtons && (
                        <div className="flex flex-wrap gap-4">
                            {projectUrl && (
                                <Button
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300"
                                    asChild
                                >
                                    <Link href={projectUrl} target="_blank">
                                        <ExternalLink className="size-4 mr-2" />
                                        Live Demo
                                    </Link>
                                </Button>
                            )}
                            {codeUrl && (
                                <Button
                                    variant="outline"
                                    className="border-2 hover:bg-muted transition-all duration-300"
                                    asChild
                                >
                                    <Link href={codeUrl} target="_blank">
                                        <Github className="size-4 mr-2" />
                                        Source
                                    </Link>
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

interface ProjectItem {
    title: string;
    description: string;
    projectUrl?: string;
    codeUrl?: string;
    image?: string;
}

interface ProjectsProps {
    title?: string;
    featured?: ProjectItem;
    items?: ProjectItem[];
    viewAllLink?: string;
    description?: string;
    viewMoreText?: string;
}

/**
 * Projects section displaying featured and regular project items
 */
export function Projects({
    title = "Projects",
    featured = {
        title: "Featured Project",
        description: "A showcase of my best work",
        projectUrl: "#",
        codeUrl: "#",
    },
    items = [],
    viewAllLink,
    description = "Check out some of my recent projects",
    viewMoreText = "Want to see more of my work?",
}: ProjectsProps) {
    const isMobile = useIsMobile();

    // Combine featured project with other projects for uniform display
    const allProjects = featured ? [featured, ...items] : [...items];

    if (isMobile) {
        return (
            <section className="py-16">
                <div className="px-6">
                    {/* Section header */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                            {title}
                        </h2>
                        <p className="text-sm text-muted-foreground px-4">
                            {description}
                        </p>
                    </div>

                    {/* Project cards list */}
                    <div className="space-y-6 mb-12">
                        {allProjects.map((project, index) => (
                            <MobileProjectItem key={index} {...project} />
                        ))}
                    </div>

                    {/* GitHub repository link */}
                    {viewAllLink && (
                        <div className="text-center">
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground px-4">
                                    {viewMoreText}
                                </p>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full max-w-sm px-6 py-4 text-base font-medium border-2 hover:bg-muted transition-all duration-300 group"
                                    asChild
                                >
                                    <Link href={viewAllLink} target="_blank">
                                        <Github className="size-5 mr-2" />
                                        View All on GitHub
                                        <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                                            →
                                        </span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    // Desktop version
    return (
        <section className="py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-16 lg:mb-20">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                        {title}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {description}
                    </p>
                </div>

                <div className="space-y-32">
                    {/* Featured project (first item) */}
                    {featured && <DesktopProjectItem {...featured} />}

                    {/* Regular projects (alternating layout) */}
                    {items.map((project, index) => (
                        <DesktopProjectItem
                            key={index}
                            {...project}
                            reverse={index % 2 === 0}
                        />
                    ))}
                </div>

                {/* GitHub repository link */}
                {viewAllLink && (
                    <div className="text-center mt-24">
                        <div className="space-y-6">
                            <p className="text-lg text-muted-foreground">
                                {viewMoreText}
                            </p>
                            <Button
                                variant="outline"
                                size="lg"
                                className="px-8 py-6 text-base font-medium border-2 hover:bg-muted transition-all duration-300 group"
                                asChild
                            >
                                <Link href={viewAllLink} target="_blank">
                                    <Github className="size-5 mr-2" />
                                    View All on GitHub
                                    <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                                        →
                                    </span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
