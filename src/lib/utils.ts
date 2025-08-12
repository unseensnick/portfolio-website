import { clsx, type ClassValue } from "clsx";
import { FolderOpen, Home, LucideIcon, Mail, User } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

// ===== COMMON CLASSES =====
export const commonClasses = {
    flexCenter: "flex items-center justify-center",
    flexCenterCol: "flex flex-col items-center justify-center",
    gradientText: "bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent",
    primaryGradientText: "bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent",
    backgroundGradient: "bg-gradient-to-r from-primary/10 via-transparent to-primary/10",
    transition: "transition-all duration-300",
    transitionFast: "transition-all duration-200",
    transitionSlow: "transition-all duration-500",
    loadingSpinner: "animate-spin rounded-full border-2 border-primary border-t-transparent",
    loadingPulse: "animate-pulse bg-muted/50",
    iconContainer: "rounded-full flex items-center justify-center",
    backdropBlur: "backdrop-blur-sm bg-background/80",
    sectionDivider: "h-px bg-gradient-to-r from-transparent via-border to-transparent",
    cardPadding: {
        mobile: "p-6",
        desktop: "p-8",
    },
    cardHover: {
        mobile: "hover:bg-muted/50 hover:shadow-lg hover:shadow-black/5",
        desktop: "hover:bg-muted/50 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1",
    },
} as const;

// ===== RESPONSIVE SIZES =====
export const responsiveSizes = {
    container: {
        sm: "size-8",
        md: "size-12",
        lg: "size-16",
        xl: "size-20",
    },
    text: {
        heading: {
            mobile: "text-xl",
            desktop: "text-2xl lg:text-3xl",
        },
        subheading: {
            mobile: "text-lg",
            desktop: "text-xl lg:text-2xl",
        },
        heroTitle: {
            mobile: "text-3xl",
            desktop: "text-5xl lg:text-6xl",
        },
        body: {
            mobile: "text-sm",
            desktop: "text-base",
        },
        description: {
            mobile: "text-base px-4 leading-relaxed",
            desktop: "text-lg max-w-2xl mx-auto leading-relaxed",
        },
        cardTitle: {
            mobile: "text-base",
            desktop: "text-lg",
        },
        cardSubtitle: {
            mobile: "text-sm",
            desktop: "text-base",
        },
        link: {
            mobile: "text-sm",
            desktop: "text-base",
        },
    },
    badge: {
        sm: {
            mobile: "px-1.5 py-0.5 text-xs",
            desktop: "px-2 py-0.5 text-xs",
        },
        md: {
            mobile: "px-2 py-0.5 text-xs",
            desktop: "px-2.5 py-1 text-[0.8125rem]",
        },
        lg: {
            mobile: "px-2.5 py-1 text-xs",
            desktop: "px-3 py-1.5 text-sm",
        },
    },
    gap: {
        mobile: "gap-1.5",
        desktop: "gap-2.5", 
    },
} as const;

// ===== RESPONSIVE LAYOUTS =====
export const responsiveLayouts = {
    twoColumn: {
        mobile: "space-y-10",
        desktop: "grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center",
    },
    grid: {
        mobile: "space-y-4",
        desktop: "grid grid-cols-1 md:grid-cols-2 gap-8",
    },
    stack: {
        mobile: "space-y-6",
        desktop: "space-y-12",
    },
    simpleGrid: {
        mobile: "grid grid-cols-1",
        desktop: "grid grid-cols-1 sm:grid-cols-2",
    },
} as const;

// ===== UTILITY FUNCTIONS =====
function createResponsiveUtility<T>(
    config: { mobile: T; desktop: T },
    isMobile: boolean
): T {
    return isMobile ? config.mobile : config.desktop;
}

export function createResponsiveClasses(
    mobileClasses: string,
    desktopClasses: string,
    isMobile: boolean
): string {
    return createResponsiveUtility({ mobile: mobileClasses, desktop: desktopClasses }, isMobile);
}

export function createResponsiveLayout(
    layout: keyof typeof responsiveLayouts,
    isMobile: boolean
): string {
    return createResponsiveUtility(responsiveLayouts[layout], isMobile);
}

