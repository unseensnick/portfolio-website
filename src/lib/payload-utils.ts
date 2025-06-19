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
        aspectRatio: "landscape" as const,
        ctaText: "View GitHub",
        ctaLink: "https://github.com",
        secondaryCtaText: "View Projects",
        secondaryCtaLink: "#projects",
    },
    about: {
        title: "About",
        paragraphs: ["Welcome to my portfolio! I'm a passionate developer who loves creating modern web applications.", "I specialize in JavaScript and React, always eager to learn new technologies and tackle interesting challenges.", "When I'm not coding, you'll find me exploring new tools, contributing to open source, or brainstorming the next big project."],
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
        featured: {
            title: "Featured Project",
            description: [
                { text: "This is a showcase of my best work, demonstrating modern web development practices and clean, responsive design." },
                { text: "Built with the latest technologies to deliver an exceptional user experience." }
            ],
            projectUrl: undefined,
            codeUrl: undefined,
            media: {
                image: {
                    url: "/placeholder-image.svg",
                    alt: "Featured project placeholder"
                },
                imagePosition: "center" as const,
                aspectRatio: "landscape" as const
            },
            technologies: [
                { name: "React" },
                { name: "TypeScript" },
                { name: "Next.js" }
            ],
        },
        items: [
            {
                title: "Example Project 1",
                description: [{ text: "A sample project showcasing modern development practices and responsive design." }],
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
                description: [{ text: "Another sample project demonstrating full-stack development capabilities." }],
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
    portfolioLogger.log("Processing projects data:", {
        hasProjects: !!data.projects,
        hasFeatured: !!data.projects?.featured,
        itemsCount: data.projects?.items?.length || 0,
        featuredMedia: data.projects?.featured?.media,
        firstItemMedia: data.projects?.items?.[0]?.media
    });

    return {
        nav: {
            logo: safeString(data.nav.logo, "Portfolio"),
            subtitle: safeString(data.nav.subtitle, "Developer"),
            logoSplitAt: typeof data.nav.logoSplitAt === "number" ? data.nav.logoSplitAt : undefined,
            links: safelyProcessNavLinks(data.nav.links),
        },
        hero: {
            greeting: safeString(data.hero.greeting, "Hello There! I'm"),
            title: safeString(data.hero.title, "UnseenSnick"),
            description: safeString(data.hero.description, "I build modern web apps with clean, responsive design. Working mostly with JavaScript and Next.js, I adapt quickly to what each project needs."),
            githubUrl: safeString(data.hero.githubUrl, "https://github.com"),
            image: safelyExtractImageUrl(data.hero.image) || "/placeholder-image.svg",
            imagePosition: (data.hero.imagePosition || "center") as "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right",
            aspectRatio: safeString(data.hero.aspectRatio, "landscape"),
            imageZoom: typeof data.hero.imageZoom === "number" ? data.hero.imageZoom : undefined,
            imageFinePosition: (data.hero.imageFinePosition?.x !== undefined || data.hero.imageFinePosition?.y !== undefined) 
                ? { x: data.hero.imageFinePosition?.x, y: data.hero.imageFinePosition?.y } 
                : undefined,
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
            aspectRatio: safeString(data.about.aspectRatio, "portrait"),
            imageZoom: typeof data.about.imageZoom === "number" ? data.about.imageZoom : undefined,
            imageFinePosition: (data.about.imageFinePosition?.x !== undefined || data.about.imageFinePosition?.y !== undefined) 
                ? { x: data.about.imageFinePosition?.x, y: data.about.imageFinePosition?.y } 
                : undefined,
            technologiesHeading: safeString(data.about.technologiesHeading, "Technologies & Tools"),
            interestsHeading: safeString(data.about.interestsHeading, "When I'm Not Coding"),
        },
        projects: {
            title: safeString(data.projects.title, "My Projects"),
            featured: (() => {
                const featured = data.projects.featured;
                if (!featured) {
                    portfolioLogger.log("No featured project found, using fallback");
                    return fallbackData.projects.featured;
                }

                let processedMedia;
                
                if (Array.isArray(featured.media)) {
                    if (featured.media.length === 0) {
                        processedMedia = processMediaItem(null, featured.title);
                        portfolioLogger.log(`Empty media array for featured project "${featured.title}", using placeholder`);
                    } else {
                        processedMedia = featured.media.map((item: any) => processMediaItem(item, featured.title));
                    }
                } else {
                    processedMedia = processMediaItem(featured.media, featured.title);
                }
                
                portfolioLogger.log("Processed featured media:", processedMedia);

                return {
                    title: safeString(featured.title, "Featured Project"),
                    description: safelyExtractProjectDescriptions(featured.description) || [{ text: "A showcase of my best work" }],
                    projectUrl: safeString(featured.projectUrl),
                    codeUrl: safeString(featured.codeUrl),
                    media: processedMedia,
                    technologies: safelyProcessTechnologies(featured.technologies),
                };
            })(),
            items: (() => {
                const items = data.projects.items || [];
                if (items.length === 0) {
                    portfolioLogger.log("No project items found, using fallback items");
                    return fallbackData.projects.items;
                }
                
                const processedItems = items.map((project: any) => {
                    let processedMedia;
                    
                    if (Array.isArray(project.media)) {
                        if (project.media.length === 0) {
                            processedMedia = processMediaItem(null, project.title);
                            portfolioLogger.log(`Empty media array for project "${project.title}", using placeholder`);
                        } else {
                            processedMedia = project.media.map((item: any) => processMediaItem(item, project.title));
                        }
                    } else {
                        processedMedia = processMediaItem(project.media, project.title);
                    }
                    
                    portfolioLogger.log(`Processed media for project "${project.title}":`, processedMedia);
                    
                    return {
                        title: safeString(project.title, "Project"),
                        description: safelyExtractProjectDescriptions(project.description) || [{ text: "Project description" }],
                        projectUrl: safeString(project.projectUrl),
                        codeUrl: safeString(project.codeUrl),
                        media: processedMedia,
                        technologies: safelyProcessTechnologies(project.technologies),
                    };
                });
                
                return processedItems;
            })(),
            description: safeString(data.projects.description, "Here are some of my recent projects"),
            viewMoreText: safeString(data.projects.viewMoreText, "Want to see more of my work?"),
            viewAllLink: safeString(data.projects.viewAllLink, ""),
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

                if (draft) {
                    return getPortfolioData(false);
                }

                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            const portfolioDoc = result.docs?.[0];

            if (!portfolioDoc) {
                apiLogger.error(`No portfolio documents found. Total docs: ${result.totalDocs}`);

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