/**
 * Centralized utilities for safely processing PayloadCMS data
 * 
 * PayloadCMS live preview can create objects with null/undefined properties
 * when new items are being created but not yet filled out. These utilities
 * provide consistent null safety across the entire application.
 */

/**
 * Generic utility for safely mapping arrays with filtering
 * 
 * @param array - Source array (can be undefined/null)
 * @param mapper - Function to transform each item (should return null for invalid items)
 * @param filter - Optional custom filter function
 * @returns Array of valid mapped items
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
 * Safely extracts string names from an array of objects or strings
 * Handles both direct strings and objects with name properties
 * 
 * @param items - Array of strings or objects that might have name properties
 * @returns Array of valid string names
 */
export function safelyExtractNames(items?: any[]): string[] {
    return safeArrayMap(items, (item) => {
        // Handle direct strings
        if (typeof item === "string") {
            const trimmed = item.trim();
            return trimmed.length > 0 ? trimmed : null;
        }
        
        // Handle objects with name property
        if (item && typeof item === "object" && item.name && typeof item.name === "string") {
            const trimmed = item.name.trim();
            return trimmed.length > 0 ? trimmed : null;
        }
        
        return null;
    });
}

/**
 * Safely extracts text content from paragraph objects
 * Handles PayloadCMS paragraph format: { text: string }
 * 
 * @param paragraphs - Array of paragraph objects from PayloadCMS
 * @returns Array of valid paragraph text strings
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
 * Safely processes technology arrays to ensure valid objects for components
 * Handles both string arrays and PayloadCMS object arrays
 * Returns objects in the format expected by TechBadgeGroup: { name: string }[]
 * 
 * @param technologies - Array of technology strings or objects from PayloadCMS
 * @returns Array of valid technology objects with names
 */
export function safelyProcessTechnologies(technologies?: any[]): { name: string }[] {
    return safeArrayMap(technologies, (tech) => {
        // Handle direct string format
        if (typeof tech === "string") {
            const trimmed = tech.trim();
            return trimmed.length > 0 ? { name: trimmed } : null;
        }
        
        // Handle object format with null safety
        if (tech && typeof tech === "object" && tech.name && typeof tech.name === "string") {
            const trimmed = tech.name.trim();
            return trimmed.length > 0 ? { name: trimmed } : null;
        }
        
        return null;
    });
}

/**
 * Safely extracts technology names as strings (for components that expect string arrays)
 * Alternative to safelyProcessTechnologies when you need strings instead of objects
 * 
 * @param technologies - Array of technology strings or objects from PayloadCMS
 * @returns Array of valid technology name strings
 */
export function safelyExtractTechnologyNames(technologies?: any[]): string[] {
    return safelyExtractNames(technologies);
}

/**
 * Safely processes navigation links to ensure valid href and label properties
 * 
 * @param links - Array of navigation link objects from PayloadCMS
 * @returns Array of valid navigation links
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
 * Safely extracts image URL from PayloadCMS media object or direct string
 * 
 * @param image - PayloadCMS media object or direct URL string
 * @param fallback - Optional fallback URL if extraction fails
 * @returns Valid image URL, fallback, or null
 */
export function safelyExtractImageUrl(image?: any, fallback?: string): string | null {
    if (!image) return fallback || null;
    
    // Handle direct string URLs
    if (typeof image === "string") {
        const trimmed = image.trim();
        if (trimmed.length > 0) {
            return trimmed;
        }
    }
    
    // Handle PayloadCMS media object format - check multiple possible properties
    if (typeof image === "object") {
        // Try common PayloadCMS image properties
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
 * Utility to provide fallback values for missing or invalid strings
 * 
 * @param value - String value to check
 * @param fallback - Fallback value if original is invalid
 * @returns Valid string value
 */
export function safeString(value?: any, fallback: string = ""): string {
    if (value && typeof value === "string") {
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : fallback;
    }
    return fallback;
}

/**
 * Type guard to check if an object has required properties
 * Useful for validating PayloadCMS data structures
 * 
 * @param obj - Object to check
 * @param requiredProps - Array of required property names
 * @returns True if object has all required properties with truthy values
 */
export function hasRequiredProps(obj: any, requiredProps: string[]): boolean {
    if (!obj || typeof obj !== "object") return false;
    
    return requiredProps.every(prop => {
        const value = obj[prop];
        return value !== null && value !== undefined && value !== "";
    });
}

/**
 * DEBUG HELPER: Logs PayloadCMS data structure for debugging
 * Use this temporarily to understand what PayloadCMS returns
 * Remove from imports when not needed to keep bundle clean
 * 
 * @param data - Any PayloadCMS data
 * @param label - Label for the log
 */
export function debugPayloadData(data: any, label: string = "PayloadCMS Data"): void {
    if (process.env.NODE_ENV === 'development') {
        console.group(`[DEBUG] ${label}`);
        console.log('Type:', typeof data);
        console.log('Value:', data);
        
        if (data && typeof data === 'object') {
            console.log('Keys:', Object.keys(data));
            
            // Special handling for potential image objects
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