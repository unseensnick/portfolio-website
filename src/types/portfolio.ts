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
    description: any;
    githubUrl: string;
    image: string;
    imagePosition?: "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
    aspectRatio?: "square" | "landscape" | "portrait" | string;
    imageZoom?: number;
    imageFinePosition?: {
        x?: number;
        y?: number;
    };
    ctaText: string;
    ctaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
}

export interface About {
    title: string;
    content: any;
    technologies: string[];
    interests: string[];
    image: string;
    imagePosition?: "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
    aspectRatio?: "square" | "landscape" | "portrait" | string;
    imageZoom?: number;
    imageFinePosition?: {
        x?: number;
        y?: number;
    };
    technologiesHeading: string;
    interestsHeading: string;
}

export interface Technology {
    name: string;
}

// Individual media item
export interface MediaItem {
    image?: {
        url?: string;
        alt?: string;
    } | any;
    imagePosition?: "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
    aspectRatio?: "square" | "landscape" | "portrait" | string;
    imageZoom?: number;
    imageFinePosition?: {
        x?: number;
        y?: number;
    };
    video?: {
        src?: string;
        file?: {
            url?: string;
        } | any;
        title?: string;
        description?: string;
    };
}

export interface ProjectItem {
    title: string;
    content: any;
    projectUrl?: string;
    codeUrl?: string;
    
    // Updated media structure - can be single media or array of media
    media?: MediaItem | MediaItem[];
    
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