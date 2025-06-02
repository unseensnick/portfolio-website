export const portfolioData = {
    nav: {
        logo: "unseensnick",
        links: [
            { href: "#home", label: "Home" },
            { href: "#projects", label: "Projects" },
            { href: "#about", label: "About" },
            { href: "#contact", label: "Contact" },
        ],
    },
    hero: {
        greeting: "Hello There!",
        title: "Full Stack Developer",
        description:
            "Lorem ipsum dolor sit amet consectetur. Eu ipsum odio nisi ultrices aenean. Adipiscing gravida et quam faucibus urna nunc diam nec non.",
        githubUrl: "https://github.com",
        image: "/hero.png", // Add your hero image path
    },
    projects: {
        title: "Projects",
        featured: {
            title: "Featured Project",
            description:
                "Lorem ipsum faucibus fermentum nullam dignissim lacus duis eger mattis.",
            projectUrl: "#",
            codeUrl: "#",
            image: "/featured-project.png", // Add your image path
        },
        items: [
            {
                title: "Project 2",
                description:
                    "Lorem ipsum faucibus fermentum nullam dignissim lacus duis eger mattis.",
                projectUrl: "#",
                codeUrl: "#",
                image: "/project-2.png", // Add your image path
            },
            {
                title: "Project 3",
                description:
                    "Lorem ipsum faucibus fermentum nullam dignissim lacus duis eger mattis.",
                projectUrl: "#",
                codeUrl: "#",
                image: "/project-3.png", // Add your image path
            },
        ],
        viewAllLink: "#",
    },
    about: {
        title: "About",
        paragraphs: [
            "Lorem ipsum dolor sit amet consectetur. Vitae volutpat nisi pulvinar est tellus cursus gravida ut nunc. Eger adipiscing pulvinar nisi sed sed. Vestibulum in vitae porta nunc. Sapien ullamcorper ipsum pellentesque.",
            "Lorem ipsum dolor sit amet consectetur. Eget volutpat nisi pulvinar est tellus cursus gravida ut nunc. Pages, adipiscing pulvinar nisi sed sed. Vestibulum in vitae porta nunc. Sapien ullamcorper ipsum pellentesque.",
        ],
        technologies: ["JavaScript", "React / NextJs", "PostgreSQL", "Python"],
        interests: ["Open Source", "Interest 2", "Interest 3", "Interest 4"],
        image: "/about.png", // Add your image path
    },
    contact: {
        title: "Contact",
        description:
            "Lorem ipsum dolor sit amet consectetur. Est etiam magna nisi libero rhoncus massa lacus nunc.",
        email: "your.email@example.com",
        github: "github.com/yourusername",
    },
    footer: {
        copyright: "© 2025 UnseenSnick. All rights reserved.",
    },
};
