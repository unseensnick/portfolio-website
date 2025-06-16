export interface NavLink {
    label: string; 
    href: string;
    icon?: string; 
}

export interface Nav {
    logo: string;
    subtitle: string;
    logoSplitAt?: number; 
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
    description: Array<{ text: string }>;
    projectUrl?: string;
    codeUrl?: string;
    
    // New consolidated media structure
    media?: {
        image?: {
            url?: string;
            alt?: string;
        } | any;
        video?: {
            src?: string;
            file?: {
                url?: string;
            } | any;
            title?: string;
            description?: string;
        };
    };
    
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