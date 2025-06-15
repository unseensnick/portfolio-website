import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

/**
 * Calculates the scroll distance and estimated time needed for smooth scrolling
 */
function calculateScrollTime(element: Element): number {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = viewportHeight / 2;
    
    // Calculate distance to scroll
    const scrollDistance = Math.abs(elementCenter - viewportCenter);
    
    // Base time calculation: ~1ms per pixel, with min/max bounds
    const baseTime = Math.min(Math.max(scrollDistance * 1.2, 300), 1500);
    
    // Add extra time for elements that are far off-screen
    const isVisible = isElementProperlyVisible(element);
    const extraTime = isVisible ? 0 : 200;
    
    return baseTime + extraTime;
}

/**
 * Waits for scroll to complete using scroll event detection
 */
function waitForScrollComplete(element: Element): Promise<void> {
    return new Promise((resolve) => {
        if (isElementProperlyVisible(element)) {
            resolve();
            return;
        }
        
        let scrollTimeout: NodeJS.Timeout;
        const maxWaitTime = 2000; // Maximum wait time
        const scrollEndDelay = 100; // Time to wait after last scroll event
        
        const handleScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                window.removeEventListener('scroll', handleScroll);
                resolve();
            }, scrollEndDelay);
        };
        
        // Set maximum wait time
        const maxTimeout = setTimeout(() => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
            resolve();
        }, maxWaitTime);
        
        // Listen for scroll events
        window.addEventListener('scroll', handleScroll);
        
        // Start scrolling
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });
        
        // Trigger initial scroll check
        handleScroll();
    });
}

/**
 * Improved viewport detection with margin for better UX
 */
function isElementProperlyVisible(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // Add margin to viewport for better detection (10% on each side)
    const margin = Math.min(viewportHeight * 0.1, 100);
    
    // Check if element is reasonably visible within the viewport
    const isVerticallyVisible = rect.top >= -margin && rect.bottom <= viewportHeight + margin;
    const isHorizontallyVisible = rect.left >= -50 && rect.right <= viewportWidth + 50;
    
    // Also check if the element center is reasonably positioned
    const elementCenter = rect.top + rect.height / 2;
    const isCenterVisible = elementCenter >= margin && elementCenter <= viewportHeight - margin;
    
    return isVerticallyVisible && isHorizontallyVisible && isCenterVisible;
}

/**
 * Handles scrolling with calculated delay before showing popover
 */
async function handleScrollingWithDelay(element: Element, step: any, options: any): Promise<void> {
    const isVisible = isElementProperlyVisible(element);
    
    if (!isVisible) {
        // Element needs scrolling - handle the entire transition smoothly
        console.log(`[Tour] Scrolling to element: ${step.popover?.title}`);
        
        // First, hide any existing popover immediately
        const existingPopover = document.querySelector('.driver-popover');
        if (existingPopover) {
            (existingPopover as HTMLElement).style.display = 'none';
        }
        
        // Wait for scroll to complete
        await waitForScrollComplete(element);
        
        // Add small delay for visual stability
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Now show the popover smoothly
        const popover = document.querySelector('.driver-popover');
        if (popover) {
            (popover as HTMLElement).style.display = 'block';
            (popover as HTMLElement).style.opacity = '0';
            (popover as HTMLElement).style.transition = 'opacity 0.3s ease';
            
            // Force reflow then fade in
            (popover as HTMLElement).offsetHeight;
            (popover as HTMLElement).style.opacity = '1';
        }
    } else {
        // Element is already visible - show popover immediately without any delays
        console.log(`[Tour] Element already visible: ${step.popover?.title}`);
        
        // Small delay to prevent conflicts with driver.js internal timing
        await new Promise(resolve => setTimeout(resolve, 50));
        
        const popover = document.querySelector('.driver-popover');
        if (popover) {
            (popover as HTMLElement).style.display = 'block';
            (popover as HTMLElement).style.opacity = '1';
            (popover as HTMLElement).style.transition = 'opacity 0.2s ease';
        }
    }
}

