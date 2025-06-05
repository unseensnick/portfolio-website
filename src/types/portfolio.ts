export interface NavLink {
    label: string; // Changed from "text" to "label"
    href: string;
    icon?: string; // Added optional icon to match PayloadCMS schema
}

export interface Nav {
    logo: string;
    subtitle: string;
    links: NavLink[];
}

export interface Hero {
    greeting: string;
    title: string;
    description: string;
    githubUrl: string;
    image: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
}

export interface About {
    title: string;
    paragraphs: string[];
    technologies: string[];
    interests: string[];
    image: string;
    technologiesHeading: string;
    interestsHeading: string;
}

export interface Technology {
    name: string;
}

export interface ProjectItem {
    title: string;
    description: string;
    projectUrl?: string;
    codeUrl?: string;
    image?: string;
    technologies?: Technology[];
}

export interface Projects {
    title: string;
    featured: ProjectItem;
    items: ProjectItem[];
    description: string;
    viewMoreText: string;
    viewAllLink: string;
}

export interface Contact {
    title: string;
    description: string;
    email: string;
    github: string;
    emailSubtitle: string;
    githubSubtitle: string;
    ctaTitle: string;
    ctaDescription: string;
}

export interface Footer {
    copyright: string;
}

export interface PortfolioData {
    nav: Nav;
    hero: Hero;
    about: About;
    projects: Projects;
    contact: Contact;
    footer: Footer;
}
