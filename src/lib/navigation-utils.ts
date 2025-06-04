"use client";

export interface Section {
    id: string;
    label: string;
    icon?: string;
}

/**
 * Scroll to a specific section with configurable options
 * @param sectionId - The ID of the section to scroll to
 * @param offset - Offset from the top in pixels
 * @param delay - Delay before scrolling in milliseconds
 * @param isMobile - Whether the current view is mobile
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
 * Check if a section is the last one in the document
 * @param sectionId - The ID of the section to check
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
 * Set up a scroll listener to update active section
 * @param sections - Array of sections with id and label
 * @param setActiveSection - State setter for active section
 * @param offset - Offset from the top in pixels
 * @param isMobile - Whether the current view is mobile
 * @returns Cleanup function
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

        // Find the current section
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
