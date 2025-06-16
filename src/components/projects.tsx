"use client";

import { ButtonGroup } from "@/components/shared/button-group";
import { ResponsiveCard } from "@/components/shared/responsive-card";
import { ResponsiveMedia } from "@/components/shared/responsive-media";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { TechBadgeGroup } from "@/components/tech-badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatExternalUrl } from "@/lib/url-utils";
import { cn, createResponsiveSpacing, createResponsiveText } from "@/lib/utils";
import { ExternalLink, Github } from "lucide-react";

interface Technology {
    name: string;
}

interface ProjectItemProps {
    title: string;
    description: string;
    projectUrl?: string;
    codeUrl?: string;
    technologies?: Technology[];

    image?: string;
    videoSrc?: string;
    videoFile?: any;
    videoTitle?: string;
    videoDescription?: string;

    media?: {
        image?:
            | {
                  url?: string;
                  alt?: string;
              }
            | any;
        video?: {
            src?: string;
            file?:
                | {
                      url?: string;
                  }
                | any;
            title?: string;
            description?: string;
        };
    };
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
    image,
    videoSrc,
    videoFile,
    videoTitle,
    videoDescription,
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
        <ResponsiveMedia
            src={image}
            videoSrc={videoSrc}
            videoFile={videoFile}
            alt={title}
            aspectRatio="landscape"
            videoTitle={videoTitle}
            videoDescription={videoDescription}
            media={media}
        />
    );

    const renderContent = () => (
        <div className={createResponsiveSpacing("layout", isMobile)}>
            <div className={createResponsiveSpacing("content", isMobile)}>
                <h3
                    className={cn(
                        "font-bold text-foreground",
                        isMobile ? "text-xl" : "text-2xl lg:text-3xl"
                    )}
                >
                    {title}
                </h3>
                <p
                    className={cn(
                        "text-muted-foreground leading-relaxed",
                        createResponsiveText("body", isMobile)
                    )}
                >
                    {description}
                </p>

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
    description: string;
    projectUrl?: string;
    codeUrl?: string;
    technologies?: Technology[];

    // Legacy props for backward compatibility
    image?: string;
    videoSrc?: string;
    videoFile?: any;
    videoTitle?: string;
    videoDescription?: string;

    // New consolidated media structure
    media?: {
        image?:
            | {
                  url?: string;
                  alt?: string;
              }
            | any;
        video?: {
            src?: string;
            file?:
                | {
                      url?: string;
                  }
                | any;
            title?: string;
            description?: string;
        };
    };
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
        if (!viewAllLink) return null;

        return (
            <div className={cn("text-center", !isMobile && "mt-24")}>
                <div className="space-y-4 sm:space-y-6">
                    <p
                        className={cn(
                            "text-muted-foreground",
                            createResponsiveText("body", isMobile),
                            isMobile && "px-4"
                        )}
                    >
                        {viewMoreText}
                    </p>
                    <ButtonGroup
                        buttons={githubButton}
                        fullWidthMobile={isMobile}
                        className={cn(
                            isMobile ? "max-w-sm mx-auto" : "justify-center"
                        )}
                    />
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
            <div data-tour="featured-project">
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
