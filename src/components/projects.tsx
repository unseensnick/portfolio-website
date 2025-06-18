"use client";

import { ButtonGroup } from "@/components/shared/button-group";
import { ProjectMediaCarousel } from "@/components/shared/project-media-carousel";
import { ResponsiveCard } from "@/components/shared/responsive-card";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { TechBadgeGroup } from "@/components/tech-badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatExternalUrl } from "@/lib/url-utils";
import { cn, createResponsiveSpacing, createResponsiveText } from "@/lib/utils";
import { MediaItem } from "@/types/portfolio";
import { ExternalLink, Github } from "lucide-react";

interface Technology {
    name: string;
}

interface ProjectItemProps {
    title: string;
    description: Array<{ text: string }>;
    projectUrl?: string;
    codeUrl?: string;
    technologies?: Technology[];

    // Updated media structure - can be single media or array of media
    media?: MediaItem | MediaItem[];
}

/**
 * Unified project item component that adapts to mobile/desktop layouts
 */
function ProjectItem({
    title,
    description,
    projectUrl,
    codeUrl,
    technologies,
    media,
    reverse = false,
    isMobile,
}: ProjectItemProps & { reverse?: boolean; isMobile: boolean }) {
    const buttons: Array<{
        text: string;
        href: string;
        icon: any;
        external: boolean;
        variant?: "outline";
    }> = [];

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
            text: isMobile ? "Source Code" : "Source",
            href: formatExternalUrl(codeUrl),
            icon: Github,
            external: true,
            variant: "outline" as const,
        });
    }

    const renderMedia = () => (
        <ProjectMediaCarousel
            media={media}
            title={title}
            aspectRatio="landscape"
        />
    );

    const renderContent = () => (
        <div className={createResponsiveSpacing("layout", isMobile)}>
            <div className={createResponsiveSpacing("content", isMobile)}>
                <h3
                    className={cn(
                        "font-bold text-foreground",
                        createResponsiveText("heading", isMobile)
                    )}
                >
                    {title}
                </h3>
                <div className="space-y-4">
                    {description.map((paragraph, index) => (
                        <p
                            key={index}
                            className={cn(
                                "text-muted-foreground leading-relaxed",
                                createResponsiveText("body", isMobile)
                            )}
                        >
                            {paragraph.text}
                        </p>
                    ))}
                </div>

                {technologies && technologies.length > 0 && (
                    <TechBadgeGroup
                        technologies={technologies}
                        size={isMobile ? "sm" : "md"}
                    />
                )}
            </div>

            {buttons.length > 0 && (
                <ButtonGroup
                    buttons={buttons}
                    fullWidthMobile={isMobile}
                    className={isMobile ? "pt-2" : ""}
                />
            )}
        </div>
    );

    // Mobile layout: stacked card
    if (isMobile) {
        return (
            <ResponsiveCard className="overflow-hidden p-0">
                <div>{renderMedia()}</div>
                <div className="p-6">{renderContent()}</div>
            </ResponsiveCard>
        );
    }

    // Desktop layout: side-by-side
    return (
        <div className="relative">
            <div
                className={cn(
                    "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center",
                    reverse && "lg:grid-flow-col-dense"
                )}
            >
                <div
                    className={cn(
                        "relative group",
                        reverse && "lg:col-start-2"
                    )}
                >
                    {renderMedia()}
                </div>

                <div className={cn(reverse && "lg:col-start-1 lg:row-start-1")}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

interface ProjectItem {
    title: string;
    description: Array<{ text: string }>;
    projectUrl?: string;
    codeUrl?: string;
    technologies?: Technology[];

    // Updated media structure - can be single media or array of media
    media?: MediaItem | MediaItem[];
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
 * Projects section with responsive layout using utility patterns
 */
export function Projects({
    title = "Projects",
    featured = {
        title: "Featured Project",
        description: [{ text: "A showcase of my best work" }],
        projectUrl: "#",
        codeUrl: "#",
    },
    items = [],
    viewAllLink,
    description = "Check out some of my recent projects",
    viewMoreText = "Want to see more of my work?",
}: ProjectsProps) {
    const isMobile = useIsMobile();

    const allProjects = featured ? [featured, ...items] : [...items];

    const formattedViewAllLink = viewAllLink
        ? formatExternalUrl(viewAllLink)
        : "";

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

    const renderViewAllLink = () => {
        if (!formattedViewAllLink) return null;

        return (
            <div className="flex flex-col items-center text-center">
                <div className="space-y-4">
                    <p className="text-muted-foreground">{viewMoreText}</p>
                    <div className="flex justify-center">
                        <ButtonGroup buttons={githubButton} />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <SectionWrapper
            id="projects"
            title={title}
            description={description}
            data-tour="projects-section"
        >
            <div data-tour="featured-project" className="mb-12 lg:mb-24">
                {!isMobile && featured && (
                    <ProjectItem {...featured} isMobile={isMobile} />
                )}
            </div>
            <div data-tour="project-grid">
                <div
                    className={createResponsiveSpacing("projectGrid", isMobile)}
                >
                    {/* Project list */}
                    {isMobile
                        ? allProjects.map((project, index) => (
                              <ProjectItem
                                  key={index}
                                  {...project}
                                  isMobile={isMobile}
                              />
                          ))
                        : items.map((project, index) => (
                              <ProjectItem
                                  key={index}
                                  {...project}
                                  reverse={index % 2 === 0}
                                  isMobile={isMobile}
                              />
                          ))}
                </div>
            </div>
            {renderViewAllLink()}
        </SectionWrapper>
    );
}
