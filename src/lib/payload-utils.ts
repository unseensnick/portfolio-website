import { logDemoModeStatus, shouldUseDemoMode } from "@/lib/demo-utils";
import { logger } from "@/lib/utils";
import type { PortfolioData } from "@/types/portfolio";
import {
    safelyExtractImageUrl,
    safelyExtractNames,
    safelyExtractUrl,
    safelyProcessNavLinks,
    safelyProcessTechnologies,
    safeString
} from "./payload-safe-helpers";

// PayloadCMS Local API imports removed due to typing issues
// Keeping fetch-based approach but with improved PayloadCMS 3.0 draft handling

// Session-based logging cache to prevent spam
const logCache = new Set<string>();

/**
 * Default data used when PayloadCMS is unavailable
 */
const fallbackData = {
    nav: {
        logo: "Portfolio",
        subtitle: "Developer",
        logoSplitAt: undefined,
        links: [
            { label: "Home", href: "#home", icon: "home" },
            { label: "Projects", href: "#projects", icon: "FolderOpen" },
            { label: "About", href: "#about", icon: "User" },
            { label: "Contact", href: "#contact", icon: "Mail" },
        ],
    },
    hero: {
        greeting: "Hello There! I'm",
        title: "UnseenSnick",
        description: null,
        githubUrl: "https://github.com",
        image: "/placeholder-image.svg",
        imagePosition: "center" as const,
        aspectRatio: "landscape" as const,
        ctaText: "View GitHub",
        ctaLink: "https://github.com",
        secondaryCtaText: "View Projects",
        secondaryCtaLink: "#projects",
    },
    about: {
        title: "About",
        content: null,
        technologies: ["React", "TypeScript", "Next.js", "Node.js", "Tailwind CSS", "PostgreSQL"],
        interests: ["Open Source", "Web Development", "UI/UX Design", "Problem Solving", "Continuous Learning"],
        image: "/placeholder-image.svg",
        imagePosition: "center" as const,
        aspectRatio: "portrait" as const,
        technologiesHeading: "Technologies & Tools",
        interestsHeading: "When I'm Not Coding",
    },
    projects: {
        title: "My Projects",
        description: "Here are some of my recent projects showcasing my skills and creativity",
        items: [
            {
                title: "Example Project 1",
                content: null,
                projectUrl: undefined,
                codeUrl: undefined, 
                media: {
                    image: {
                        url: "/placeholder-image.svg",
                        alt: "Example project 1"
                    },
                    imagePosition: "center" as const,
                    aspectRatio: "landscape" as const
                },
                technologies: [
                    { name: "React" },
                    { name: "CSS" }
                ],
            },
            {
                title: "Example Project 2", 
                content: null,
                projectUrl: undefined,
                codeUrl: undefined,
                media: {
                    image: {
                        url: "/placeholder-image.svg", 
                        alt: "Example project 2"
                    },
                    imagePosition: "center" as const,
                    aspectRatio: "landscape" as const
                },
                technologies: [
                    { name: "Node.js" },
                    { name: "MongoDB" }
                ],
            }
        ],
        viewMoreText: "Want to see more of my work?",
        viewAllLink: "",
    },
    contact: {
        title: "Get In Touch",
        description: "Feel free to reach out for collaborations or just a friendly hello",
        email: "hello@example.com",
        github: "https://github.com",
        emailSubtitle: "Email",
        githubSubtitle: "GitHub",
        ctaTitle: "Let's work together",
        ctaDescription: "I'm open to new opportunities and collaborations",
    },
    footer: {
        copyright: "© 2024 Portfolio. All rights reserved.",
    },
};

/**
 * Enhanced media processing with improved placeholder fallbacks
 * Ensures projects always have media, using placeholder when none provided
 */
function processMediaItem(mediaItem: any, title: string = "Project"): any {
    if (!mediaItem) {
        return {
            image: {
                url: "/placeholder-image.svg",
                alt: `${title} placeholder image`
            },
            imagePosition: "center" as const,
            aspectRatio: "landscape" as const
        };
    }

    const imageUrl = safelyExtractImageUrl(mediaItem.image);
    const hasValidImage = imageUrl && imageUrl !== "";

    return {
        image: {
            url: hasValidImage ? imageUrl : "/placeholder-image.svg",
            alt: `${title} ${hasValidImage ? "" : "placeholder "}image`
        },
        imagePosition: (mediaItem.imagePosition || "center") as "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right",
        aspectRatio: safeString(mediaItem.aspectRatio, "landscape"),
        imageZoom: typeof mediaItem.imageZoom === "number" ? mediaItem.imageZoom : undefined,
        imageFinePosition: (mediaItem.imageFinePosition?.x !== undefined || mediaItem.imageFinePosition?.y !== undefined) 
            ? { x: mediaItem.imageFinePosition?.x, y: mediaItem.imageFinePosition?.y } 
            : undefined,
        video: mediaItem.video ? {
            src: safeString(mediaItem.video.src),
            file: mediaItem.video.file ? {
                url: safelyExtractImageUrl(mediaItem.video.file)
            } : undefined,
            title: safeString(mediaItem.video.title),
            description: safeString(mediaItem.video.description)
        } : undefined
    };
}

