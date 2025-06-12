/**
 * Adds https:// protocol to URLs that don't have one
 * Preserves mailto:, #anchors, and existing protocols
 */
export function formatExternalUrl(url?: string): string {
    if (!url) return "#";
    if (url.startsWith("mailto:")) return url;
    if (url.startsWith("#")) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;

    return `https://${url}`;
}