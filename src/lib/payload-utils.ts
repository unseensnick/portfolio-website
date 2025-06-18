import { logDemoModeStatus, shouldUseDemoMode } from "@/lib/demo-utils";
import { logger } from "@/lib/utils";
import type { PortfolioData } from "@/types/portfolio";
import {
    safelyExtractImageUrl,
    safelyExtractNames,
    safelyExtractParagraphs,
    safelyExtractProjectDescriptions,
    safelyProcessNavLinks,
    safelyProcessTechnologies,
    safeString
} from "./payload-safe-helpers";

/**
 * Default data used when PayloadCMS is unavailable
 */
const fallbackData = {
    nav: {
        logo: "Portfolio",
        subtitle: "Developer",
        logoSplitAt: undefined,
        links: [
            { label: "Home", href: "#home" },
            { label: "Projects", href: "#projects" },
            { label: "About", href: "#about" },
            { label: "Contact", href: "#contact" },
        ],
    },
    hero: {
        greeting: "Hello There! I'm",
        title: "UnseenSnick",
        description: "I build modern web apps with clean, responsive design. Working mostly with JavaScript and Next.js, I adapt quickly to what each project needs.",
        githubUrl: "https://github.com",
        image: "/placeholder-image.svg",
        imagePosition: "center" as const,
        ctaText: "View GitHub",
        ctaLink: "https://github.com",
        secondaryCtaText: "View Projects",
        secondaryCtaLink: "#projects",
    },
    about: {
        title: "About",
        paragraphs: ["Please add content through the PayloadCMS admin panel"],
        technologies: ["React", "TypeScript", "Next.js"],
        interests: ["Coding", "Design", "Technology"],
        image: "/placeholder-image.svg",
        imagePosition: "center" as const,
        technologiesHeading: "Technologies & Tools",
        interestsHeading: "When I'm Not Coding",
    },
    projects: {
        title: "My Projects",
        featured: {
            title: "Featured Project",
            description: [{ text: "Please add content through the PayloadCMS admin panel" }],
            projectUrl: "#",
            codeUrl: "#",
            media: {
                image: {
                    url: "/placeholder-image.svg",
                    alt: "Featured project placeholder"
                },
                imagePosition: "center" as const
            },
            technologies: [
                { name: "React" },
                { name: "TypeScript" },
                { name: "Tailwind CSS" },
            ],
        },
        items: [
            {
                title: "Sample Project",
                description: [{ text: "Please add content through the PayloadCMS admin panel" }],
                projectUrl: "#",
                codeUrl: "#",
                media: {
                    image: {
                        url: "/placeholder-image.svg",
                        alt: "Sample project placeholder"
                    },
                    imagePosition: "center" as const
                },
                technologies: [{ name: "Next.js" }, { name: "JavaScript" }],
            },
        ],
        description: "Here are some of my recent projects",
        viewMoreText: "Want to see more of my work?",
        viewAllLink: "#",
    },
    contact: {
        title: "Get In Touch",
        description: "Please add content through the PayloadCMS admin panel",
        email: "example@example.com",
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

function safeNumber(value: any, min?: number, max?: number): number | undefined {
    if (value === null || value === undefined || value === "") return undefined;
    
    const num = typeof value === "number" ? value : Number(value);
    if (isNaN(num)) return undefined;
    
    if (min !== undefined && num < min) return undefined;
    if (max !== undefined && num > max) return undefined;
    
    return num;
}



/**
 * Transforms raw PayloadCMS data into the format expected by components
 */
export function adaptPortfolioData(data: any) {
    // Validate required sections exist before processing
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

    return {
        nav: {
            logo: safeString(data.nav.logo, "Portfolio"),
            subtitle: safeString(data.nav.subtitle, "Developer"),
            logoSplitAt: safeNumber(data.nav.logoSplitAt, 0, 50),
            links: safelyProcessNavLinks(data.nav.links),
        },
        hero: {
            greeting: safeString(data.hero.greeting, "Hello There! I'm"),
            title: safeString(data.hero.title, "UnseenSnick"),
            description: safeString(data.hero.description, "I build modern web apps with clean, responsive design. Working mostly with JavaScript and Next.js, I adapt quickly to what each project needs."),
            githubUrl: safeString(data.hero.githubUrl, "https://github.com"),
            image: safelyExtractImageUrl(data.hero.image) || "/placeholder-image.svg",
            imagePosition: (data.hero.imagePosition || "center") as "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right",
            ctaText: "View GitHub",
            ctaLink: safeString(data.hero.githubUrl, "https://github.com"),
            secondaryCtaText: "View Projects",
            secondaryCtaLink: "#projects",
        },
        about: {
            title: safeString(data.about.title, "About"),
            paragraphs: safelyExtractParagraphs(data.about.paragraphs) || ["Tell us about yourself..."],
            technologies: safelyExtractNames(data.about.technologies) || [],
            interests: safelyExtractNames(data.about.interests) || [],
            image: safelyExtractImageUrl(data.about.image) || "/placeholder-image.svg",
            imagePosition: (data.about.imagePosition || "center") as "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right",
            technologiesHeading: safeString(data.about.technologiesHeading, "Technologies & Tools"),
            interestsHeading: safeString(data.about.interestsHeading, "When I'm Not Coding"),
        },
        projects: {
            title: safeString(data.projects.title, "My Projects"),
            featured: (() => {
                const featured = data.projects.featured;
                if (!featured) {
                    return {
                        title: "Featured Project",
                        description: [{ text: "A showcase of my best work" }],
                        projectUrl: undefined,
                        codeUrl: undefined,
                        media: {
                            image: {
                                url: "/placeholder-image.svg",
                                alt: "Featured project placeholder"
                            },
                            imagePosition: "center" as const
                        },
                        technologies: [],
                    };
                }

                // Process media structure
                const processedMedia = featured.media ? {
                    image: featured.media.image ? {
                        url: safelyExtractImageUrl(featured.media.image),
                        alt: featured.title || "Project image"
                    } : undefined,
                    imagePosition: (featured.media.imagePosition || "center") as "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right",
                    video: featured.media.video ? {
                        src: safeString(featured.media.video.src),
                        file: featured.media.video.file ? {
                            url: safelyExtractImageUrl(featured.media.video.file)
                        } : undefined,
                        title: safeString(featured.media.video.title),
                        description: safeString(featured.media.video.description)
                    } : undefined
                } : {
                    image: {
                        url: "/placeholder-image.svg",
                        alt: featured.title || "Project image"
                    },
                    imagePosition: "center" as const
                };

                return {
                    title: safeString(featured.title, "Featured Project"),
                    description: safelyExtractProjectDescriptions(featured.description) || [{ text: "A showcase of my best work" }],
                    projectUrl: safeString(featured.projectUrl),
                    codeUrl: safeString(featured.codeUrl),
                    media: processedMedia,
                    technologies: safelyProcessTechnologies(featured.technologies),
                };
            })(),
            items: (data.projects.items || []).map((project: any) => {
                // Process media structure
                const processedMedia = project.media ? {
                    image: project.media.image ? {
                        url: safelyExtractImageUrl(project.media.image),
                        alt: project.title || "Project image"
                    } : undefined,
                    imagePosition: (project.media.imagePosition || "center") as "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right",
                    video: project.media.video ? {
                        src: safeString(project.media.video.src),
                        file: project.media.video.file ? {
                            url: safelyExtractImageUrl(project.media.video.file)
                        } : undefined,
                        title: safeString(project.media.video.title),
                        description: safeString(project.media.video.description)
                    } : undefined
                } : {
                    image: {
                        url: "/placeholder-image.svg",
                        alt: project.title || "Project image"
                    },
                    imagePosition: "center" as const
                };

                return {
                    title: safeString(project.title, "Project"),
                    description: safelyExtractProjectDescriptions(project.description) || [{ text: "Project description" }],
                    projectUrl: safeString(project.projectUrl),
                    codeUrl: safeString(project.codeUrl),
                    media: processedMedia,
                    technologies: safelyProcessTechnologies(project.technologies),
                };
            }),
            description: safeString(data.projects.description, "Here are some of my recent projects"),
            viewMoreText: safeString(data.projects.viewMoreText, "Want to see more of my work?"),
            viewAllLink: safeString(data.projects.viewAllLink),
        },
        contact: {
            title: safeString(data.contact.title, "Get In Touch"),
            description: safeString(data.contact.description, "Feel free to reach out for collaborations or just a friendly hello"),
            email: safeString(data.contact.email, "example@example.com"),
            github: safeString(data.contact.github, "https://github.com"),
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

/**
 * Fetches portfolio data from PayloadCMS with error handling and fallbacks
 * Supports demo mode for showcasing the portfolio
 */
export async function getPortfolioData(
    draft: boolean = false,
    searchParams?: { [key: string]: string | string[] | undefined }
): Promise<PortfolioData> {
    const requestId = Math.random().toString(36).substr(2, 9);
    
    // Check if demo mode should be used - now uses real data from database
    const useDemoMode = shouldUseDemoMode(searchParams);
    if (useDemoMode) {
        logDemoModeStatus(true, searchParams?.demo === "true" ? "url" : "env");
        // Demo mode now uses real data from database instead of hardcoded data
    }
    const apiLogger = logger.createApiLogger("Portfolio", requestId);
    
    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3000";

        const params = new URLSearchParams({
            limit: "1",
            depth: "2",
        });

        if (draft) {
            params.append("draft", "true");
        }

        const apiUrl = `${baseUrl}/api/portfolio?${params.toString()}`;



        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers,
                signal: controller.signal,
                cache: draft ? "no-store" : "force-cache",
                next: draft ? { revalidate: 0 } : { revalidate: 60 },
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                apiLogger.error(`HTTP Error: ${response.status} ${response.statusText}`);

                try {
                    const errorText = await response.text();
                    apiLogger.error("Error body:", errorText);
                } catch {
                    apiLogger.error("Could not read error body");
                }

                // Try published content if draft request fails
                if (draft) {
                    return getPortfolioData(false);
                }

                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();


            const portfolioDoc = result.docs?.[0];

            if (!portfolioDoc) {
                apiLogger.error(`No portfolio documents found. Total docs: ${result.totalDocs}`);

                // Try draft mode if no published docs found
                if (!draft && result.totalDocs === 0) {
                    return getPortfolioData(true);
                }

                throw new Error("No portfolio documents found");
            }



            return adaptPortfolioData(portfolioDoc);

        } catch (fetchError) {
            clearTimeout(timeoutId);
            throw fetchError;
        }

    } catch (error) {
        apiLogger.error("Error fetching portfolio data:", error);

        // Fallback from draft to published on network errors
        if (draft && (error instanceof Error && (
            error.name === 'AbortError' || 
            error.message.includes('fetch') ||
            error.message.includes('network') ||
            error.message.includes('timeout')
        ))) {
            return getPortfolioData(false);
        }

        apiLogger.warn("Using fallback data due to error:", error);
        logDemoModeStatus(false, "disabled");
        return fallbackData;
    }
}