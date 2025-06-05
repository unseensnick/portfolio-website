import type { PortfolioData } from "@/types/portfolio";

/**
 * Fallback portfolio data used when PayloadCMS data is unavailable
 * This provides a complete set of placeholder content for all website sections
 * to ensure the site can still render properly even without a CMS connection
 */
const fallbackData = {
    nav: {
        logo: "Portfolio",
        subtitle: "Developer",
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
            description:
                "Please add content through the PayloadCMS admin panel",
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
                description:
                    "Please add content through the PayloadCMS admin panel",
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
        copyright: "© 2025 All Rights Reserved",
    },
};

/**
 * Adapts the raw portfolio data from PayloadCMS to the format expected by components
 *
 * Features:
 * - Validates that all required sections exist in the data
 * - Falls back to defaults for missing properties
 * - Handles different image formats (direct paths or PayloadCMS media objects)
 * - Transforms nested data structures into the expected component props format
 * - Ensures type compatibility with component interfaces
 *
 * @param data - Raw data from PayloadCMS API response
 * @returns Properly formatted portfolio data ready for component consumption
 */
export function adaptPortfolioData(data: any) {
    // If data is not available or missing required sections, return fallback data
    if (
        !data ||
        !data.nav ||
        !data.hero ||
        !data.projects ||
        !data.about ||
        !data.contact ||
        !data.footer
    ) {
        return fallbackData;
    }

    return {
        nav: {
            logo: data.nav.logo,
            subtitle: data.nav.subtitle,
            links: data.nav.links,
        },
        hero: {
            greeting: data.hero.greeting,
            title: data.hero.title,
            description: data.hero.description,
            githubUrl: data.hero.githubUrl,
            image: data.hero.image?.url || data.hero.image, // Handle both PayloadCMS media and direct paths
            ctaText: "View GitHub",
            ctaLink: data.hero.githubUrl,
            secondaryCtaText: "View Projects",
            secondaryCtaLink: "#projects",
        },
        about: {
            title: data.about.title,
            paragraphs: data.about.paragraphs?.map((p: any) => p.text) || [
                data.about.bio,
            ],
            technologies:
                data.about.technologies?.map((t: any) => t.name) || [],
            interests: data.about.interests?.map((i: any) => i.name) || [],
            image: data.about.image?.url || data.about.image,
            technologiesHeading: data.about.technologiesHeading,
            interestsHeading: data.about.interestsHeading,
        },
        projects: {
            title: data.projects.title,
            featured: {
                title: data.projects.featured?.title || "Featured Project",
                description:
                    data.projects.featured?.description ||
                    "A showcase of my best work",
                projectUrl: data.projects.featured?.projectUrl,
                codeUrl: data.projects.featured?.codeUrl,
                image:
                    data.projects.featured?.image?.url ||
                    data.projects.featured?.image,
                technologies: data.projects.featured?.technologies || [],
            },
            items: (data.projects.items || []).map((project: any) => ({
                title: project.title,
                description: project.description,
                projectUrl: project.projectUrl,
                codeUrl: project.codeUrl,
                image: project.image?.url || project.image,
                technologies: project.technologies || [],
            })),
            description: data.projects.description,
            viewMoreText:
                data.projects.viewMoreText || "Want to see more of my work?",
            viewAllLink: data.projects.viewAllLink,
        },
        contact: {
            title: data.contact.title,
            description: data.contact.description,
            email: data.contact.email,
            github: data.contact.github,
            emailSubtitle: data.contact.emailSubtitle,
            githubSubtitle: data.contact.githubSubtitle,
            ctaTitle: data.contact.ctaTitle,
            ctaDescription: data.contact.ctaDescription,
        },
        footer: {
            copyright: data.footer.copyright,
        },
    };
}

/**
 * Fetches portfolio data from PayloadCMS API with improved draft handling
 *
 * Features:
 * - Connects to PayloadCMS API using environment variables or defaults
 * - Supports draft content for live preview functionality
 * - Includes proper caching and revalidation strategy for draft vs published
 * - Handles API errors gracefully with fallback data
 * - Processes API response to match component data requirements
 * - Logs helpful error messages when API issues occur
 * - Automatic fallback from draft to published content on failure
 *
 * @param draft - Whether to fetch draft content (for live preview)
 * @returns Promise resolving to formatted portfolio data
 */
export async function getPortfolioData(
    draft: boolean = false
): Promise<PortfolioData> {
    try {
        // Use production URL in production, local dev URL in development
        const baseUrl =
            process.env.NEXT_PUBLIC_SITE_URL || process.env.LOCAL_DEV_URL;

        // Build API URL with proper draft handling
        const params = new URLSearchParams({
            limit: "1",
            depth: "2",
        });

        if (draft) {
            params.append("draft", "true");
        }

        const apiUrl = `${baseUrl}/api/portfolio?${params.toString()}`;

        console.log(`[Portfolio API] Fetching from: ${apiUrl}`);
        console.log(`[Portfolio API] Draft mode: ${draft}`);

        // Prepare headers
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        // Fetch the portfolio data from PayloadCMS
        const response = await fetch(apiUrl, {
            method: "GET",
            headers,
            // Different caching strategy for draft vs published
            cache: draft ? "no-store" : "force-cache",
            next: draft ? { revalidate: 0 } : { revalidate: 60 },
        });

        if (!response.ok) {
            console.error(
                `[Portfolio API] HTTP Error: ${response.status} ${response.statusText}`
            );

            // If draft request fails and we're not already trying published, try published
            if (draft) {
                console.log(
                    "[Portfolio API] Draft request failed, trying published content..."
                );
                return getPortfolioData(false);
            }

            return fallbackData;
        }

        const result = await response.json();
        console.log(`[Portfolio API] Response:`, {
            totalDocs: result.totalDocs,
            hasNextPage: result.hasNextPage,
            docs: result.docs?.length || 0,
            firstDocId: result.docs?.[0]?.id || "none",
            firstDocStatus: result.docs?.[0]?._status || "unknown",
        });

        // Get the first portfolio document
        const portfolioDoc = result.docs?.[0];

        if (!portfolioDoc) {
            console.error(
                `[Portfolio API] No portfolio documents found. Total docs: ${result.totalDocs}`
            );

            // If we're not in draft mode and no published docs found, try draft mode
            if (!draft && result.totalDocs === 0) {
                console.log(
                    `[Portfolio API] No published docs, trying draft mode...`
                );
                return getPortfolioData(true);
            }

            return fallbackData;
        }

        console.log(`[Portfolio API] Using document:`, {
            id: portfolioDoc.id,
            title: portfolioDoc.title,
            status: portfolioDoc._status || "published",
        });

        // Adapt the data to match component props
        return adaptPortfolioData(portfolioDoc);
    } catch (error) {
        console.error("[Portfolio API] Error fetching portfolio data:", error);

        // If draft request fails, try published content
        if (draft) {
            console.log(
                "[Portfolio API] Draft request error, falling back to published..."
            );
            return getPortfolioData(false);
        }

        return fallbackData;
    }
}