/**
 * Transforms raw PayloadCMS data into the format expected by components
 */
export function adaptPortfolioData(data: any) {
    if (
        !data ||
        !data.nav ||
        !data.hero ||
        !data.projects ||
        !data.about ||
        !data.contact ||
        !data.footer
    ) {
        const portfolioLogger = logger.createFeatureLogger("Portfolio");
        portfolioLogger.warn("Using fallback data due to missing sections:", {
            hasData: !!data,
            hasNav: !!data?.nav,
            hasHero: !!data?.hero,
            hasProjects: !!data?.projects,
            hasAbout: !!data?.about,
            hasContact: !!data?.contact,
            hasFooter: !!data?.footer,
        });
        return fallbackData;
    }

    const portfolioLogger = logger.createFeatureLogger("Portfolio");
    
    // Only log once per session to avoid spam during development
    const hasRealProjects = data.projects?.items?.some((item: any) => 
        item.media && Array.isArray(item.media) && item.media.length > 0
    );
    
    if (!hasRealProjects && process.env.NODE_ENV === "development") {
        const placeholderKey = "portfolio-placeholder";
        if (!logCache.has(placeholderKey)) {
            portfolioLogger.log("Using placeholder data (no media found)");
            logCache.add(placeholderKey);
        }
    }

    return {
        nav: {
            logo: safeString(data.nav.logo, "Portfolio"),
            subtitle: safeString(data.nav.subtitle, "Developer"),
            logoSplitAt: typeof data.nav.logoSplitAt === "number" ? data.nav.logoSplitAt : undefined,
            links: safelyProcessNavLinks(data.nav.navigationLinks),
        },
        hero: {
            greeting: safeString(data.hero.greeting, "Hello There! I'm"),
            title: safeString(data.hero.heroTitle, "UnseenSnick"),
            description: data.hero.heroDescription || null,
            githubUrl: safelyExtractUrl(data.hero.githubUrl, "https://github.com"),
            image: safelyExtractImageUrl(data.hero.heroMedia?.image) || "/placeholder-image.svg",
            imagePosition: (data.hero.heroMedia?.imagePosition || "center") as "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right",
            aspectRatio: safeString(data.hero.heroMedia?.aspectRatio, "landscape"),
            imageZoom: typeof data.hero.heroMedia?.imageZoom === "number" ? data.hero.heroMedia.imageZoom : undefined,
            imageFinePosition: (data.hero.heroMedia?.x !== undefined || data.hero.heroMedia?.y !== undefined) 
                ? { x: data.hero.heroMedia.x, y: data.hero.heroMedia.y } 
                : undefined,
            ctaText: "View GitHub",
            ctaLink: safelyExtractUrl(data.hero.githubUrl, "https://github.com"),
            secondaryCtaText: "View Projects",
            secondaryCtaLink: "#projects",
        },
        about: {
            title: safeString(data.about.aboutTitle, "About"),
            content: data.about.content || null,
            technologies: safelyExtractNames(data.about.technologies) || [],
            interests: safelyExtractNames(data.about.interests) || [],
            image: safelyExtractImageUrl(data.about.aboutMedia?.image) || "/placeholder-image.svg",
            imagePosition: (data.about.aboutMedia?.imagePosition || "center") as "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right",
            aspectRatio: safeString(data.about.aboutMedia?.aspectRatio, "portrait"),
            imageZoom: typeof data.about.aboutMedia?.imageZoom === "number" ? data.about.aboutMedia.imageZoom : undefined,
            imageFinePosition: (data.about.aboutMedia?.x !== undefined || data.about.aboutMedia?.y !== undefined) 
                ? { x: data.about.aboutMedia.x, y: data.about.aboutMedia.y } 
                : undefined,
            technologiesHeading: safeString(data.about.technologiesHeading, "Technologies & Tools"),
            interestsHeading: safeString(data.about.interestsHeading, "When I'm Not Coding"),
        },
        projects: {
            title: safeString(data.projects.projectsTitle, "My Projects"),
            items: (() => {
                const items = data.projects.items || [];
                if (items.length === 0) {
                    return fallbackData.projects.items;
                }
                
                const processedItems = items.map((project: any) => {
                    let processedMedia;
                    
                    if (Array.isArray(project.media)) {
                        if (project.media.length === 0) {
                            processedMedia = processMediaItem(null, project.itemTitle);
                        } else {
                            processedMedia = project.media.map((item: any) => processMediaItem(item, project.itemTitle));
                        }
                    } else {
                        processedMedia = processMediaItem(project.media, project.itemTitle);
                    }
                    
                    return {
                        title: safeString(project.itemTitle, "Project"),
                        content: project.content || null,
                        projectUrl: safelyExtractUrl(project.projectUrl),
                        codeUrl: safelyExtractUrl(project.codeUrl),
                        media: processedMedia,
                        technologies: safelyProcessTechnologies(project.technologies),
                    };
                });
                
                return processedItems;
            })(),
            description: safeString(data.projects.projectsDescription, "Here are some of my recent projects"),
            viewMoreText: safeString(data.projects.viewMoreText, "Want to see more of my work?"),
            viewAllLink: safelyExtractUrl(data.projects.viewAllLink, ""),
        },
        contact: {
            title: safeString(data.contact.contactTitle, "Get In Touch"),
            description: safeString(data.contact.contactDescription, "Feel free to reach out for collaborations or just a friendly hello"),
            email: safelyExtractUrl(data.contact.email, "example@example.com"),
            github: safelyExtractUrl(data.contact.github, "https://github.com"),
            emailSubtitle: safeString(data.contact.emailSubtitle, "Email"),
            githubSubtitle: safeString(data.contact.githubSubtitle, "GitHub"),
            ctaTitle: safeString(data.contact.ctaTitle, "Let's work together"),
            ctaDescription: safeString(data.contact.ctaDescription, "I'm open to new opportunities and collaborations"),
        },
        footer: {
            copyright: safeString(data.footer.copyright, "© 2024 Portfolio. All rights reserved."),
        },
    };
}

