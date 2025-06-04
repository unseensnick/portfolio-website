"use client";

import { ButtonGroup } from "@/components/shared/button-group";
import { ResponsiveCard } from "@/components/shared/responsive-card";
import { ResponsiveImage } from "@/components/shared/responsive-image";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { TechBadgeGroup } from "@/components/ui/tech-badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatExternalUrl } from "@/lib/url-utils";
import { cn } from "@/lib/utils";
import { ExternalLink, Github } from "lucide-react";

/**
 * Represents a technology used in a project
 */
interface Technology {
    name: string;
}

/**
 * Props for ProjectItem components
 */
interface ProjectItemProps {
    title: string;
    description: string;
    projectUrl?: string;
    codeUrl?: string;
    technologies?: Technology[];
    image?: string;
}

/**
 * Mobile-optimized project card with stacked layout
 *
 * Displays project image at top, with title, description,
 * technologies, and action buttons below in a card format
 */
function MobileProjectItem({
    title,
    description,
    projectUrl,
    codeUrl,
    technologies,
    image,
}: ProjectItemProps) {
    // Create buttons array based on available URLs
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
 * Desktop-optimized project card with side-by-side layout
 *
 * Features:
 * - Two-column layout with image and content
 * - Alternating image position (left/right) based on 'reverse' prop
 * - Larger typography and spacing compared to mobile version
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
    // Create buttons array based on available URLs
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
                {/* Project image/thumbnail */}
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

                {/* Project details and action buttons */}
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

                        {/* Technology tags */}
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

/**
 * Project data structure for a single project
 */
interface ProjectItem {
    title: string;
    description: string;
    projectUrl?: string;
    codeUrl?: string;
    technologies?: Technology[];
    image?: string;
}

/**
 * Props for the Projects component
 * @property title - Section heading
 * @property featured - Optional featured project (displayed first/prominently)
 * @property items - Array of regular projects to display
 * @property viewAllLink - Optional link to view more projects (e.g., GitHub profile)
 * @property description - Section subheading/description
 * @property viewMoreText - Text shown above "View All" button
 */
interface ProjectsProps {
    title?: string;
    featured?: ProjectItem;
    items?: ProjectItem[];
    viewAllLink?: string;
    description?: string;
    viewMoreText?: string;
}

/**
 * Projects section showcasing portfolio projects
 *
 * Features:
 * - Different layouts for mobile and desktop views
 * - Special handling for featured project (desktop only)
 * - Technology tags for each project
 * - "View All" link to external portfolio
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

    /**
     * Renders the project cards with different layouts for mobile/desktop
     */
    const renderProjects = () => (
        <div className={cn(isMobile ? "space-y-6 mb-12" : "space-y-32")}>
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

    /**
     * Renders the "View All" section if a link is provided
     */
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
        <SectionWrapper id="projects" title={title} description={description}>
            {renderProjects()}
            {renderViewAllLink()}
        </SectionWrapper>
    );
}
