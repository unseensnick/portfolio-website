"use client";

import { ButtonGroup } from "@/components/shared/button-group";
import { ResponsiveCard } from "@/components/shared/responsive-card";
import { ResponsiveImage } from "@/components/shared/responsive-image";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatExternalUrl } from "@/lib/url-utils";
import { cn } from "@/lib/utils";
import { ExternalLink, Github } from "lucide-react";

interface Technology {
    name: string;
}

/**
 * Displays technology tags used in a project with the same style as About section
 */
function TechnologyTags({ technologies }: { technologies?: Technology[] }) {
    if (!technologies || technologies.length === 0) return null;

    // Group technologies in chunks of 4 for better visual arrangement
    const chunkSize = 4;
    const techGroups = [];

    for (let i = 0; i < technologies.length; i += chunkSize) {
        techGroups.push(technologies.slice(i, i + chunkSize));
    }

    return (
        <div className="space-y-2.5">
            {techGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="flex flex-wrap gap-2.5">
                    {group.map((tech, index) => (
                        <Badge
                            key={index}
                            variant="secondary"
                            className={cn(
                                "rounded-full font-medium bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-300",
                                "px-2.5 py-1 text-[0.8125rem]"
                            )}
                        >
                            {tech.name}
                        </Badge>
                    ))}
                </div>
            ))}
        </div>
    );
}

/**
 * Mobile project card component with image and action buttons
 */
function MobileProjectItem({
    title,
    description,
    projectUrl,
    codeUrl,
    technologies,
    image,
}: {
    title: string;
    description: string;
    projectUrl?: string;
    codeUrl?: string;
    technologies?: Technology[];
    image?: string;
}) {
    const buttons = [];

    if (projectUrl) {
        buttons.push({
            text: "Live Demo",
            href: formatExternalUrl(projectUrl),
            icon: ExternalLink,
            external: true,
        });
    }

    if (codeUrl) {
        buttons.push({
            text: "Source Code",
            href: formatExternalUrl(codeUrl),
            icon: Github,
            external: true,
            variant: "outline" as const,
        });
    }

    return (
        <ResponsiveCard className="overflow-hidden p-0">
            {/* Project thumbnail */}
            <div>
                <ResponsiveImage
                    src={image}
                    alt={title}
                    aspectRatio="landscape"
                />
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

                    {/* Technology tags */}
                    <TechnologyTags technologies={technologies} />
                </div>

                {buttons.length > 0 && (
                    <ButtonGroup
                        buttons={buttons}
                        fullWidthMobile={true}
                        className="pt-2"
                    />
                )}
            </div>
        </ResponsiveCard>
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
    technologies,
    image,
    reverse = false,
}: {
    title: string;
    description: string;
    projectUrl?: string;
    codeUrl?: string;
    technologies?: Technology[];
    image?: string;
    reverse?: boolean;
}) {
    const buttons = [];

    if (projectUrl) {
        buttons.push({
            text: "Live Demo",
            href: formatExternalUrl(projectUrl),
            icon: ExternalLink,
            external: true,
        });
    }

    if (codeUrl) {
        buttons.push({
            text: "Source",
            href: formatExternalUrl(codeUrl),
            icon: Github,
            external: true,
            variant: "outline" as const,
        });
    }

    return (
        <div className="relative">
            <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                    reverse ? "lg:grid-flow-col-dense" : ""
                }`}
            >
                {/* Project image/thumbnail */}
                <div
                    className={`relative group ${reverse ? "lg:col-start-2" : ""}`}
                >
                    <ResponsiveImage
                        src={image}
                        alt={title}
                        aspectRatio="landscape"
                    />
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

                        {/* Technology tags */}
                        <TechnologyTags technologies={technologies} />
                    </div>

                    {buttons.length > 0 && (
                        <ButtonGroup
                            buttons={buttons}
                            fullWidthMobile={false}
                        />
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
    technologies?: Technology[];
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

    // Combine featured project with other projects for uniform display on mobile
    const allProjects = featured ? [featured, ...items] : [...items];

    // Format viewAllLink for safety
    const formattedViewAllLink = viewAllLink
        ? formatExternalUrl(viewAllLink)
        : "";

    // Create GitHub view all button
    const githubButton = formattedViewAllLink
        ? [
              {
                  text: "View All on GitHub",
                  href: formattedViewAllLink,
                  icon: Github,
                  external: true,
                  variant: "outline" as const,
              },
          ]
        : [];

    const renderProjects = () => (
        <div className={isMobile ? "space-y-6 mb-12" : "space-y-32"}>
            {/* Featured project (first item) on desktop only */}
            {!isMobile && featured && <DesktopProjectItem {...featured} />}

            {/* Projects list - all on mobile, non-featured on desktop */}
            {isMobile
                ? allProjects.map((project, index) => (
                      <MobileProjectItem key={index} {...project} />
                  ))
                : items.map((project, index) => (
                      <DesktopProjectItem
                          key={index}
                          {...project}
                          reverse={index % 2 === 0}
                      />
                  ))}
        </div>
    );

    const renderViewAllLink = () => {
        if (!viewAllLink) return null;

        return (
            <div className={`text-center ${isMobile ? "" : "mt-24"}`}>
                <div className="space-y-4 sm:space-y-6">
                    <p
                        className={`${isMobile ? "text-sm px-4" : "text-lg"} text-muted-foreground`}
                    >
                        {viewMoreText}
                    </p>
                    <ButtonGroup
                        buttons={githubButton}
                        fullWidthMobile={isMobile}
                        className={
                            isMobile ? "max-w-sm mx-auto" : "justify-center"
                        }
                    />
                </div>
            </div>
        );
    };

    return (
        <SectionWrapper id="projects" title={title} description={description}>
            {renderProjects()}
            {renderViewAllLink()}
        </SectionWrapper>
    );
}
