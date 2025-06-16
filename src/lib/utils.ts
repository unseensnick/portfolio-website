import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines CSS classes with Tailwind conflict resolution
 * 
 * Merges multiple class sources and resolves Tailwind conflicts
 * by keeping the last conflicting class.
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/**
 * Common CSS class patterns to reduce duplication
 */
export const commonClasses = {
    // Flex patterns
    flexCenter: "flex items-center justify-center",
    flexCenterCol: "flex flex-col items-center justify-center",
    
    // Gradient text pattern
    gradientText: "bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent",
    
    // Primary gradient text pattern
    primaryGradientText: "bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent",
    
    // Common transitions
    transition: "transition-all duration-300",
    transitionFast: "transition-all duration-200",
    transitionSlow: "transition-all duration-500",
    
    // Loading states
    loadingSpinner: "animate-spin rounded-full border-2 border-primary border-t-transparent",
    loadingPulse: "animate-pulse bg-muted/50",
    
    // Icon containers
    iconContainer: "rounded-full flex items-center justify-center",
    iconContainerPrimary: "rounded-full bg-primary/10 flex items-center justify-center",
    
    // Backdrop blur
    backdropBlur: "backdrop-blur-sm bg-background/80",
    
    // Section divider
    sectionDivider: "h-px bg-gradient-to-r from-transparent via-border to-transparent",
    
    // Card patterns
    cardPadding: {
        mobile: "p-6",
        desktop: "p-8",
    },
    
    // Hover effects
    cardHover: {
        mobile: "hover:bg-muted/50 hover:shadow-lg hover:shadow-black/5",
        desktop: "hover:bg-muted/50 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1",
    },
} as const;

/**
 * Responsive size utilities
 */
export const responsiveSizes = {
    icon: {
        sm: "size-4",
        md: "size-6", 
        lg: "size-8",
        xl: "size-12",
    },
    container: {
        sm: "size-8",
        md: "size-12",
        lg: "size-16",
        xl: "size-20",
    },
    spacing: {
        mobile: "px-6 py-16",
        desktop: "px-8 py-24 lg:py-32",
        section: {
            mobile: "space-y-1",
            desktop: "space-y-2",
        },
        content: {
            mobile: "space-y-3",
            desktop: "space-y-4",
        },
        layout: {
            mobile: "space-y-4",
            desktop: "space-y-6",
        },
        projectGrid: {
            mobile: "space-y-6 mb-12",
            desktop: "space-y-32",
        },
        sectionPadding: {
            mobile: "py-16",
            desktop: "py-24 lg:py-32",
        },
    },
    text: {
        heading: {
            mobile: "text-xl",
            desktop: "text-2xl lg:text-3xl",
        },
        subheading: {
            mobile: "text-lg",
            desktop: "text-xl",
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
            mobile: "text-lg",
            desktop: "text-xl",
        },
        cardSubtitle: {
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

/**
 * Responsive layout patterns
 */
export const responsiveLayouts = {
    // Two-column layouts
    twoColumn: {
        mobile: "space-y-10",
        desktop: "grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center",
    },
    // Grid layouts
    grid: {
        mobile: "space-y-4",
        desktop: "grid grid-cols-1 md:grid-cols-2 gap-8",
    },
    // Stacked layouts
    stack: {
        mobile: "space-y-6",
        desktop: "space-y-12",
    },
} as const;

/**
 * Creates responsive classes based on mobile state
 */
export function createResponsiveClasses(
    mobileClasses: string,
    desktopClasses: string,
    isMobile: boolean
): string {
    return isMobile ? mobileClasses : desktopClasses;
}

/**
 * Creates responsive layout classes
 */
export function createResponsiveLayout(
    layout: keyof typeof responsiveLayouts,
    isMobile: boolean
): string {
    return createResponsiveClasses(
        responsiveLayouts[layout].mobile,
        responsiveLayouts[layout].desktop,
        isMobile
    );
}

/**
 * Creates responsive text classes
 */
export function createResponsiveText(
    textType: keyof typeof responsiveSizes.text,
    isMobile: boolean
): string {
    return createResponsiveClasses(
        responsiveSizes.text[textType].mobile,
        responsiveSizes.text[textType].desktop,
        isMobile
    );
}

/**
 * Creates responsive spacing classes
 */
export function createResponsiveSpacing(
    spacingType: keyof typeof responsiveSizes.spacing,
    isMobile: boolean
): string {
    if (spacingType === "mobile" || spacingType === "desktop") {
        return isMobile ? responsiveSizes.spacing.mobile : responsiveSizes.spacing.desktop;
    }
    
    const spacingConfig = responsiveSizes.spacing[spacingType];
    return createResponsiveClasses(
        spacingConfig.mobile,
        spacingConfig.desktop,
        isMobile
    );
}

/**
 * Creates responsive badge classes
 */
export function createResponsiveBadge(
    size: keyof typeof responsiveSizes.badge,
    isMobile: boolean
): string {
    return createResponsiveClasses(
        responsiveSizes.badge[size].mobile,
        responsiveSizes.badge[size].desktop,
        isMobile
    );
}

/**
 * Creates responsive gap classes
 */
export function createResponsiveGap(isMobile: boolean): string {
    return createResponsiveClasses(
        responsiveSizes.gap.mobile,
        responsiveSizes.gap.desktop,
        isMobile
    );
}

/**
 * Creates responsive card padding
 */
export function createResponsiveCardPadding(isMobile: boolean): string {
    return createResponsiveClasses(
        commonClasses.cardPadding.mobile,
        commonClasses.cardPadding.desktop,
        isMobile
    );
}

/**
 * Creates responsive card hover effects
 */
export function createResponsiveCardHover(isMobile: boolean): string {
    return createResponsiveClasses(
        commonClasses.cardHover.mobile,
        commonClasses.cardHover.desktop,
        isMobile
    );
}

/**
 * Creates icon container classes with responsive sizing
 */
export function createIconContainer(
    size: keyof typeof responsiveSizes.container = "md",
    variant: "default" | "primary" = "default"
): string {
    const baseClasses = commonClasses.iconContainer;
    const sizeClass = responsiveSizes.container[size];
    const variantClass = variant === "primary" ? "bg-primary/10" : "";
    
    return cn(baseClasses, sizeClass, variantClass);
}

/**
 * Creates responsive content wrapper with consistent patterns
 */
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