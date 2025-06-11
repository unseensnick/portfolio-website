/**
 * Safe data processing utilities for PayloadCMS live preview
 * 
 * PayloadCMS can return null/undefined properties during live preview
 * when content is being created. These utilities provide consistent
 * null safety across the application.
 */

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
        if (typeof item === "string") {
            const trimmed = item.trim();
            return trimmed.length > 0 ? trimmed : null;
        }
        
        if (item && typeof item === "object" && item.name && typeof item.name === "string") {
            const trimmed = item.name.trim();
            return trimmed.length > 0 ? trimmed : null;
        }
        
        return null;
    });
}

/**
 * Extract text from PayloadCMS paragraph objects: { text: string }
 */
export function safelyExtractParagraphs(paragraphs?: any[]): string[] {
    return safeArrayMap(paragraphs, (paragraph) => {
        if (paragraph && typeof paragraph === "object" && paragraph.text && typeof paragraph.text === "string") {
            const trimmed = paragraph.text.trim();
            return trimmed.length > 0 ? trimmed : null;
        }
        return null;
    });
}

/**
 * Process technologies for TechBadgeGroup component
 * Returns { name: string }[] format
 */
export function safelyProcessTechnologies(technologies?: any[]): { name: string }[] {
    return safeArrayMap(technologies, (tech) => {
        if (typeof tech === "string") {
            const trimmed = tech.trim();
            return trimmed.length > 0 ? { name: trimmed } : null;
        }
        
        if (tech && typeof tech === "object" && tech.name && typeof tech.name === "string") {
            const trimmed = tech.name.trim();
            return trimmed.length > 0 ? { name: trimmed } : null;
        }
        
        return null;
    });
}

/**
 * Extract technology names as strings (alternative to safelyProcessTechnologies)
 */
export function safelyExtractTechnologyNames(technologies?: any[]): string[] {
    return safelyExtractNames(technologies);
}

/**
 * Process navigation links with href/label validation
 */
export function safelyProcessNavLinks(links?: any[]): Array<{ href: string; label: string; icon?: string }> {
    return safeArrayMap(links, (link) => {
        if (link && typeof link === "object") {
            const href = link.href && typeof link.href === "string" ? link.href.trim() : null;
            const label = link.label && typeof link.label === "string" ? link.label.trim() : null;
            
            if (href && label && href.length > 0 && label.length > 0) {
                return {
                    href,
                    label,
                    ...(link.icon && typeof link.icon === "string" && { icon: link.icon.trim() })
                };
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
    
    if (typeof image === "string") {
        const trimmed = image.trim();
        if (trimmed.length > 0) {
            return trimmed;
        }
    }
    
    // Try common PayloadCMS image properties
    if (typeof image === "object") {
        const possibleUrls = [
            image.url,
            image.filename,
            image.src,
            image.path
        ];
        
        for (const url of possibleUrls) {
            if (url && typeof url === "string") {
                const trimmed = url.trim();
                if (trimmed.length > 0) {
                    return trimmed;
                }
            }
        }
    }
    
    return fallback || null;
}

/**
 * Safe string extraction with fallback
 */
export function safeString(value?: any, fallback: string = ""): string {
    if (value && typeof value === "string") {
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : fallback;
    }
    return fallback;
}

/**
 * Type guard to check if object has required properties
 */
export function hasRequiredProps(obj: any, requiredProps: string[]): boolean {
    if (!obj || typeof obj !== "object") return false;
    
    return requiredProps.every(prop => {
        const value = obj[prop];
        return value !== null && value !== undefined && value !== "";
    });
}

/**
 * DEBUG: Log PayloadCMS data structure (development only)
 * Remove from imports when not needed
 */
export function debugPayloadData(data: any, label: string = "PayloadCMS Data"): void {
    if (process.env.NODE_ENV === 'development') {
        console.group(`[DEBUG] ${label}`);
        console.log('Type:', typeof data);
        console.log('Value:', data);
        
        if (data && typeof data === 'object') {
            console.log('Keys:', Object.keys(data));
            
            if (data.url || data.filename || data.src) {
                console.log('Potential image properties:');
                console.log('- url:', data.url);
                console.log('- filename:', data.filename);
                console.log('- src:', data.src);
                console.log('- path:', data.path);
            }
        }
        console.groupEnd();
    }
}