export function createResponsiveText(
    textType: keyof typeof responsiveSizes.text,
    isMobile: boolean
): string {
    return createResponsiveUtility(responsiveSizes.text[textType], isMobile);
}

export function createResponsiveSpacing(
    spacingType: "section" | "content" | "layout" | "cardContent" | "sectionPadding" | "projectGrid",
    isMobile: boolean
): string {
    const spacingMap = {
        section: { mobile: "space-y-3", desktop: "space-y-4" },
        content: { mobile: "space-y-4", desktop: "space-y-6" },
        layout: { mobile: "space-y-8", desktop: "space-y-6" },
        cardContent: { mobile: "space-y-3 sm:space-y-4", desktop: "space-y-4 sm:space-y-6" },
        sectionPadding: { mobile: "py-16", desktop: "py-24 lg:py-32" },
        projectGrid: { mobile: "space-y-12 mb-16", desktop: "space-y-24 mb-32" },
    };
    
    return createResponsiveUtility(spacingMap[spacingType], isMobile);
}

export function createResponsiveBadge(
    size: keyof typeof responsiveSizes.badge,
    isMobile: boolean
): string {
    return createResponsiveUtility(responsiveSizes.badge[size], isMobile);
}

export function createResponsiveGap(isMobile: boolean): string {
    return createResponsiveUtility(responsiveSizes.gap, isMobile);
}

// Icon-related utilities
export const responsiveIconSizes = {
    xs: { mobile: "size-3", desktop: "size-4" },
    sm: { mobile: "size-4", desktop: "size-5" },
    md: { mobile: "size-6", desktop: "size-8" },
    lg: { mobile: "size-8", desktop: "size-10" },
    xl: { mobile: "size-10", desktop: "size-12" },
} as const;

export function createResponsiveIconSize(
    size: keyof typeof responsiveIconSizes,
    isMobile: boolean
): string {
    return createResponsiveUtility(responsiveIconSizes[size], isMobile);
}

export const sectionIconMap: Record<string, LucideIcon> = {
    home: Home,
    projects: FolderOpen,
    about: User,
    contact: Mail,
    Home: Home,
    FolderOpen: FolderOpen,
    User: User,
    Mail: Mail,
};

export function getSectionIcon(iconName: string): LucideIcon {
    return sectionIconMap[iconName] || Home;
}

export function createResponsiveCardPadding(isMobile: boolean): string {
    return createResponsiveUtility(commonClasses.cardPadding, isMobile);
}

export function createResponsiveCardHover(isMobile: boolean): string {
    return createResponsiveUtility(commonClasses.cardHover, isMobile);
}

export function createIconContainer(
    size: keyof typeof responsiveSizes.container = "md",
    variant: "default" | "primary" = "default"
): string {
    const baseClasses = commonClasses.iconContainer;
    const sizeClass = responsiveSizes.container[size];
    const variantClass = variant === "primary" ? "bg-primary/10" : "";
    
    return cn(baseClasses, sizeClass, variantClass);
}

export function createContentWrapper(isMobile: boolean): {
    container: string;
    content: string;
    spacing: string;
} {
    return {
        container: isMobile ? "space-y-10" : "grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-20",
        content: isMobile ? "" : "lg:col-span-3 space-y-12",
        spacing: isMobile ? "space-y-8" : "space-y-6",
    };
}

export function createFullScreenCenteredLayout(): string {
    return `min-h-screen ${commonClasses.flexCenter} bg-muted/50 p-4`;
}

// ===== CONDITIONAL UTILITIES =====
export function createConditionalClasses(
    condition: boolean,
    trueClasses: string,
    falseClasses: string = ""
): string {
    return condition ? trueClasses : falseClasses;
}

// URL formatting helper
export function formatExternalUrl(url: string): string {
    if (!url) return "#";
    
    // Handle relative URLs
    if (url.startsWith("/") || url.startsWith("#")) {
        return url;
    }
    
    // Handle email links
    if (url.startsWith("mailto:")) {
        return url;
    }
    
    // Add https:// if no protocol is specified
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return `https://${url}`;
    }
    
    return url;
}
