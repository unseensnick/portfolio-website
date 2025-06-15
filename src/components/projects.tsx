"use client";

import { ButtonGroup } from "@/components/shared/button-group";
import { ResponsiveCard } from "@/components/shared/responsive-card";
import { ResponsiveImage } from "@/components/shared/responsive-image";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { TechBadgeGroup } from "@/components/tech-badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatExternalUrl } from "@/lib/url-utils";
import { cn } from "@/lib/utils";
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
}

/**
 * Mobile project card with stacked image and content
 */
function MobileProjectItem({
    title,
    description,
    projectUrl,
    codeUrl,
    technologies,
    image,
}: ProjectItemProps) {
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
            <div>
                <ResponsiveImage
                    src={image}
                    alt={title}
                    aspectRatio="landscape"
                />
            </div>

            <div className="p-6 space-y-4">
                <div className="space-y-3">
                    <h3 className="text-xl font-bold text-foreground">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {description}
                    </p>

                    {technologies && technologies.length > 0 && (
                        <TechBadgeGroup technologies={technologies} size="sm" />
                    )}
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
 * Desktop project card with side-by-side layout
 */
function DesktopProjectItem({
    title,
    description,
    projectUrl,
    codeUrl,
    technologies,
    image,
    reverse = false,
}: ProjectItemProps & { reverse?: boolean }) {
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
                    <ResponsiveImage
                        src={image}
                        alt={title}
                        aspectRatio="landscape"
                    />
                </div>

                <div
                    className={cn(
                        "space-y-6",
                        reverse && "lg:col-start-1 lg:row-start-1"
                    )}
                >
                    <div className="space-y-4">
                        <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                            {title}
                        </h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {description}
                        </p>

                        {technologies && technologies.length > 0 && (
                            <TechBadgeGroup
                                technologies={technologies}
                                size="md"
                            />
                        )}
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
 * Projects section with featured project and project grid
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

    // On mobile, show all projects in a single list
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
            <div className={cn("text-center", isMobile ? "" : "mt-24")}>
                <div className="space-y-4 sm:space-y-6">
                    <p
                        className={cn(
                            "text-muted-foreground",
                            isMobile ? "text-sm px-4" : "text-lg"
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
                {!isMobile && featured && <DesktopProjectItem {...featured} />}
            </div>
            <div data-tour="project-grid">
                <div
                    className={cn(isMobile ? "space-y-6 mb-12" : "space-y-32")}
                >
                    {/* Project list */}
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
            </div>
            {renderViewAllLink()}
        </SectionWrapper>
    );
}
