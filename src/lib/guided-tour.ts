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
        setTimeout(() => {
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
async function handleScrollingWithDelay(element: Element, step: any): Promise<void> {
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
            void (popover as HTMLElement).offsetHeight;
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
 * Temporarily shows navigation elements for tour demonstration
 */
function showNavigationForTour(stepTitle: string): () => void {
    console.log(`[Tour] Attempting to show navigation for: ${stepTitle}`);
    
    if (stepTitle === 'Instagram-Style Mobile Navigation') {
        return showInstagramNavForTour();
    }
    
    if (stepTitle === 'Section Navigation Dots') {
        return showSectionNavForTour();
    }
    
    return () => {};
}

/**
 * Temporarily shows Instagram navigation for tour demonstration
 */
function showInstagramNavForTour(): () => void {
    console.log('[Tour] Attempting to show Instagram navigation...');
    
    // First, try to find the Instagram nav component and force it to render
    const instagramNavContainer = document.querySelector('[data-tour="instagram-navigation"]') as HTMLElement;
    
    if (!instagramNavContainer) {
        console.log('[Tour] Instagram navigation not found in DOM - it may be conditionally rendered');
        
        // Try to force render by temporarily setting mobile state
        // This is a workaround for the conditional rendering
        const siteHeader = document.querySelector('header[data-tour="navigation"]');
        if (siteHeader) {
            // Create a temporary Instagram nav element for the tour
            const tempInstagramNav = document.createElement('div');
            tempInstagramNav.setAttribute('data-tour', 'instagram-navigation');
            tempInstagramNav.className = 'fixed bottom-0 left-0 right-0 z-60 tour-temp-instagram-nav';
            tempInstagramNav.innerHTML = `
                <div class="bg-background/95 backdrop-blur-xl border-t border-border/50">
                    <div class="pb-safe">
                        <nav class="flex items-center justify-around px-4 py-2">
                            <div class="text-xs text-muted-foreground text-center py-4">
                                Instagram-style Mobile Navigation<br/>
                                <span class="text-primary">(Mobile Only)</span>
                            </div>
                        </nav>
                    </div>
                </div>
            `;
            document.body.appendChild(tempInstagramNav);
            
            return () => {
                console.log('[Tour] Cleaning up temporary Instagram navigation');
                const tempNav = document.querySelector('.tour-temp-instagram-nav');
                if (tempNav) {
                    tempNav.remove();
                }
            };
        }
        
        return () => {};
    }
    
    console.log('[Tour] Instagram navigation found, making it visible');
    
    const originalDisplay = instagramNavContainer.style.display;
    const originalPosition = instagramNavContainer.style.position;
    const originalZIndex = instagramNavContainer.style.zIndex;
    const originalVisibility = instagramNavContainer.style.visibility;
    
    // Force show the Instagram nav
    instagramNavContainer.style.display = 'block';
    instagramNavContainer.style.position = 'fixed';
    instagramNavContainer.style.zIndex = '60'; // Higher than tour overlay
    instagramNavContainer.style.visibility = 'visible';
    
    // Return cleanup function
    return () => {
        console.log('[Tour] Restoring Instagram navigation original state');
        instagramNavContainer.style.display = originalDisplay;
        instagramNavContainer.style.position = originalPosition;
        instagramNavContainer.style.zIndex = originalZIndex;
        instagramNavContainer.style.visibility = originalVisibility;
    };
}

/**
 * Temporarily shows section navigation for tour demonstration
 */
function showSectionNavForTour(): () => void {
    console.log('[Tour] Attempting to show section navigation...');
    
    const sectionNav = document.querySelector('[data-tour="section-navigation"]') as HTMLElement;
    
    if (!sectionNav) {
        console.log('[Tour] Section navigation not found in DOM');
        return () => {};
    }
    
    console.log('[Tour] Section navigation found, making it visible');
    
    // Store original classes and styles
    const originalClasses = sectionNav.className;
    const originalDisplay = sectionNav.style.display;
    const originalZIndex = sectionNav.style.zIndex;
    
    // Force show the section nav by removing the hidden class and ensuring visibility
    sectionNav.className = originalClasses.replace('hidden lg:block', 'block');
    sectionNav.style.display = 'block';
    sectionNav.style.zIndex = '60'; // Higher than tour overlay
    
    // Return cleanup function
    return () => {
        console.log('[Tour] Restoring section navigation original state');
        sectionNav.className = originalClasses;
        sectionNav.style.display = originalDisplay;
        sectionNav.style.zIndex = originalZIndex;
    };
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
            title: 'Main Header Navigation',
            description: 'The main site header contains the logo and primary navigation. It includes both desktop navigation links and responsive design elements.',
            side: 'bottom' as const,
            align: 'center' as const,
        }
    },
    {
        element: '[data-tour="desktop-navigation"]',
        popover: {
            title: 'Desktop Navigation Menu',
            description: 'The desktop navigation provides smooth scrolling links to different portfolio sections. It features active state indicators and hover effects.',
            side: 'bottom' as const,
            align: 'center' as const,
        }
    },
    {
        element: '[data-tour="theme-toggle"]',
        popover: {
            title: 'Theme Toggle',
            description: 'The theme toggle allows users to switch between light and dark modes. It features smooth animations, remembers the user\'s preference, and automatically shows the system\'s preferred theme by default.',
            side: 'bottom' as const,
            align: 'center' as const,
        }
    },
    {
        element: '[data-tour="section-navigation"]',
        popover: {
            title: 'Section Navigation Dots',
            description: 'The right-side dot navigation provides quick access to different sections with visual indicators and tooltips. This appears only on larger screens.',
            side: 'left' as const,
            align: 'center' as const,
        }
    },
    {
        element: '[data-tour="instagram-navigation"]',
        popover: {
            title: 'Instagram-Style Mobile Navigation',
            description: 'This bottom navigation bar appears only on mobile devices, providing an Instagram-like experience with icons and smooth section navigation.',
            side: 'top' as const,
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
        element: '[data-tour="about-paragraphs"]',
        popover: {
            title: 'Personal Story',
            description: 'These paragraphs tell my professional story, background, and what drives me as a developer. They provide context about my journey and experience.',
            side: 'right' as const,
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
        element: '[data-tour="interests"]',
        popover: {
            title: 'Personal Interests',
            description: 'This section showcases my personal interests and passions outside of work, giving visitors a more complete picture of who I am.',
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
};

/**
 * Creates and configures the driver instance
 */
export function createGuidedTour(automated: boolean = false) {
    let instagramNavCleanup: (() => void) | null = null;
    
    const config = {
        ...tourConfig,
        steps: tourSteps,
        ...(automated && {
            // For automated tours (showcase videos)
            allowKeyboardControl: false,
        }),
        // Add hooks to control the highlighting and popover timing
        onBeforeHighlight: (element: Element | undefined, step: any) => {
            console.log(`[Tour] Before highlight: ${step.popover?.title}`);
            
            // Hide popover immediately to prevent blinking
            const popover = document.querySelector('.driver-popover');
            if (popover) {
                (popover as HTMLElement).style.display = 'none';
            }
            
            // Show navigation elements for specific steps
            if (step.popover?.title === 'Instagram-Style Mobile Navigation' || 
                step.popover?.title === 'Section Navigation Dots') {
                console.log(`[Tour] Showing navigation for tour step: ${step.popover?.title}`);
                instagramNavCleanup = showNavigationForTour(step.popover?.title);
            }
        },
        
        onHighlighted: async (element: Element | undefined, step: any) => {
            console.log(`[Tour] Highlighted step: ${step.popover?.title}`);
            console.log(`[Tour] Element found:`, element);
            
            // Calculate and handle scrolling with delayed popover
            if (element) {
                const isVisible = isElementProperlyVisible(element);
                console.log(`[Tour] Element "${step.popover?.title}" is ${isVisible ? 'visible' : 'not visible'} - ${isVisible ? 'no scroll needed' : 'scrolling required'}`);
                await handleScrollingWithDelay(element, step);
            } else {
                console.log(`[Tour] No element found for step: ${step.popover?.title}`);
            }
        },
        
        onDeselected: (element: Element | undefined, step: any) => {
            console.log(`[Tour] Deselected step: ${step.popover?.title}`);
            
            // Clean up navigation when leaving navigation steps
            if ((step.popover?.title === 'Instagram-Style Mobile Navigation' || 
                 step.popover?.title === 'Section Navigation Dots') && instagramNavCleanup) {
                console.log(`[Tour] Cleaning up navigation for: ${step.popover?.title}`);
                instagramNavCleanup();
                instagramNavCleanup = null;
            }
        },
        
        onDestroyed: () => {
            // Clean up Instagram navigation if tour is destroyed
            if (instagramNavCleanup) {
                instagramNavCleanup();
                instagramNavCleanup = null;
            }
        }
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