/**
 * Ensures URLs have proper protocol for external links
 * 
 * Handles: empty URLs, email links, anchor links, existing protocols, plain domains
 */
export function formatExternalUrl(url?: string): string {
    if (!url) return "#";
    if (url.startsWith("mailto:")) return url;
    if (url.startsWith("#")) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;

    return `https://${url}`;
}