/**
 * Tour step configuration for the portfolio website
 */
const tourSteps = [
    {
        element: '#home',
        popover: {
            title: 'Welcome to My Portfolio',
            description: 'This is the hero section where visitors get their first impression. It showcases my name, role, and a brief introduction to what I do.',
            side: 'bottom' as const,
            align: 'center' as const,
        }
    },
    {
        element: '[data-tour="hero-cta"]',
        popover: {
            title: 'Call-to-Action Buttons',
            description: 'These buttons allow visitors to quickly access my GitHub profile or jump to my projects section.',
            side: 'top' as const,
            align: 'center' as const,
        }
    },
    {
        element: '[data-tour="navigation"]',
        popover: {
            title: 'Navigation Menu',
            description: 'The navigation provides smooth scrolling to different sections of the portfolio. It\'s responsive and works on all devices.',
            side: 'bottom' as const,
            align: 'center' as const,
        }
    },
    {
        element: '#projects',
        popover: {
            title: 'Projects Showcase',
            description: 'This section highlights my best work, including a featured project and additional portfolio pieces with live demos and source code links.',
            side: 'bottom' as const,
            align: 'center' as const,
        }
    },
    {
        element: '[data-tour="featured-project"]',
        popover: {
            title: 'Featured Project',
            description: 'The featured project gets special prominence with a larger display, detailed description, and technology stack.',
            side: 'right' as const,
            align: 'center' as const,
        }
    },
    {
        element: '[data-tour="project-grid"]',
        popover: {
            title: 'Project Grid',
            description: 'Additional projects are displayed in a responsive grid layout, each with project details, technologies used, and links to demos.',
            side: 'bottom' as const,
            align: 'center' as const,
        }
    },
    {
        element: '#about',
        popover: {
            title: 'About Me',
            description: 'This section provides a deeper look into my background, skills, technologies I work with, and personal interests.',
            side: 'bottom' as const,
            align: 'center' as const,
        }
    },
    {
        element: '[data-tour="technologies"]',
        popover: {
            title: 'Technology Stack',
            description: 'A comprehensive list of technologies, frameworks, and tools I\'m proficient with, displayed as interactive badges.',
            side: 'right' as const,
            align: 'center' as const,
        }
    },
    {
        element: '#contact',
        popover: {
            title: 'Get In Touch',
            description: 'The contact section makes it easy for potential clients or employers to reach out via email or connect on GitHub.',
            side: 'bottom' as const,
            align: 'center' as const,
        }
    },
    {
        element: '[data-tour="footer"]',
        popover: {
            title: 'Footer',
            description: 'The footer completes the portfolio with copyright information and maintains the clean, professional design.',
            side: 'top' as const,
            align: 'center' as const,
        }
    }
];

/**
 * Configuration for the guided tour
 */
const tourConfig = {
    showProgress: true,
    progressText: 'Step {{current}} of {{total}}',
    allowKeyboardControl: true,
    overlayOpacity: 0.75,
    stagePadding: 12,
    stageRadius: 12,
    overlayColor: 'rgba(0, 0, 0, 0.75)',
    popoverClass: 'tour-popover',
    popoverOffset: 20,
    smoothScroll: false, // Disable driver.js built-in scrolling
    animate: false, // Disable driver.js animations to prevent conflicts
    
    // Hooks for automated progression
    onDeselected: (element: Element | undefined, step: any, options: any) => {
        console.log(`[Tour] Deselected step: ${step.popover?.title}`);
    }
};

/**
 * Creates and configures the driver instance
 */
