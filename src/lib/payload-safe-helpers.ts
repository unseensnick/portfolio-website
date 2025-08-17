/**
 * Safe data processing utilities for PayloadCMS live preview
 * 
 * PayloadCMS can return null/undefined properties during live preview
 * when content is being created. These utilities provide consistent
 * null safety across the application.
 */

/**
 * Generic utility for safely validating and trimming strings
 * Eliminates repeated string validation logic across functions
 */
function validateAndTrimString(value: any): string | null {
    if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : null;
    }
    return null;
}

/**
 * Generic utility for extracting string from object with name property
 * Eliminates repeated object property extraction logic
 */
function extractNameFromObject(item: any): string | null {
    if (item && typeof item === "object" && item.name) {
        return validateAndTrimString(item.name);
    }
    return null;
}

/**
 * Generic utility for safely mapping arrays with filtering
 */
export function safeArrayMap<T, R>(
    array: T[] | undefined | null,
    mapper: (item: T, index: number) => R | null,
    filter: (item: R) => boolean = Boolean
): R[] {
    if (!array || !Array.isArray(array)) return [];
    
    return array
        .map(mapper)
        .filter((item): item is R => item !== null && filter(item));
}

/**
 * Extract string names from mixed array of strings/objects
 */
export function safelyExtractNames(items?: any[]): string[] {
    return safeArrayMap(items, (item) => {
        return validateAndTrimString(item) || extractNameFromObject(item);
    });
}


/**
 * Process technologies for TechBadgeGroup component
 * Returns { name: string }[] format
 */
export function safelyProcessTechnologies(technologies?: any[]): { name: string }[] {
    return safeArrayMap(technologies, (tech) => {
        const name = validateAndTrimString(tech) || extractNameFromObject(tech);
        return name ? { name } : null;
    });
}

/**
 * Process navigation links with href/label validation
 */
export function safelyProcessNavLinks(links?: any[]): Array<{ href: string; label: string; icon?: string }> {
    return safeArrayMap(links, (link) => {
        if (link && typeof link === "object") {
            const href = validateAndTrimString(link.href);
            const label = validateAndTrimString(link.label);
            
            if (href && label) {
                const result: { href: string; label: string; icon?: string } = { href, label };
                const icon = validateAndTrimString(link.icon);
                if (icon) result.icon = icon;
                return result;
            }
        }
        return null;
    });
}

/**
 * Extract image URL from PayloadCMS media object or direct string
 */
export function safelyExtractImageUrl(image?: any, fallback?: string): string | null {
    if (!image) return fallback || null;
    
    const directUrl = validateAndTrimString(image);
    if (directUrl) return directUrl;
    
    // Try common PayloadCMS image properties
    if (typeof image === "object") {
        const possibleUrls = [image.url, image.filename, image.src, image.path];
        
        for (const url of possibleUrls) {
            const validUrl = validateAndTrimString(url);
            if (validUrl) return validUrl;
        }
    }
    
    return fallback || null;
}

/**
 * Extract URL from NavigationLinks relationship object
 * Handles both direct string URLs and NavigationLinks relationship objects
 */
export function safelyExtractUrl(urlData?: any, fallback: string = ""): string {
    if (!urlData) return fallback;
    
    // Direct string URL
    const directUrl = validateAndTrimString(urlData);
    if (directUrl) return directUrl;
    
    // NavigationLinks relationship object
    if (typeof urlData === "object" && urlData.href) {
        const relationshipUrl = validateAndTrimString(urlData.href);
        if (relationshipUrl) return relationshipUrl;
    }
    
    return fallback;
}

/**
 * Safe string extraction with fallback
 */
export function safeString(value?: any, fallback: string = ""): string {
    const validString = validateAndTrimString(value);
    return validString || fallback;
}

