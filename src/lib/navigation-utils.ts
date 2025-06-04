"use client";

interface Section {
    id: string;
    label: string;
}

/**
 * Scroll to a specific section with offset
 * @param sectionId - The ID of the section to scroll to
 * @param offset - Offset from the top in pixels
 * @param delay - Delay before scrolling in milliseconds
 */
export function scrollToSection(
    sectionId: string,
    offset = 0,
    delay = 0
): void {
    setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (!element) return;

        const top =
            element.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
            top,
            behavior: "smooth",
        });
    }, delay);
}

/**
 * Set up a scroll listener to update active section
 * @param sections - Array of sections with id and label
 * @param setActiveSection - State setter for active section
 * @param offset - Offset from the top in pixels
 * @returns Cleanup function
 */
export function setupScrollListener(
    sections: Section[],
    setActiveSection: (id: string) => void,
    offset = 0
): () => void {
    const handleScroll = () => {
        // Get current scroll position with offset
        const scrollPosition = window.scrollY + offset + 100;

        // Find the current section
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(sections[i].id);

            if (section && section.offsetTop <= scrollPosition) {
                setActiveSection(sections[i].id);
                break;
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
