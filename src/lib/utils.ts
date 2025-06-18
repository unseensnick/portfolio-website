import { clsx, type ClassValue } from "clsx";
import { FolderOpen, Home, LucideIcon, Mail, User } from "lucide-react";
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
    
    // Background gradient patterns
    backgroundGradient: "bg-gradient-to-r from-primary/10 via-transparent to-primary/10",
    
    // Common transitions
    transition: "transition-all duration-300",
    transitionFast: "transition-all duration-200",
    transitionSlow: "transition-all duration-500",
    
    // Loading states
    loadingSpinner: "animate-spin rounded-full border-2 border-primary border-t-transparent",
    loadingPulse: "animate-pulse bg-muted/50",
    
    // Icon containers
    iconContainer: "rounded-full flex items-center justify-center",
    
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
    // Common grid patterns
    simpleGrid: {
        mobile: "grid grid-cols-1",
        desktop: "grid grid-cols-1 sm:grid-cols-2",
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
 * Creates responsive spacing classes - simplified approach following YAGNI
 */
export function createResponsiveSpacing(
    spacingType: "section" | "content" | "layout" | "cardContent" | "sectionPadding" | "projectGrid",
    isMobile: boolean
): string {
    const spacingMap = {
        section: {
            mobile: "space-y-3",
            desktop: "space-y-4",
        },
        content: {
            mobile: "space-y-4",
            desktop: "space-y-6",
        },
        layout: {
            mobile: "space-y-8",
            desktop: "space-y-6",
        },
        cardContent: {
            mobile: "space-y-3 sm:space-y-4",
            desktop: "space-y-4 sm:space-y-6",
        },
        sectionPadding: {
            mobile: "py-16",
            desktop: "py-24 lg:py-32",
        },
        projectGrid: {
            mobile: "space-y-12 mb-16",
            desktop: "space-y-24 mb-32",
        },
    };
    
    const spacingConfig = spacingMap[spacingType];
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

/**
 * Creates full-screen centered layout for forms and modals
 * Eliminates duplicate layout patterns in auth pages
 */
export function createFullScreenCenteredLayout(): string {
    return `min-h-screen ${commonClasses.flexCenter} bg-muted/50 p-4`;
}

// Logging utilities
export const logger = {

    createApiLogger: (service: string, requestId: string) => ({
        error: (message: string, ...args: any[]) => 
            console.error(`[${service} API ${requestId}] ${message}`, ...args),
        warn: (message: string, ...args: any[]) => 
            console.warn(`[${service} API ${requestId}] ${message}`, ...args),
        log: (message: string, ...args: any[]) => 
            console.log(`[${service} API ${requestId}] ${message}`, ...args),
    }),
    
    createFeatureLogger: (feature: string) => ({
        error: (message: string, ...args: any[]) => 
            console.error(`[${feature}] ${message}`, ...args),
        warn: (message: string, ...args: any[]) => 
            console.warn(`[${feature}] ${message}`, ...args),
        log: (message: string, ...args: any[]) => 
            console.log(`[${feature}] ${message}`, ...args),
    }),
} as const;

/**
 * Common validation utilities to eliminate repeated validation logic
 */
export const validators = {
    /**
     * Validates required field
     */
    required: (value: string, fieldName: string): string | null => {
        return !value ? `${fieldName} is required` : null;
    },
    
    /**
     * Validates minimum length
     */
    minLength: (value: string, min: number, fieldName: string): string | null => {
        return value.length < min ? `${fieldName} must be at least ${min} characters long` : null;
    },
    
    /**
     * Validates password confirmation
     */
    passwordMatch: (password: string, confirmPassword: string): string | null => {
        return password !== confirmPassword ? "Passwords do not match" : null;
    },
    
    /**
     * Combines multiple validators for a field
     */
    validateField: (value: string, validations: Array<() => string | null>): string | null => {
        for (const validation of validations) {
            const error = validation();
            if (error) return error;
        }
        return null;
    },
} as const;

/**
 * Creates password input field configuration with visibility toggle
 * Eliminates duplicate password field patterns in forms
 */
export function createPasswordField(
    value: string,
    onChange: (value: string) => void,
    showPassword: boolean,
    toggleShowPassword: () => void,
    options: {
        id: string;
        placeholder: string;
        error?: string;
        disabled?: boolean;
    }
) {
    return {
        inputProps: {
            id: options.id,
            type: showPassword ? "text" : "password",
            value,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
            placeholder: options.placeholder,
            className: cn(
                "pr-10",
                options.error && "border-destructive focus:border-destructive"
            ),
            disabled: options.disabled,
        },
        toggleButtonProps: {
            type: "button" as const,
            variant: "ghost" as const,
            size: "sm" as const,
            className: "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent",
            onClick: toggleShowPassword,
            disabled: options.disabled,
        },
        showPassword,
        error: options.error,
    };
}

/**
 * Icon mapping for navigation sections
 * Maps section IDs to their corresponding Lucide icons
 */
export const sectionIconMap: Record<string, LucideIcon> = {
    home: Home,
    about: User,
    projects: FolderOpen,
    contact: Mail,
};

/**
 * Get icon for a section, with fallback to Home icon
 */
export function getSectionIcon(sectionId: string): LucideIcon {
    return sectionIconMap[sectionId] || Home;
}

/**
 * Responsive icon size patterns
 */
export const responsiveIconSizes = {
    xs: { mobile: "size-3", desktop: "size-4" },
    sm: { mobile: "size-4", desktop: "size-5" },
    md: { mobile: "size-6", desktop: "size-8" },
    lg: { mobile: "size-8", desktop: "size-10" },
    xl: { mobile: "size-10", desktop: "size-12" },
} as const;

/**
 * Creates responsive icon size classes
 */
export function createResponsiveIconSize(
    size: keyof typeof responsiveIconSizes,
    isMobile: boolean
): string {
    return createResponsiveClasses(
        responsiveIconSizes[size].mobile,
        responsiveIconSizes[size].desktop,
        isMobile
    );
}

/**
 * Aspect ratio mapping utility
 */
export const aspectRatioMap = {
    square: "aspect-square",
    landscape: "aspect-[16/10]",
    portrait: "aspect-[3/4]",
} as const;

/**
 * Maps aspect ratio prop to Tailwind CSS class
 */
export function getAspectRatioClass(aspectRatio: string): string {
    if (aspectRatio in aspectRatioMap) {
        return aspectRatioMap[aspectRatio as keyof typeof aspectRatioMap];
    }
    return aspectRatio; // Return as-is for custom aspect ratios
}

/**
 * Responsive container patterns for different layouts
 */
export const responsiveContainers = {
    image: {
        mobile: "rounded-2xl shadow-xl",
        desktop: "rounded-xl shadow-2xl shadow-black/5",
    },
    card: {
        mobile: "rounded-2xl",
        desktop: "rounded-xl transition-transform duration-700 group-hover:scale-105",
    },
    modal: {
        mobile: "rounded-t-3xl",
        desktop: "rounded-2xl",
    },
} as const;

/**
 * Creates responsive container classes
 */
export function createResponsiveContainer(
    type: keyof typeof responsiveContainers,
    isMobile: boolean
): string {
    return createResponsiveClasses(
        responsiveContainers[type].mobile,
        responsiveContainers[type].desktop,
        isMobile
    );
}

/**
 * Responsive conditional rendering helper
 */
export function createConditionalClasses(
    condition: boolean,
    trueClasses: string,
    falseClasses: string = ""
): string {
    return condition ? trueClasses : falseClasses;
}

/**
 * Creates responsive button variant for toggle functionality (simplified YAGNI approach)
 */
export function createResponsiveButtonVariant(
    isActive: boolean
): "default" | "outline" {
    return isActive ? "default" : "outline";
}