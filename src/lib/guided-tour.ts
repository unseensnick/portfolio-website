import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

// ===== TOUR TIMING CONSTANTS =====
// These constants control various timing aspects of the guided tour for easy tweaking

/** Duration to show the Instagram navigation step (in milliseconds) */
const INSTAGRAM_STEP_DURATION = 4000; // 5 seconds

/** Delay after desktop resize before continuing tour (in milliseconds) */
const DESKTOP_RESIZE_DELAY = 100; // 100ms - minimal delay to reduce dimming time

/** Mobile breakpoint width for responsive behavior */
const MOBILE_BREAKPOINT = 765; // pixels

/** Default step duration for automated tours (in milliseconds) */
const DEFAULT_AUTOMATED_STEP_DURATION = 4000; // 4 seconds

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
 * Creates a resize instruction overlay for the tour
 */
function createResizeInstructionOverlay(targetWidth: 'mobile' | 'desktop', onComplete: () => void): () => void {
    const overlay = document.createElement('div');
    overlay.className = 'tour-resize-overlay';

    const content = document.createElement('div');
    content.className = 'tour-resize-overlay-content';

    const title = document.createElement('h3');
    title.className = 'tour-resize-overlay-title';

    const description = document.createElement('p');
    description.className = 'tour-resize-overlay-description';

    const currentWidth = document.createElement('div');
    currentWidth.className = 'tour-resize-overlay-current-width';

    if (targetWidth === 'mobile') {
        title.textContent = 'Resize Browser to Mobile View';
        description.textContent = `Please resize your browser window to ${MOBILE_BREAKPOINT}px or smaller to see the mobile navigation. The tour will automatically continue when the mobile view is detected.`;
    } else {
        title.textContent = 'Resize Browser to Desktop View';
        description.textContent = `Please resize your browser window to larger than ${MOBILE_BREAKPOINT}px to return to desktop view. The tour will automatically continue when the desktop view is detected.`;
    }

    const updateCurrentWidth = () => {
        const width = window.innerWidth;
        currentWidth.textContent = `Current width: ${width}px (${targetWidth === 'mobile' ? `Need ≤${MOBILE_BREAKPOINT}px` : `Need >${MOBILE_BREAKPOINT}px`})`;
        
        // Check if target width is reached
        if (targetWidth === 'mobile' && width <= MOBILE_BREAKPOINT) {
            cleanup();
            setTimeout(onComplete, 500); // Small delay for UI to update
        } else if (targetWidth === 'desktop' && width > MOBILE_BREAKPOINT) {
            cleanup();
            setTimeout(onComplete, 500); // Small delay for UI to update
        }
    };

    const cleanup = () => {
        window.removeEventListener('resize', updateCurrentWidth);
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    };

    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(currentWidth);
    overlay.appendChild(content);
    document.body.appendChild(overlay);

    // Update width display and listen for changes
    updateCurrentWidth();
    window.addEventListener('resize', updateCurrentWidth);

    return cleanup;
}

/**
 * Temporarily shows navigation elements for tour demonstration
 */
