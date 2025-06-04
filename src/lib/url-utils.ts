/**
 * Ensures external URLs are properly formatted with https:// prefix
 * @param url The URL to format
 * @returns Properly formatted URL with https:// prefix or # for empty URLs
 */
export function formatExternalUrl(url?: string): string {
    if (!url) return "#";

    // If it's an email link, don't modify it
    if (url.startsWith("mailto:")) return url;

    // If it's a local anchor link, don't modify it
    if (url.startsWith("#")) return url;

    // If it already has a protocol, don't modify it
    if (url.startsWith("http://") || url.startsWith("https://")) return url;

    // Otherwise, add https:// prefix
    return `https://${url}`;
}