// ===== API FUNCTIONS =====
export async function getPortfolioData(
    draft: boolean = false,
    searchParams?: { [key: string]: string | string[] | undefined }
): Promise<PortfolioData> {
    const requestId = Math.random().toString(36).substr(2, 9);
    
    const useDemoMode = shouldUseDemoMode(searchParams);
    if (useDemoMode) {
        logDemoModeStatus(true, searchParams?.demo === "true" ? "url" : "env");
    }
    const apiLogger = logger.createApiLogger("Portfolio", requestId);
    
    try {
        const baseUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3000";

        const params = new URLSearchParams({
            limit: "1",
            depth: "2",
        });

        if (draft) {
            params.append("draft", "true");
        }

        const apiUrl = `${baseUrl}/api/portfolio?${params.toString()}`;

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // Simplified caching - no manual cache management needed with PayloadCMS handling drafts
            cache: draft ? "no-store" : "force-cache",
            next: draft ? { revalidate: 0 } : { revalidate: 60 },
        });

        if (!response.ok) {
            apiLogger.error(`HTTP Error: ${response.status} ${response.statusText}`);
            
            if (draft) {
                return getPortfolioData(false);
            }

            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        const portfolioDoc = result.docs?.[0];

        if (!portfolioDoc) {
            // Only log once per session to avoid spam during development
            const sessionKey = "portfolio-empty";
            if (!logCache.has(sessionKey)) {
                apiLogger.warn(`No portfolio documents found. Total docs: ${result.totalDocs}`);
                logCache.add(sessionKey);
            }

            // If no documents found at all, return fallback data with helpful message
            if (result.totalDocs === 0) {
                const fallbackKey = "portfolio-empty-fallback";
                if (!logCache.has(fallbackKey)) {
                    apiLogger.warn("No portfolio documents exist in database - using fallback data. Create a portfolio document in the admin panel.");
                    logCache.add(fallbackKey);
                }
                return fallbackData;
            }

            // If documents exist but none returned, might be access control issue
            if (result.totalDocs > 0) {
                apiLogger.warn(`${result.totalDocs} documents exist but none accessible - check access control or document status`);
            }

            apiLogger.warn("No documents found, using fallback data");
            return fallbackData;
        }

        return adaptPortfolioData(portfolioDoc);

    } catch (error) {
        apiLogger.error("Error fetching portfolio data:", error);

        if (draft && error instanceof Error) {
            apiLogger.warn("Draft fetch failed, falling back to published content");
            return getPortfolioData(false);
        }

        apiLogger.warn("Using fallback data due to error:", error);
        logDemoModeStatus(false, "disabled");
        return fallbackData;
    }
}