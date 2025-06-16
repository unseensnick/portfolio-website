"use client";

import { TourControls } from "@/components/tour-controls";
import { MobileOverrideProvider } from "@/hooks/use-mobile";
import { createConditionalClasses } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface MobileDemoWrapperProps {
    children: React.ReactNode;
    showTourControls?: boolean;
    onMobileToggle?: (isMobile: boolean) => void;
}

/**
 * Wrapper component that provides mobile override context and tour controls
 * This allows toggling mobile view for demo purposes, especially for the mobile navigation tour step
 * When mobile view is active, constrains content to 764px max-width and centers it
 */
export function MobileDemoWrapper({
    children,
    showTourControls = false,
    onMobileToggle,
}: MobileDemoWrapperProps) {
    const [forceMobileView, setForceMobileView] = useState(false);

    // Expose mobile toggle function globally for tour integration
    useEffect(() => {
        (window as any).toggleMobileDemo = (mobile: boolean) => {
            setForceMobileView(mobile);
            onMobileToggle?.(mobile);
        };

        // Also expose the current state and toggle function
        (window as any).getMobileDemoState = () => forceMobileView;
        (window as any).toggleMobileDemoState = () => {
            const newState = !forceMobileView;
            setForceMobileView(newState);
            onMobileToggle?.(newState);
        };

        return () => {
            delete (window as any).toggleMobileDemo;
            delete (window as any).getMobileDemoState;
            delete (window as any).toggleMobileDemoState;
        };
    }, [onMobileToggle, forceMobileView]);

    // Expose toggle function for TourControls to use
    const handleMobileToggle = (mobile: boolean) => {
        setForceMobileView(mobile);
        onMobileToggle?.(mobile);
    };

    // Apply custom styles to mobile navigation when mobile view is active
    useEffect(() => {
        const mobileNav = document.querySelector(
            '[data-tour="mobile-navigation"]'
        ) as HTMLElement;

        if (mobileNav) {
            if (forceMobileView) {
                // Store original styles
                const originalLeft = mobileNav.style.left;
                const originalRight = mobileNav.style.right;
                const originalTransform = mobileNav.style.transform;
                const originalMaxWidth = mobileNav.style.maxWidth;

                // Apply constrained styles
                mobileNav.style.left = "50%";
                mobileNav.style.right = "auto";
                mobileNav.style.transform = "translateX(-50%)";
                mobileNav.style.maxWidth = "764px";
                mobileNav.style.width = "100%";

                // Cleanup function to restore original styles
                return () => {
                    mobileNav.style.left = originalLeft;
                    mobileNav.style.right = originalRight;
                    mobileNav.style.transform = originalTransform;
                    mobileNav.style.maxWidth = originalMaxWidth;
                };
            }
        }
    }, [forceMobileView]);

    return (
        <MobileOverrideProvider forceMobile={forceMobileView}>
            <div
                className={createConditionalClasses(
                    forceMobileView,
                    "flex justify-center bg-muted/80 dark:bg-slate-900/90 min-h-screen relative"
                )}
            >
                <div
                    className={createConditionalClasses(
                        forceMobileView,
                        "max-w-[764px] w-full bg-background relative",
                        "w-full"
                    )}
                    style={forceMobileView ? { minHeight: "100vh" } : {}}
                >
                    {children}
                </div>

                {/* Subtle border overlay - on top of everything */}
                {forceMobileView && (
                    <div
                        className="absolute inset-0 pointer-events-none z-[9999]"
                        style={{
                            maxWidth: "764px",
                            margin: "0 auto",
                            boxShadow:
                                "inset 1px 0 0 rgba(147, 51, 234, 0.08), inset -1px 0 0 rgba(147, 51, 234, 0.08)",
                            minHeight: "100vh",
                        }}
                    />
                )}
            </div>

            {/* Desktop tour controls - only show when mobile wrapper is NOT active */}
            {showTourControls && !forceMobileView && (
                <div className="fixed bottom-4 right-4 z-50">
                    <TourControls
                        variant="desktop"
                        onMobileToggle={handleMobileToggle}
                    />
                </div>
            )}
        </MobileOverrideProvider>
    );
}
