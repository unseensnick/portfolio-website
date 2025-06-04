"use client";

/**
 * Represents a navigation section in the website
 * @property id - HTML element ID for the section (without #)
 * @property label - Display text for navigation links
 * @property icon - Optional icon identifier for the section
 */
export interface Section {
    id: string;
    label: string;
    icon?: string;
}

/**
 * Scrolls to a specific section of the page with smooth animation
 *
 * Features:
 * - Supports different behavior for mobile and desktop
 * - Adds configurable offset to account for fixed headers
 * - Special handling for last section on mobile (scrolls to bottom)
 * - Allows delayed scrolling with setTimeout
 *
 * @param sectionId - HTML element ID to scroll to (without #)
 * @param offset - Pixels to offset from the top (for fixed headers)
 * @param delay - Milliseconds to wait before scrolling
 * @param isMobile - Whether to use mobile-specific scrolling behavior
 */
export function scrollToSection(
    sectionId: string,
    offset = 0,
    delay = 0,
    isMobile = false
): void {
    setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (!element) return;

        // For mobile devices, we might want different scroll behavior
        if (isMobile) {
            const headerHeight = 40;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // If it's the last section and on mobile, scroll to bottom
            if (isLastSection(sectionId)) {
                window.scrollTo({
                    top: documentHeight - windowHeight - 20,
                    behavior: "smooth",
                });
                return;
            }

            const elementPosition = element.offsetTop - headerHeight;
            window.scrollTo({
                top: elementPosition,
                behavior: "smooth",
            });
            return;
        }

        // Default desktop behavior
        const top =
            element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
            top,
            behavior: "smooth",
        });
    }, delay);
}

/**
 * Determines if a section is the last visible section in the document
 *
 * This is used to handle special scrolling behavior for the last section,
 * such as scrolling to bottom of page on mobile.
 *
 * @param sectionId - HTML element ID to check (without #)
 * @returns true if the section is the last visible section
 */
function isLastSection(sectionId: string): boolean {
    const section = document.getElementById(sectionId);
    if (!section) return false;

    // Find all elements with IDs (potential sections)
    const allSections = Array.from(document.querySelectorAll("[id]"));

    // Filter to only include visible section elements
    const visibleSections = allSections.filter((el) => {
        const style = window.getComputedStyle(el);
        return style.display !== "none" && style.visibility !== "hidden";
    });

    // Sort by position in document
    visibleSections.sort((a, b) => {
        return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
    });

    // Check if our section is the last one
    return visibleSections[visibleSections.length - 1]?.id === sectionId;
}

/**
 * Sets up a scroll listener to highlight the active section in navigation
 *
 * Features:
 * - Automatically updates active section based on scroll position
 * - Special handling for bottom of page (activates last section)
 * - Different detection logic for mobile and desktop
 * - Returns cleanup function to remove event listener
 *
 * @param sections - Array of section objects with id and label
 * @param setActiveSection - State setter function to update active section
 * @param offset - Pixels to offset detection point from the top
 * @param isMobile - Whether to use mobile-specific detection logic
 * @returns Cleanup function to remove scroll listener
 */
export function setupScrollListener(
    sections: Section[],
    setActiveSection: (id: string) => void,
    offset = 0,
    isMobile = false
): () => void {
    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Check if user is at the bottom of the page (for mobile especially)
        const isAtBottom =
            Math.ceil(currentScrollY + windowHeight) >= documentHeight - 10;

        if (isAtBottom && sections.length > 0) {
            setActiveSection(sections[sections.length - 1].id);
            return;
        }

        // Get current scroll position with offset
        const scrollPosition = currentScrollY + (isMobile ? 150 : offset + 100);

        // Find the current section by checking positions from bottom to top
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(sections[i].id);

            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                // For mobile and desktop we use slightly different detection logic
                if (isMobile) {
                    if (
                        scrollPosition >= sectionTop &&
                        scrollPosition < sectionTop + sectionHeight + 100
                    ) {
                        setActiveSection(sections[i].id);
                        break;
                    }
                } else if (section.offsetTop <= scrollPosition) {
                    setActiveSection(sections[i].id);
                    break;
                }
            }
        }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check
    handleScroll();

    // Return cleanup function
    return () => {
        window.removeEventListener("scroll", handleScroll);
    };
}
