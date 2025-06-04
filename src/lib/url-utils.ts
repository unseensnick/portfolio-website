/**
 * Ensures URLs are properly formatted with the appropriate protocol
 *
 * @param url - URL string to format
 * @returns Properly formatted URL string
 *
 * Handles these cases:
 * - Empty/undefined URLs: Returns "#" (empty anchor)
 * - Email links (mailto:): Preserves as-is
 * - Anchor links (#): Preserves as-is
 * - URLs with protocol (http://, https://): Preserves as-is
 * - Plain domains: Adds "https://" prefix
 *
 * Example:
 * ```
 * formatExternalUrl("example.com") // returns "https://example.com"
 * formatExternalUrl("mailto:name@example.com") // returns "mailto:name@example.com"
 * ```
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
