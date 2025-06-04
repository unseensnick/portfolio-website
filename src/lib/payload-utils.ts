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
            { text: "Home", href: "#home" },
            { text: "Projects", href: "#projects" },
            { text: "About", href: "#about" },
            { text: "Contact", href: "#contact" },
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
 * Fetches portfolio data from PayloadCMS API and formats it for the application
 *
 * Features:
 * - Connects to PayloadCMS API using environment variables or defaults
 * - Includes proper caching and revalidation strategy
 * - Handles API errors gracefully with fallback data
 * - Processes API response to match component data requirements
 * - Logs helpful error messages when API issues occur
 *
 * @returns Promise resolving to formatted portfolio data
 */
export async function getPortfolioData() {
    try {
        // Fetch the portfolio data from PayloadCMS
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3000"}/api/portfolio?limit=1&depth=2`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                next: {
                    revalidate: 60, // Revalidate cache every minute
                },
            }
        );

        if (!response.ok) {
            console.error("Failed to fetch portfolio data from PayloadCMS");
            return fallbackData;
        }

        const result = await response.json();

        // Get the first portfolio document
        const portfolioDoc = result.docs?.[0];

        if (!portfolioDoc) {
            console.error("No portfolio documents found in PayloadCMS");
            return fallbackData;
        }

        // Adapt the data to match component props
        return adaptPortfolioData(portfolioDoc);
    } catch (error) {
        console.error("Error fetching portfolio data:", error);
        // Fall back to fallback data if there's an error
        return fallbackData;
    }
}
