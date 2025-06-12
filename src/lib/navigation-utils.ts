"use client";

export interface Section {
    id: string;
    label: string;
    icon?: string;
}

/**
 * Smoothly scrolls to a section with mobile-specific behavior
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

        if (isMobile) {
            const headerHeight = 40;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // For last section on mobile, scroll to bottom to avoid navigation overlap
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

        // Desktop behavior
        const top =
            element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
            top,
            behavior: "smooth",
        });
    }, delay);
}

function isLastSection(sectionId: string): boolean {
    const section = document.getElementById(sectionId);
    if (!section) return false;

    const allSections = Array.from(document.querySelectorAll("[id]"));
    const visibleSections = allSections.filter((el) => {
        const style = window.getComputedStyle(el);
        return style.display !== "none" && style.visibility !== "hidden";
    });

    visibleSections.sort((a, b) => {
        return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
    });

    return visibleSections[visibleSections.length - 1]?.id === sectionId;
}

/**
 * Tracks which section is currently in view and updates active state
 * Returns cleanup function to remove the scroll listener
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

        // Always highlight last section when user scrolls to bottom
        const isAtBottom =
            Math.ceil(currentScrollY + windowHeight) >= documentHeight - 10;

        if (isAtBottom && sections.length > 0) {
            setActiveSection(sections[sections.length - 1].id);
            return;
        }

        // Determine which section is currently in view
        const scrollPosition = currentScrollY + (isMobile ? 150 : offset + 100);

        for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(sections[i].id);

            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

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

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Run immediately to set initial active section

    return () => window.removeEventListener("scroll", handleScroll);
}