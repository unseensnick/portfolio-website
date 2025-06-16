import { demoData } from "@/lib/demo-data";
import { logDemoModeStatus, shouldUseDemoMode } from "@/lib/demo-utils";
import {
    safelyExtractImageUrl,
    safelyExtractNames,
    safelyExtractParagraphs,
    safelyProcessNavLinks,
    safelyProcessTechnologies,
    safeString
} from "@/lib/payload-safe-helpers";
import { logger } from "@/lib/utils";
import type { PortfolioData } from "@/types/portfolio";

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
        greeting: "Hello, I'm",
        title: "A Developer",
        description: "Please add content through the PayloadCMS admin panel",
        githubUrl: "https://github.com",
        image: "/placeholder-image.svg",
        ctaText: "View GitHub",
        ctaLink: "https://github.com",
        secondaryCtaText: "View Projects",
        secondaryCtaLink: "#projects",
    },
    about: {
        title: "About Me",
        paragraphs: ["Please add content through the PayloadCMS admin panel"],
        technologies: ["JavaScript", "TypeScript", "React", "Next.js"],
        interests: ["Web Development", "UI/UX Design"],
        image: "/placeholder-image.svg",
        technologiesHeading: "Technologies",
        interestsHeading: "Interests",
    },
    projects: {
        title: "My Projects",
        featured: {
            title: "Featured Project",
            description: "Please add content through the PayloadCMS admin panel",
            projectUrl: "#",
            codeUrl: "#",
            image: "/placeholder-image.svg",
            technologies: [
                { name: "React" },
                { name: "TypeScript" },
                { name: "Tailwind CSS" },
            ],
        },
        items: [
            {
                title: "Sample Project",
                description: "Please add content through the PayloadCMS admin panel",
                projectUrl: "#",
                codeUrl: "#",
                image: "/placeholder-image.svg",
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
            greeting: safeString(data.hero.greeting, "Hello, I'm"),
            title: safeString(data.hero.title, "A Developer"),
            description: safeString(data.hero.description, "Welcome to my portfolio"),
            githubUrl: safeString(data.hero.githubUrl, "https://github.com"),
            image: safelyExtractImageUrl(data.hero.image) || "/placeholder-image.svg",
            ctaText: safeString(data.hero.ctaText, "View GitHub"),
            ctaLink: safeString(data.hero.ctaLink, "https://github.com"),
            secondaryCtaText: safeString(data.hero.secondaryCtaText, "View Projects"),
            secondaryCtaLink: safeString(data.hero.secondaryCtaLink, "#projects"),
        },
        about: {
            title: safeString(data.about.title, "About Me"),
            paragraphs: safelyExtractParagraphs(data.about.paragraphs),
            technologies: safelyExtractNames(data.about.technologies),
            interests: safelyExtractNames(data.about.interests),
            image: safelyExtractImageUrl(data.about.image) || "/placeholder-image.svg",
            technologiesHeading: safeString(data.about.technologiesHeading, "Technologies"),
            interestsHeading: safeString(data.about.interestsHeading, "Interests"),
        },
        projects: {
            title: safeString(data.projects.title, "My Projects"),
            featured: (() => {
                const featured = data.projects.featured;
                if (!featured) {
                    return {
                        title: "Featured Project",
                        description: "A showcase of my best work",
                        projectUrl: undefined,
                        codeUrl: undefined,
                        image: "/placeholder-image.svg",
                        technologies: [],
                    };
                }

                return {
                    title: safeString(featured.title, "Featured Project"),
                    description: safeString(featured.description, "A showcase of my best work"),
                    projectUrl: safeString(featured.projectUrl),
                    codeUrl: safeString(featured.codeUrl),
                    technologies: safelyProcessTechnologies(featured.technologies),
                    image: safelyExtractImageUrl(featured.image) || "/placeholder-image.svg",
                };
            })(),
            items: (data.projects.items || []).map((project: any) => ({
                title: safeString(project.title, "Project"),
                description: safeString(project.description, "Project description"),
                projectUrl: safeString(project.projectUrl),
                codeUrl: safeString(project.codeUrl),
                technologies: safelyProcessTechnologies(project.technologies),
                image: safelyExtractImageUrl(project.image) || "/placeholder-image.svg",
            })),
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
    // Check if demo mode should be used
    const useDemoMode = shouldUseDemoMode(searchParams);
    
    if (useDemoMode) {
        logDemoModeStatus(true, searchParams?.demo === "true" ? "url" : "env");
        return demoData;
    }
    const requestId = Math.random().toString(36).substr(2, 9);
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