export function createGuidedTour(automated: boolean = false) {
    const config = {
        ...tourConfig,
        steps: tourSteps,
        ...(automated && {
            // For automated tours (showcase videos)
            allowKeyboardControl: false,
        }),
        // Add hooks to control the highlighting and popover timing
        onBeforeHighlight: (element: Element | undefined, step: any, options: any) => {
            console.log(`[Tour] Before highlight: ${step.popover?.title}`);
            
            // Hide popover immediately to prevent blinking
            const popover = document.querySelector('.driver-popover');
            if (popover) {
                (popover as HTMLElement).style.display = 'none';
            }
        },
        
        onHighlighted: async (element: Element | undefined, step: any, options: any) => {
            console.log(`[Tour] Highlighted step: ${step.popover?.title}`);
            
            // Calculate and handle scrolling with delayed popover
            if (element) {
                const isVisible = isElementProperlyVisible(element);
                console.log(`[Tour] Element "${step.popover?.title}" is ${isVisible ? 'visible' : 'not visible'} - ${isVisible ? 'no scroll needed' : 'scrolling required'}`);
                await handleScrollingWithDelay(element, step, options);
            }
        },
    };

    return driver(config);
}

/**
 * Starts the guided tour
 */
export function startGuidedTour(automated: boolean = false) {
    const driverObj = createGuidedTour(automated);
    
    if (automated) {
        return startAutomatedTour(driverObj);
    } else {
        driverObj.drive();
        return driverObj;
    }
}

/**
 * Starts an automated tour that progresses automatically
 * Perfect for showcase videos
 */
export function startAutomatedTour(driverObj: any, stepDuration: number = 4000) {
    let currentStep = 0;
    const totalSteps = tourSteps.length;
    
    // Start the tour
    driverObj.drive(0);
    
    const progressToNextStep = () => {
        if (currentStep < totalSteps - 1) {
            currentStep++;
            
            // Calculate dynamic delay based on next element's scroll requirements
            const nextStepElement = document.querySelector(tourSteps[currentStep].element);
            let dynamicDelay = 50; // Reduced base delay for visible elements
            
            let isVisible = true; // Default to visible
            
            if (nextStepElement) {
                isVisible = isElementProperlyVisible(nextStepElement);
                
                if (!isVisible) {
                    // Add calculated scroll time to the delay
                    dynamicDelay += calculateScrollTime(nextStepElement);
                } else {
                    // Element is visible, use minimal delay
                    dynamicDelay = 50;
                }
            }
            
            // Move to next step with calculated delay
            setTimeout(() => {
                driverObj.moveTo(currentStep);
            }, dynamicDelay);
            
            // Schedule next step - use base duration for visible elements, extended for scrolling
            const nextStepDelay = isVisible ? stepDuration : stepDuration + dynamicDelay;
            setTimeout(progressToNextStep, nextStepDelay);
        } else {
            // Tour completed
            setTimeout(() => {
                driverObj.destroy();
                console.log('[Tour] Automated tour completed');
            }, stepDuration);
        }
    };
    
    // Start automatic progression with initial delay
    setTimeout(progressToNextStep, stepDuration);
    
    return driverObj;
}

/**
 * Utility function to check if tour should be shown
 */
export function shouldShowTour(): boolean {
    // Check if user has seen the tour before
    if (typeof window !== 'undefined') {
        const hasSeenTour = localStorage.getItem('portfolio-tour-seen');
        return !hasSeenTour;
    }
    return false;
}

/**
 * Mark tour as seen
 */
export function markTourAsSeen(): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem('portfolio-tour-seen', 'true');
    }
}

/**
 * Reset tour status (for testing)
 */
export function resetTourStatus(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('portfolio-tour-seen');
    }
}

/**
 * Tour control functions for manual control
 */
export const tourControls = {
    start: () => startGuidedTour(false),
    startAutomated: (duration?: number) => {
        const driverObj = createGuidedTour(true);
        return startAutomatedTour(driverObj, duration);
    },
    reset: resetTourStatus,
    shouldShow: shouldShowTour,
    markSeen: markTourAsSeen
}; 