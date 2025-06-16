import type { PortfolioData } from "@/types/portfolio";

/**
 * Comprehensive demo data for showcasing the portfolio
 * This data is used when DEMO_MODE is enabled
 */
export const demoData: PortfolioData = {
    nav: {
        logo: "John Doe",
        subtitle: "Full Stack Developer",
        logoSplitAt: 4, // Split "John" and "Doe"
        links: [
            { label: "Home", href: "#home" },
            { label: "Projects", href: "#projects" },
            { label: "About", href: "#about" },
            { label: "Contact", href: "#contact" },
        ],
    },
    hero: {
        greeting: "Hello, I'm",
        title: "John Doe",
        description: "A passionate full-stack developer who loves creating beautiful, functional web applications. I specialize in React, Node.js, and modern web technologies to bring ideas to life.",
        githubUrl: "https://github.com/johndoe",
        image: "/placeholder-image.svg",
        ctaText: "View GitHub",
        ctaLink: "https://github.com/johndoe",
        secondaryCtaText: "View Projects",
        secondaryCtaLink: "#projects",
    },
    about: {
        title: "About Me",
        paragraphs: [
            "I'm a passionate full-stack developer with over 5 years of experience building web applications. I love turning complex problems into simple, beautiful, and intuitive solutions.",
            "When I'm not coding, you can find me exploring new technologies, contributing to open source projects, or sharing my knowledge through blog posts and mentoring.",
            "I believe in writing clean, maintainable code and creating user experiences that make a difference. My goal is to build applications that not only work well but also bring joy to the people who use them."
        ],
        technologies: [
            "JavaScript", "TypeScript", "React", "Next.js", "Node.js", 
            "Express", "PostgreSQL", "MongoDB", "Docker", "AWS", 
            "Tailwind CSS", "Git", "GraphQL", "REST APIs"
        ],
        interests: [
            "Open Source", "UI/UX Design", "Photography", "Hiking", 
            "Coffee Brewing", "Tech Blogging", "Mentoring", "Gaming"
        ],
        image: "/placeholder-image.svg",
        technologiesHeading: "Technologies & Tools",
        interestsHeading: "When I'm Not Coding",
    },
    projects: {
        title: "My Projects",
        description: "Here are some of my recent projects that showcase my skills and passion for development",
        viewMoreText: "Want to see more of my work?",
        viewAllLink: "https://github.com/johndoe",
        featured: {
            title: "E-Commerce Platform",
            description: [
                { text: "A full-stack e-commerce platform built with Next.js, featuring user authentication, payment processing, inventory management, and an admin dashboard." },
                { text: "Includes real-time notifications and responsive design optimized for both desktop and mobile experiences." }
            ],
            projectUrl: "https://demo-ecommerce.vercel.app",
            codeUrl: "https://github.com/johndoe/ecommerce-platform",
            media: {
                image: {
                    url: "/placeholder-image.svg",
                    alt: "E-Commerce Platform Screenshot"
                }
            },
            technologies: [
                { name: "Next.js" },
                { name: "TypeScript" },
                { name: "PostgreSQL" },
                { name: "Stripe" },
                { name: "Tailwind CSS" },
                { name: "Prisma" }
            ],
        },
        items: [
            {
                title: "Task Management App",
                description: [
                    { text: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features." },
                    { text: "Built with React and Socket.io for seamless real-time communication and state synchronization across multiple users." }
                ],
                projectUrl: "https://demo-tasks.vercel.app",
                codeUrl: "https://github.com/johndoe/task-manager",
                media: {
                    image: {
                        url: "/placeholder-image.svg",
                        alt: "Task Management App Screenshot"
                    },
                    video: {
                        src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        title: "Task Management App Demo",
                        description: "See the app in action with real-time collaboration features"
                    }
                },
                technologies: [
                    { name: "React" },
                    { name: "Node.js" },
                    { name: "Socket.io" },
                    { name: "MongoDB" }
                ],
            },
            {
                title: "Weather Dashboard",
                description: [
                    { text: "A beautiful weather dashboard with location-based forecasts, interactive maps, and weather alerts." },
                    { text: "Features a clean, responsive design with dark/light mode support and detailed weather analytics." }
                ],
                projectUrl: "https://demo-weather.vercel.app",
                codeUrl: "https://github.com/johndoe/weather-dashboard",
                media: {
                    image: {
                        url: "/placeholder-image.svg",
                        alt: "Weather Dashboard Screenshot"
                    }
                },
                technologies: [
                    { name: "Vue.js" },
                    { name: "TypeScript" },
                    { name: "OpenWeather API" },
                    { name: "Chart.js" }
                ],
            },
            {
                title: "Blog Platform",
                description: [
                    { text: "A modern blog platform with markdown support, syntax highlighting, and SEO optimization." },
                    { text: "Includes a content management system and comment functionality with spam protection and moderation tools." }
                ],
                projectUrl: "https://demo-blog.vercel.app",
                codeUrl: "https://github.com/johndoe/blog-platform",
                media: {
                    image: {
                        url: "/placeholder-image.svg",
                        alt: "Blog Platform Screenshot"
                    }
                },
                technologies: [
                    { name: "Next.js" },
                    { name: "MDX" },
                    { name: "Sanity" },
                    { name: "Vercel" }
                ],
            },
        ],
    },
    contact: {
        title: "Get In Touch",
        description: "I'm always open to discussing new opportunities, interesting projects, or just having a chat about technology. Feel free to reach out!",
        email: "john.doe@example.com",
        github: "https://github.com/johndoe",
        emailSubtitle: "Email",
        githubSubtitle: "GitHub",
        ctaTitle: "Let's work together",
        ctaDescription: "I'm currently available for freelance projects and full-time opportunities",
    },
    footer: {
        copyright: "© 2025 John Doe. All Rights Reserved",
    },
}; 