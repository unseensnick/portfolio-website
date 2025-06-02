/**
 * Navigation utility functions for consistent scrolling behavior
 * across all navigation components
 */

/**
 * Smoothly scrolls to a target section with proper header offset
 * @param {string} sectionId - The ID of the target section
 * @param {number} headerOffset - Offset to account for fixed header (default: 80)
 * @param {number} extraOffset - Additional offset for fine-tuning (default: 0)
 */
export function scrollToSection(sectionId, headerOffset = 80, extraOffset = 0) {
    const element = document.getElementById(sectionId);
    if (element) {
        const elementPosition = element.offsetTop - headerOffset + extraOffset;

        window.scrollTo({
            top: elementPosition,
            behavior: "smooth",
        });
    }
}

/**
 * Determines the currently active section based on scroll position
 * @param {Array} sections - Array of section objects with id property
 * @param {number} scrollOffset - Offset for scroll position calculation (default: 100)
 * @returns {string} The ID of the active section
 */
export function getActiveSection(sections, scrollOffset = 100) {
    const scrollPosition = window.scrollY + scrollOffset;

    // Find the current section based on scroll position
    for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section) {
            const sectionTop = section.offsetTop;
            if (scrollPosition >= sectionTop) {
                return sections[i].id;
            }
        }
    }

    // Return first section as fallback
    return sections[0]?.id || "";
}

/**
 * Sets up scroll listener for active section detection
 * @param {Array} sections - Array of section objects
 * @param {Function} setActiveSection - State setter for active section
 * @param {number} scrollOffset - Offset for scroll position calculation
 * @returns {Function} Cleanup function to remove event listener
 */
export function setupScrollListener(
    sections,
    setActiveSection,
    scrollOffset = 100
) {
    const handleScroll = () => {
        const activeId = getActiveSection(sections, scrollOffset);
        setActiveSection(activeId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
}
