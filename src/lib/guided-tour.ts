import { shouldUseDemoMode } from "@/lib/demo-utils";
import { logger } from "@/lib/utils";
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

// ===== TOUR TIMING CONSTANTS =====
// These constants control various timing aspects of the guided tour for easy tweaking



/** Default step duration for automated tours (in milliseconds) */
const DEFAULT_AUTOMATED_STEP_DURATION = 4000; // 4 seconds

// Create tour logger instance
const tourLogger = logger.createFeatureLogger("Tour");



/**
 * Improved viewport detection with margin for better UX
 */
function isElementProperlyVisible(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    const isInViewport = rect.top >= 0 && rect.left >= 0 && 
                        rect.bottom <= viewportHeight && rect.right <= viewportWidth;
    const hasSize = rect.width > 0 && rect.height > 0;
    const isVisible = window.getComputedStyle(element).visibility !== 'hidden' && 
                     window.getComputedStyle(element).display !== 'none';
    
    return isInViewport && hasSize && isVisible;
}

/**
 * Handles scrolling with calculated delay before showing popover
 */
async function handleScrollingWithDelay(element: Element, step: any): Promise<void> {
    const isVisible = isElementProperlyVisible(element);
    const extraTime = isVisible ? 0 : 200;
    
    if (!isVisible) {
        tourLogger.log(`Scrolling to element: ${step.popover?.title}`);
        element.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
        });
        
        await new Promise(resolve => setTimeout(resolve, 800 + extraTime));
    }
    
    // Show popover after scroll completes
    setTimeout(() => {
        const popover = document.querySelector('.driver-popover');
        if (popover) {
            (popover as HTMLElement).style.display = 'block';
        }
    }, 100);
}

/**
 * Temporarily shows navigation elements for tour demonstration
 */
function showNavigationForTour(stepTitle: string): () => void {
    tourLogger.log(`Attempting to show navigation for: ${stepTitle}`);
    
    if (stepTitle === 'Section Navigation Dots') {
        return showSectionNavForTour();
    }
    
    return () => {};
}

/**
 * Shows section navigation for tour step
 */
function showSectionNavForTour(): () => void {
    tourLogger.log('[Tour] Attempting to show section navigation...');
    
    const sectionNav = document.querySelector('[data-tour="section-navigation"]') as HTMLElement;
    if (!sectionNav) {
        tourLogger.log('[Tour] Section navigation not found in DOM');
        return () => {};
    }
    
    tourLogger.log('[Tour] Section navigation found, making it visible');
    
    // Store original styles
    const originalDisplay = sectionNav.style.display;
    const originalOpacity = sectionNav.style.opacity;
    const originalPointerEvents = sectionNav.style.pointerEvents;
    
    // Make visible for tour
    sectionNav.style.display = 'flex';
    sectionNav.style.opacity = '1';
    sectionNav.style.pointerEvents = 'auto';
    
    // Return cleanup function
    return () => {
        tourLogger.log('[Tour] Restoring section navigation original state');
        sectionNav.style.display = originalDisplay;
        sectionNav.style.opacity = originalOpacity;
        sectionNav.style.pointerEvents = originalPointerEvents;
    };
}

/**
 * Finds element by selector with fallback and logging
 */