function showNavigationForTour(stepTitle: string): () => void {
    console.log(`[Tour] Attempting to show navigation for: ${stepTitle}`);
    
    if (stepTitle === 'Section Navigation Dots') {
        return showSectionNavForTour();
    }
    
    return () => {};
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
            title: 'Instagram-Style Mobile Navigation',
            description: 'This bottom navigation bar appears only on mobile devices, providing an Instagram-like experience with icons and smooth section navigation.',
            side: 'top' as const,
            align: 'center' as const,
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
    let resizeOverlayCleanup: (() => void) | null = null;
    let driverInstance: any = null; // Store driver instance in closure
    
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
            
            // Handle special mobile navigation step
            if (step.special === 'mobile-navigation') {
                console.log('[Tour] Handling special mobile navigation step');
                return; // Don't show navigation elements for this step
            }
            
            // Show navigation elements for specific steps
            if (step.popover?.title === 'Section Navigation Dots') {
                console.log(`[Tour] Showing navigation for tour step: ${step.popover?.title}`);
                sectionNavCleanup = showNavigationForTour(step.popover?.title);
            }
        },
        
        onHighlighted: async (element: Element | undefined, step: any) => {
            console.log(`[Tour] Highlighted step: ${step.popover?.title}`);
            console.log(`[Tour] Element found:`, element);
            
            // Handle special mobile navigation step
            if (step.special === 'mobile-navigation') {
                console.log('[Tour] Starting mobile navigation resize flow');
                
                // Hide the driver popover
                const popover = document.querySelector('.driver-popover');
                if (popover) {
                    (popover as HTMLElement).style.display = 'none';
                }
                
                // Check current width
                const currentWidth = window.innerWidth;
                
                if (currentWidth > MOBILE_BREAKPOINT) {
                    // Pause automated tour if running
                    if ((window as any).pauseAutomatedTour) {
                        (window as any).pauseAutomatedTour();
                    }
                    
                    // Show resize instruction for mobile
                    resizeOverlayCleanup = createResizeInstructionOverlay('mobile', () => {
                        console.log('[Tour] Mobile width detected, showing Instagram navigation');
                        
                                                // Find the actual Instagram navigation element
                        const instagramNav = document.querySelector('[data-tour="instagram-navigation"]');
                        console.log('[Tour] Instagram navigation element found:', instagramNav);
                        
                        if (instagramNav) {
                            console.log('[Tour] Instagram navigation found, proceeding with highlight');
                            // Update the step element to point to the actual Instagram nav
                            step.element = '[data-tour="instagram-navigation"]';
                            
                            // Use driver instance from closure
                            console.log('[Tour] Driver instance check (closure):', driverInstance);
                            console.log('[Tour] Driver instance check (global):', (window as any).currentTourDriver);
                            
                            if (driverInstance) {
                                console.log('[Tour] Driver instance found, highlighting Instagram nav immediately');
                                // Force driver to recalculate position for new viewport
                                driverInstance.highlight({
                                    element: '[data-tour="instagram-navigation"]',
                                    popover: {
                                        title: 'Instagram-Style Mobile Navigation',
                                        description: 'This bottom navigation bar appears only on mobile devices, providing an Instagram-like experience with icons and smooth section navigation.',
                                        side: 'top',
                                        align: 'center',
                                    }
                                });
                                
                                console.log('[Tour] Instagram navigation highlighted, starting 8-second timer');
                                // After showing Instagram nav, prepare for desktop resize
                                setTimeout(() => {
                                    console.log('[Tour] Preparing for desktop resize instruction');
                                    
                                    // Hide popover before showing resize instruction
                                    const popover = document.querySelector('.driver-popover');
                                    if (popover) {
                                        (popover as HTMLElement).style.display = 'none';
                                    }
                                    
                                    console.log('[Tour] Showing desktop resize instruction overlay');
                                    // Show resize instruction for desktop
                                    resizeOverlayCleanup = createResizeInstructionOverlay('desktop', () => {
                                        console.log('[Tour] Desktop width detected, continuing tour');
                                        
                                        // Resume automated tour after a delay to allow UI to settle
                                        setTimeout(() => {
                                            console.log('[Tour] Desktop width detected, attempting to resume automated tour');
                                            if ((window as any).resumeAutomatedTour) {
                                                (window as any).resumeAutomatedTour();
                                            } else {
                                                console.log('[Tour] Resume function not available');
                                                // If automated tour resume not available, manually move to next step
                                                if (driverInstance) {
                                                    driverInstance.moveNext();
                                                }
                                            }
                                        }, DESKTOP_RESIZE_DELAY); // Minimal delay to reduce dimming time
                                    });
                                }, INSTAGRAM_STEP_DURATION); // Show Instagram nav
                            } else {
                                console.log('[Tour] Driver instance not found, trying to continue without highlighting');
                                // If driver not found, just continue to next step
                                setTimeout(() => {
                                    // Try to get driver from global as fallback
                                    const fallbackDriver = (window as any).currentTourDriver || driverInstance;
                                    if (fallbackDriver) {
                                        console.log('[Tour] Using fallback driver to continue');
                                        fallbackDriver.moveNext();
                                    } else {
                                        console.log('[Tour] No driver instance available, cannot continue');
                                    }
                                    
                                    // Resume automated tour
                                    if ((window as any).resumeAutomatedTour) {
                                        (window as any).resumeAutomatedTour();
                                    }
                                }, 1000);
                            }
                        } else {
                            console.log('[Tour] Instagram navigation not found, continuing tour');
                            // Continue to next step if Instagram nav not found
                            const driverInstance = (window as any).currentTourDriver;
                            if (driverInstance) {
                                console.log('[Tour] Moving to next step since Instagram nav not found');
                                driverInstance.moveNext();
                                
                                // Resume automated tour
                                if ((window as any).resumeAutomatedTour) {
                                    (window as any).resumeAutomatedTour();
                                }
                            }
                        }
                    });
                } else {
                    // Already in mobile view, pause automated tour if running
                    console.log('[Tour] Already in mobile view, pausing automated tour');
                    if ((window as any).pauseAutomatedTour) {
                        (window as any).pauseAutomatedTour();
                    }
                    
                    // Show Instagram nav directly
                    const instagramNav = document.querySelector('[data-tour="instagram-navigation"]');
                    console.log('[Tour] Instagram navigation element found (already mobile):', instagramNav);
                    
                    if (instagramNav) {
                        console.log('[Tour] Instagram navigation found, highlighting directly');
                        console.log('[Tour] Driver instance check (already mobile - closure):', driverInstance);
                        console.log('[Tour] Driver instance check (already mobile - global):', (window as any).currentTourDriver);
                        
                        if (driverInstance) {
                            console.log('[Tour] Driver instance found, highlighting Instagram nav (already mobile)');
                            // Force driver to recalculate position for mobile viewport
                            driverInstance.highlight({
                                element: '[data-tour="instagram-navigation"]',
                                popover: {
                                    title: 'Instagram-Style Mobile Navigation',
                                    description: 'This bottom navigation bar appears only on mobile devices, providing an Instagram-like experience with icons and smooth section navigation.',
                                    side: 'top',
                                    align: 'center',
                                }
                            });
                            
                            console.log('[Tour] Instagram navigation highlighted (already mobile), starting 8-second timer');
                            // After showing Instagram nav, prepare for desktop resize
                            setTimeout(() => {
                                console.log('[Tour] Preparing for desktop resize instruction (already mobile)');
                                
                                // Hide popover before showing resize instruction
                                const popover = document.querySelector('.driver-popover');
                                if (popover) {
                                    (popover as HTMLElement).style.display = 'none';
                                }
                                
                                console.log('[Tour] Showing desktop resize instruction overlay (already mobile)');
                                // Show resize instruction for desktop
                                resizeOverlayCleanup = createResizeInstructionOverlay('desktop', () => {
                                    console.log('[Tour] Desktop width detected, continuing tour');
                                    
                                    // Resume automated tour after a delay to allow UI to settle
                                    setTimeout(() => {
                                        console.log('[Tour] Desktop width detected (already mobile), attempting to resume automated tour');
                                        if ((window as any).resumeAutomatedTour) {
                                            (window as any).resumeAutomatedTour();
                                        } else {
                                            console.log('[Tour] Resume function not available');
                                            // If automated tour resume not available, manually move to next step
                                            if (driverInstance) {
                                                driverInstance.moveNext();
                                            }
                                        }
                                    }, DESKTOP_RESIZE_DELAY); // Minimal delay to reduce dimming time
                                });
                            }, INSTAGRAM_STEP_DURATION); // Show Instagram nav
                        } else {
                            console.log('[Tour] Driver instance not found (already mobile)');
                        }
                    } else {
                        console.log('[Tour] Instagram navigation not found (already mobile), continuing tour');
                        if (driverInstance) {
                            driverInstance.moveNext();
                            
                            // Resume automated tour
                            if ((window as any).resumeAutomatedTour) {
                                (window as any).resumeAutomatedTour();
                            }
                        } else {
                            console.log('[Tour] No driver instance available (already mobile)');
                        }
                    }
                }
                return; // Don't continue with normal flow
            }
            
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
            if (step.popover?.title === 'Section Navigation Dots' && sectionNavCleanup) {
                console.log(`[Tour] Cleaning up navigation for: ${step.popover?.title}`);
                sectionNavCleanup();
                sectionNavCleanup = null;
            }
            
            // Clean up resize overlay if it exists
            if (resizeOverlayCleanup) {
                resizeOverlayCleanup();
                resizeOverlayCleanup = null;
            }
        },
        
        onDestroyed: () => {
            // Clean up navigation if tour is destroyed
            if (sectionNavCleanup) {
                sectionNavCleanup();
                sectionNavCleanup = null;
            }
            
            // Clean up resize overlay if it exists
            if (resizeOverlayCleanup) {
                resizeOverlayCleanup();
                resizeOverlayCleanup = null;
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
    console.log('[Tour] Driver instance created and stored:', driverInstance);
    
    return driverInstance;
}

/**
 * Starts the guided tour
 */
export function startGuidedTour(automated: boolean = false) {
    const driverObj = createGuidedTour(automated);
    
    // Store driver instance globally for resize callbacks
    (window as any).currentTourDriver = driverObj;
    console.log('[Tour] Driver instance stored globally:', driverObj);
    
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
export function startAutomatedTour(driverObj: any, stepDuration: number = DEFAULT_AUTOMATED_STEP_DURATION) {
    let currentStep = 0;
    const totalSteps = tourSteps.length;
    let progressTimeout: NodeJS.Timeout | null = null;
    
    // Store pause/resume functions globally for resize interactions
    (window as any).pauseAutomatedTour = () => {
        if (progressTimeout) {
            clearTimeout(progressTimeout);
            progressTimeout = null;
            console.log('[Tour] Automated tour paused for resize interaction');
        }
    };
    
    (window as any).resumeAutomatedTour = () => {
        console.log('[Tour] Attempting to resume automated tour');
        if (!progressTimeout) {
            console.log('[Tour] Automated tour resumed after resize interaction');
            // Schedule next step with normal timing
            progressTimeout = setTimeout(progressToNextStep, stepDuration);
        } else {
            console.log('[Tour] Automated tour was already running');
        }
    };
    
    // Start the tour
    driverObj.drive(0);
    
    const progressToNextStep = () => {
        if (currentStep < totalSteps - 1) {
            currentStep++;
            
            // Check if this is the special mobile navigation step
            if (tourSteps[currentStep].special === 'mobile-navigation') {
                console.log('[Tour] Reached mobile navigation step - automated progression will be paused');
                // Don't schedule next step - it will be handled by resize callbacks
                setTimeout(() => {
                    driverObj.moveTo(currentStep);
                }, 50);
                return;
            }
            
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
            progressTimeout = setTimeout(progressToNextStep, nextStepDelay);
        } else {
            // Tour completed
            setTimeout(() => {
                driverObj.destroy();
                console.log('[Tour] Automated tour completed');
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
    const hasDemo = urlParams.has('demo');
    const isDemoEnv = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
    
    const isDemo = hasDemo || isDemoEnv;
    
    if (isDemo) {
        console.log('[Tour] Demo mode active - guided tour available');
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
            console.warn('[Tour] Tour is only available in demo mode. Add ?demo to URL or run npm run demo');
            return null;
        }
        return startGuidedTour(false);
    },
    startAutomated: (duration?: number) => {
        if (!isDemoMode()) {
            console.warn('[Tour] Tour is only available in demo mode. Add ?demo to URL or run npm run demo');
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