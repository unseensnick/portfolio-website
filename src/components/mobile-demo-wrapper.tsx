"use client";

import { TourControls } from "@/components/tour-controls";
import { useDemoMode } from "@/hooks/use-demo-mode";
import { MobileOverrideProvider, useIsMobile } from "@/hooks/use-mobile";
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
    const isNativeMobile = useIsMobile(900);
    const isDemoMode = useDemoMode();

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

    // Apply CSS class to body when mobile view is active for styling mobile nav
    useEffect(() => {
        if (forceMobileView) {
            document.body.classList.add("mobile-demo-active");
        } else {
            document.body.classList.remove("mobile-demo-active");
        }

        // Cleanup on unmount
        return () => {
            document.body.classList.remove("mobile-demo-active");
        };
    }, [forceMobileView]);

    const content = (
        <div
            className={
                forceMobileView
                    ? "flex justify-center bg-muted/80 dark:bg-slate-900/90 min-h-screen relative"
                    : ""
            }
        >
            <div
                className={
                    forceMobileView
                        ? "max-w-[764px] w-full bg-background relative"
                        : "w-full"
                }
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
    );

    return (
        <>
            {/* Only provide MobileOverrideProvider when we actually want to override */}
            {forceMobileView ? (
                <MobileOverrideProvider forceMobile={true}>
                    {content}
                </MobileOverrideProvider>
            ) : (
                content
            )}

            {/* Desktop tour controls - only show when demo mode is active */}
            {isDemoMode &&
                showTourControls &&
                !forceMobileView &&
                !isNativeMobile && (
                    <div className="fixed bottom-4 right-4 z-50">
                        <TourControls
                            variant="desktop"
                            onMobileToggle={handleMobileToggle}
                        />
                    </div>
                )}
        </>
    );
}