function findTourElement(selector: string, title: string): Element {
    const element = document.querySelector(selector);
    if (!element) {
        tourLogger.warn(`Element not found for step "${title}": ${selector}`);
        // Log all elements with data-tour attribute for debugging
        const tourElements = document.querySelectorAll('[data-tour]');
        tourLogger.log('Available tour elements:', Array.from(tourElements).map(el => ({
            selector: el.getAttribute('data-tour'),
            tag: el.tagName,
            classes: el.className
        })));
        // Return document.body as fallback to prevent tour from breaking
        return document.body;
    }
    return element;
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
            popoverClass: 'tour-popover theme-toggle-popover',
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
    // Special step for mobile navigation - will be handled differently
    {
        element: 'body', // Temporary element, will be replaced
        popover: {
                    title: 'Mobile Navigation',
        description: 'This bottom navigation bar appears only on mobile devices, providing smooth section navigation with icons and active indicators.',
            side: 'bottom' as const,
            align: 'center' as const,
            popoverClass: 'tour-popover mobile-nav-popover',
        },
        special: 'mobile-navigation' // Special flag for custom handling
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
    let sectionNavCleanup: (() => void) | null = null;
    let driverInstance: any = null; // Store driver instance in closure
    
    const config = {
        ...tourConfig,
        steps: tourSteps.map(step => ({
            ...step,
            element: step.element === 'body' && step.special === 'mobile-navigation' 
                ? step.element 
                : () => findTourElement(step.element, step.popover.title)
        })),
        ...(automated && {
            // For automated tours (showcase videos)
            allowKeyboardControl: false,
        }),
        // Add hooks to control the highlighting and popover timing
        onBeforeHighlight: (element: Element | undefined, step: any) => {
            tourLogger.log(`Before highlight: ${step.popover?.title}`);
            
            // Hide popover immediately to prevent blinking
            const popover = document.querySelector('.driver-popover');
            if (popover) {
                (popover as HTMLElement).style.display = 'none';
            }
            
            // Handle special mobile navigation step
            if (step.special === 'mobile-navigation') {
                tourLogger.log('Handling special mobile navigation step');
                return; // Don't show navigation elements for this step
            }
            
            // Show navigation elements for specific steps
            if (step.popover?.title === 'Section Navigation Dots') {
                tourLogger.log(`Showing navigation for tour step: ${step.popover?.title}`);
                sectionNavCleanup = showNavigationForTour(step.popover?.title);
            }
        },
        
        onHighlighted: async (element: Element | undefined, step: any) => {
            tourLogger.log(`Highlighted step: ${step.popover?.title}`);
            tourLogger.log(`Element found:`, element);
            
            // Handle special mobile navigation step
            if (step.special === 'mobile-navigation') {
                tourLogger.log(`Handling special mobile navigation step with wrapper (automated: ${automated})`);
                
                // Pause automated tour if running (only for automated tours)
                if (automated && (window as any).pauseAutomatedTour) {
                    tourLogger.log('Pausing automated tour for mobile demo');
                    (window as any).pauseAutomatedTour();
                } else if (!automated) {
                    tourLogger.log('Manual tour - no need to pause automated progression');
                }
                
                // Switch to mobile view using the wrapper
                if ((window as any).toggleMobileDemo) {
                    tourLogger.log('Switching to mobile view via wrapper');
                    (window as any).toggleMobileDemo(true);
                    
                    // Wait a moment for the mobile view to activate
                    setTimeout(() => {
                        // Find the mobile navigation element
                        const mobileNav = document.querySelector('[data-tour="mobile-navigation"]');
                        tourLogger.log('Mobile navigation element found:', mobileNav);
                        tourLogger.log('All elements with data-tour attribute:', document.querySelectorAll('[data-tour]'));
                        
                        if (mobileNav && driverInstance) {
                            tourLogger.log('Mobile navigation found, mobile view is active');
                            
                            // Highlight the mobile navigation element
                            driverInstance.highlight({
                                element: mobileNav,
                                popover: {
                                    ...step.popover,
                                    popoverClass: 'tour-popover mobile-nav-popover'
                                }
                            });
                            
                            tourLogger.log('Mobile navigation configured with custom popover positioning');
                            
                            if (automated) {
                                tourLogger.log('Automated tour - will switch back after duration');
                                setTimeout(() => {
                                    tourLogger.log('Switching back to desktop view');
                                    if ((window as any).toggleMobileDemo) {
                                        (window as any).toggleMobileDemo(false);
                                    }
                                    
                                    // Wait for desktop view to activate, then continue tour
                                    setTimeout(() => {
                                        tourLogger.log('Mobile demo completed, continuing automated tour');
                                        if (driverInstance) {
                                            driverInstance.moveNext();
                                            // Resume automated tour progression
                                            if ((window as any).resumeAutomatedTourAfterMobile) {
                                                (window as any).resumeAutomatedTourAfterMobile();
                                            }
                                        }
                                    }, 500);
                                }, 3000);
                            } else {
                                tourLogger.log('Manual tour - user controls mobile/desktop mode');
                                tourLogger.log('Mobile view will remain active until user toggles or tour ends');
                                
                                // For manual tours, add a note to the popover about mobile controls
                                const popover = document.querySelector('.driver-popover');
                                if (popover) {
                                    const description = popover.querySelector('.driver-popover-description');
                                    if (description) {
                                        const originalText = description.textContent;
                                        description.innerHTML = `${originalText}<br><br><small><em>💡 Tip: You can toggle between mobile and desktop views using the demo controls while exploring the navigation.</em></small>`;
                                    }
                                }
                            }
                        } else {
                            tourLogger.log('Mobile navigation not found or driver not available');
                            // Resume tour if something went wrong
                            if (automated) {
                                // For automated tours, continue automatically
                                if ((window as any).resumeAutomatedTour) {
                                    (window as any).resumeAutomatedTour();
                                } else if (driverInstance) {
                                    driverInstance.moveNext();
                                }
                            } else {
                                // For manual tours, show a fallback message but don't auto-advance
                                tourLogger.log('Manual tour - Mobile navigation not found, continuing with body element');
                            }
                        }
                    }, 300); // Wait for mobile view to activate
                } else {
                    tourLogger.log('Mobile demo wrapper not available, skipping mobile step');
                    // Resume tour if wrapper not available
                    if (automated) {
                        // For automated tours, continue automatically
                        if ((window as any).resumeAutomatedTour) {
                            (window as any).resumeAutomatedTour();
                        } else if (driverInstance) {
                            driverInstance.moveNext();
                        }
                    } else {
                        // For manual tours, show a fallback message but don't auto-advance
                        tourLogger.log('Manual tour - mobile demo wrapper not available, continuing with body element');
                    }
                }
                return; // Don't continue with normal flow
            }
            
            // Calculate and handle scrolling with delayed popover
            if (element) {
                const isVisible = isElementProperlyVisible(element);
                tourLogger.log(`Element "${step.popover?.title}" is ${isVisible ? 'visible' : 'not visible'} - ${isVisible ? 'no scroll needed' : 'scrolling required'}`);
                await handleScrollingWithDelay(element, step);
            } else {
                tourLogger.log(`No element found for step: ${step.popover?.title}`);
            }
        },
        
        onDeselected: (element: Element | undefined, step: any) => {
            tourLogger.log(`Deselected step: ${step.popover?.title} (automated: ${automated})`);
            tourLogger.log(`Step special flag:`, step.special);
            
            // Clean up navigation when leaving navigation steps
            if (step.popover?.title === 'Section Navigation Dots' && sectionNavCleanup) {
                tourLogger.log(`Cleaning up navigation for: ${step.popover?.title}`);
                sectionNavCleanup();
                sectionNavCleanup = null;
            }
            
            // Switch back to desktop when leaving mobile navigation step
            if (step.special === 'mobile-navigation') {
                tourLogger.log(`Leaving mobile navigation step (automated: ${automated})`);
                
                // Hide popover immediately to prevent it from staying visible
                const popover = document.querySelector('.driver-popover');
                if (popover) {
                    (popover as HTMLElement).style.display = 'none';
                }
                
                // For manual tours, switch back to desktop when user progresses
                // For automated tours, do nothing - timing is handled in onHighlighted
                if (!automated) {
                    tourLogger.log('Manual tour - switching back to desktop as user progressed');
                    setTimeout(() => {
                        if ((window as any).toggleMobileDemo) {
                            (window as any).toggleMobileDemo(false);
                        }
                        // Move to next step after switching back to desktop
                        setTimeout(() => {
                            if (driverInstance) {
                                tourLogger.log('Moving to next step after desktop switch');
                                driverInstance.moveNext();
                            }
                        }, 200); // Small delay to ensure desktop view is active
                    }, 4000); // 4 second delay to view mobile navigation
                } else {
                    tourLogger.log('Automated tour - desktop switch timing handled by onHighlighted, not interfering');
                    // Do nothing - let the automated tour handle its own progression
                }
            }
        },
        
        onDestroyed: () => {
            // Clean up navigation if tour is destroyed
            if (sectionNavCleanup) {
                sectionNavCleanup();
                sectionNavCleanup = null;
            }
            
            // Switch back to desktop view if tour is destroyed while in mobile mode
            if ((window as any).toggleMobileDemo && (window as any).getMobileDemoState && (window as any).getMobileDemoState()) {
                tourLogger.log('Tour destroyed while in mobile mode - switching back to desktop');
                (window as any).toggleMobileDemo(false);
            }
            
            // Clean up global driver reference
            if ((window as any).currentTourDriver) {
                delete (window as any).currentTourDriver;
            }
        }
    };

    driverInstance = driver(config);
    
    // Store driver instance globally as well for compatibility
    (window as any).currentTourDriver = driverInstance;
    tourLogger.log('Driver instance created and stored:', driverInstance);
    
    return driverInstance;
}

/**
 * Starts the guided tour
 */
export function startGuidedTour(automated: boolean = false) {
    const driverObj = createGuidedTour(automated);
    
    // Store driver instance globally for resize callbacks
    (window as any).currentTourDriver = driverObj;
    tourLogger.log('Driver instance stored globally:', driverObj);
    
    if (automated) {
        return startAutomatedTour(driverObj);
    } else {
        // For manual tours, clear any leftover automated tour functions
        tourLogger.log('Starting manual tour - clearing automated tour functions');
        delete (window as any).pauseAutomatedTour;
        delete (window as any).resumeAutomatedTour;
        
        driverObj.drive();
        return driverObj;
    }
}

/**
 * Starts an automated tour that progresses automatically
 * Perfect for showcase videos
 */
export function startAutomatedTour(driverObj: any, stepDuration: number = DEFAULT_AUTOMATED_STEP_DURATION) {
    let currentStep = 0;
    const totalSteps = tourSteps.length;
    let progressTimeout: NodeJS.Timeout | null = null;
    
    // Store pause/resume functions globally for resize interactions
    (window as any).pauseAutomatedTour = () => {
        if (progressTimeout) {
            clearTimeout(progressTimeout);
            progressTimeout = null;
            tourLogger.log('Automated tour paused for resize interaction');
        }
    };
    
    (window as any).resumeAutomatedTour = () => {
        tourLogger.log('Attempting to resume automated tour');
        if (!progressTimeout) {
            tourLogger.log('Automated tour resumed after resize interaction');
            // Schedule next step with normal timing
            progressTimeout = setTimeout(progressToNextStep, stepDuration);
        } else {
            tourLogger.log('Automated tour was already running');
        }
    };
    
    // Function to resume automated tour after mobile step
    (window as any).resumeAutomatedTourAfterMobile = () => {
        tourLogger.log('Resuming automated tour progression after mobile step');
        // Continue with the normal progression from current step
        progressTimeout = setTimeout(progressToNextStep, stepDuration);
    };
    
    // Start the tour
    driverObj.drive(0);
    
    const progressToNextStep = () => {
        if (currentStep < totalSteps - 1) {
            currentStep++;
            
            // Check if this is the special mobile navigation step
            if (tourSteps[currentStep].special === 'mobile-navigation') {
                tourLogger.log('Reached mobile navigation step - automated progression will be paused');
                // Move to the mobile step
                setTimeout(() => {
                    driverObj.moveTo(currentStep);
                    // The mobile step will handle its own timing and resume the tour
                }, 50);
                return; // Don't schedule next step - it will be handled by mobile demo wrapper
            }
            
            // Calculate dynamic delay based on next element's scroll requirements
            const nextStepElement = document.querySelector(tourSteps[currentStep].element);
            let dynamicDelay = 50; // Reduced base delay for visible elements
            
            let isVisible = true; // Default to visible
            
            if (nextStepElement) {
                isVisible = isElementProperlyVisible(nextStepElement);
                
                if (!isVisible) {
                    // Add fixed scroll time for non-visible elements
                    dynamicDelay += 800;
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
            progressTimeout = setTimeout(progressToNextStep, nextStepDelay);
        } else {
            // Tour completed
            setTimeout(() => {
                driverObj.destroy();
                tourLogger.log('Automated tour completed');
            }, stepDuration);
        }
    };
    
    // Start automatic progression with initial delay
    progressTimeout = setTimeout(progressToNextStep, stepDuration);
    
    return driverObj;
}

/**
 * Check if demo mode is active via URL parameter or environment
 */
function isDemoMode(): boolean {
    if (typeof window === 'undefined') return false;
    
    const urlParams = new URLSearchParams(window.location.search);
    const searchParams = Object.fromEntries(urlParams.entries());
    
    const isDemo = shouldUseDemoMode(searchParams);
    
    if (isDemo) {
        tourLogger.log('Demo mode active - guided tour available');
    }
    
    return isDemo;
}

/**
 * Utility function to check if tour should be shown
 */
export function shouldShowTour(): boolean {
    // Only show tour in demo mode
    if (!isDemoMode()) {
        return false;
    }
    
    // In demo mode, check if user has seen the tour before
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
    start: () => {
        if (!isDemoMode()) {
            tourLogger.warn('Tour is only available in demo mode. Add ?demo to URL or run npm run demo');
            return null;
        }
        return startGuidedTour(false);
    },
    startAutomated: (duration?: number) => {
        if (!isDemoMode()) {
            tourLogger.warn('Tour is only available in demo mode. Add ?demo to URL or run npm run demo');
            return null;
        }
        const driverObj = createGuidedTour(true);
        return startAutomatedTour(driverObj, duration);
    },
    reset: resetTourStatus,
    shouldShow: shouldShowTour,
    markSeen: markTourAsSeen,
    isDemoMode: isDemoMode
};