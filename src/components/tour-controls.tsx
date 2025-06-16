"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { tourControls } from "@/lib/guided-tour";
import {
    Monitor,
    Play,
    RotateCcw,
    Settings,
    Smartphone,
    Users,
    X,
    Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface TourControlsProps {
    className?: string;
    variant?: "desktop" | "mobile" | "compact";
    forceMobileView?: boolean;
    onMobileToggle?: (mobile: boolean) => void;
}

/**
 * Tour control buttons for starting manual or automated tours
 * Supports desktop, mobile, and compact variants
 */
export function TourControls({
    className,
    variant = "desktop",
    forceMobileView = false,
    onMobileToggle,
}: TourControlsProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [showMobileModal, setShowMobileModal] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [globalMobileState, setGlobalMobileState] = useState(false);
    const isDemoMode = tourControls.isDemoMode();
    const isMobile = useIsMobile();

    // Use global mobile state if no props provided (when used in site header)
    const currentMobileView = onMobileToggle
        ? forceMobileView
        : globalMobileState;
    const handleMobileToggleClick =
        onMobileToggle ||
        ((mobile: boolean) => {
            if ((window as any).toggleMobileDemo) {
                (window as any).toggleMobileDemo(mobile);
            }
        });

    useEffect(() => {
        setMounted(true);

        // Sync with global mobile state if no props provided
        if (!onMobileToggle) {
            const syncGlobalState = () => {
                if ((window as any).getMobileDemoState) {
                    setGlobalMobileState((window as any).getMobileDemoState());
                }
            };

            // Initial sync
            syncGlobalState();

            // Set up interval to sync state
            const interval = setInterval(syncGlobalState, 100);

            return () => clearInterval(interval);
        }
    }, [onMobileToggle]);

    const handleManualTour = () => {
        if (isRunning || !isDemoMode) return;
        setIsRunning(true);
        setShowMobileModal(false);

        const driverObj = tourControls.start();
        if (!driverObj) {
            setIsRunning(false);
            return;
        }

        const originalDestroy = driverObj.destroy;
        driverObj.destroy = function () {
            setIsRunning(false);
            originalDestroy.call(this);
        };
    };

    const handleAutomatedTour = () => {
        if (isRunning || !isDemoMode) return;
        setIsRunning(true);
        setShowMobileModal(false);

        const driverObj = tourControls.startAutomated(3000);
        if (!driverObj) {
            setIsRunning(false);
            return;
        }

        const originalDestroy = driverObj.destroy;
        driverObj.destroy = function () {
            setIsRunning(false);
            originalDestroy.call(this);
        };
    };

    const handleReset = () => {
        tourControls.reset();
        setShowMobileModal(false);
        alert("Tour status reset! The tour will show again for new visitors.");
    };

    if (!isDemoMode) {
        return null;
    }

    // Compact variant for mobile header integration
    if (variant === "compact") {
        return (
            <>
                <div className={`flex items-center gap-1 ${className}`}>
                    <Button
                        onClick={() => setShowMobileModal(true)}
                        disabled={isRunning}
                        size="sm"
                        variant="ghost"
                        className="h-9 w-9 p-0 hover:bg-muted/50"
                        title="Demo Controls"
                    >
                        <Zap className="size-4" />
                    </Button>
                </div>

                {/* Mobile Modal - Rendered via Portal */}
                {mounted &&
                    showMobileModal &&
                    createPortal(
                        <div
                            className="fixed inset-0 z-[9999] flex flex-col items-center justify-start p-4 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowMobileModal(false)}
                        >
                            <div
                                className="w-full max-w-sm bg-background border border-border rounded-2xl p-6 animate-in zoom-in-95 duration-300 shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-primary" />
                                        <h3 className="text-lg font-semibold">
                                            Demo Mode
                                        </h3>
                                    </div>
                                    <Button
                                        onClick={() =>
                                            setShowMobileModal(false)
                                        }
                                        size="sm"
                                        variant="ghost"
                                        className="size-8 p-0"
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {/* Mobile/Desktop Toggle */}
                                    <div className="pb-3 border-b border-border">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                View Mode
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() =>
                                                    handleMobileToggleClick(
                                                        false
                                                    )
                                                }
                                                size="sm"
                                                variant={
                                                    !currentMobileView
                                                        ? "default"
                                                        : "outline"
                                                }
                                                className="flex-1 justify-center gap-2"
                                            >
                                                <Monitor className="size-4" />
                                                Desktop
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    handleMobileToggleClick(
                                                        true
                                                    )
                                                }
                                                size="sm"
                                                variant={
                                                    currentMobileView
                                                        ? "default"
                                                        : "outline"
                                                }
                                                className="flex-1 justify-center gap-2"
                                            >
                                                <Smartphone className="size-4" />
                                                Mobile
                                            </Button>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleManualTour}
                                        disabled={isRunning}
                                        size="default"
                                        variant="outline"
                                        className="w-full justify-start gap-3 h-12"
                                    >
                                        <Users className="size-4" />
                                        Start Interactive Tour
                                    </Button>

                                    <Button
                                        onClick={handleAutomatedTour}
                                        disabled={isRunning}
                                        size="default"
                                        variant="outline"
                                        className="w-full justify-start gap-3 h-12"
                                    >
                                        <Play className="size-4" />
                                        Auto Demo (3s intervals)
                                    </Button>

                                    <Button
                                        onClick={handleReset}
                                        disabled={isRunning}
                                        size="default"
                                        variant="ghost"
                                        className="w-full justify-start gap-3 h-10 text-muted-foreground"
                                    >
                                        <RotateCcw className="size-4" />
                                        Reset Tour Status
                                    </Button>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}
            </>
        );
    }

    // Mobile variant with better touch targets
    if (variant === "mobile" || (variant === "desktop" && isMobile)) {
        return (
            <div className={`flex flex-col gap-3 ${className}`}>
                <div className="flex items-center gap-2 mb-2">
                    <Zap className="size-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                        Demo Mode
                    </span>
                </div>

                <div className="flex flex-col gap-2">
                    <Button
                        onClick={handleManualTour}
                        disabled={isRunning}
                        size="default"
                        variant="outline"
                        className="w-full justify-start gap-3 h-12"
                    >
                        <Users className="size-4" />
                        Start Interactive Tour
                    </Button>

                    <Button
                        onClick={handleAutomatedTour}
                        disabled={isRunning}
                        size="default"
                        variant="outline"
                        className="w-full justify-start gap-3 h-12"
                    >
                        <Play className="size-4" />
                        Auto Demo (4s intervals)
                    </Button>

                    <Button
                        onClick={handleReset}
                        disabled={isRunning}
                        size="default"
                        variant="ghost"
                        className="w-full justify-start gap-3 h-10 text-muted-foreground"
                    >
                        <RotateCcw className="size-4" />
                        Reset Tour Status
                    </Button>
                </div>
            </div>
        );
    }

    // Desktop variant with mobile toggle
    return (
        <div
            className={`bg-background/95 backdrop-blur-sm border border-border/60 rounded-xl p-3 shadow-xl ${className}`}
        >
            {/* Mobile/Desktop Toggle - Compact horizontal layout */}
            <div className="flex items-center gap-1 mb-3">
                <Button
                    onClick={() => handleMobileToggleClick(false)}
                    size="sm"
                    variant={!currentMobileView ? "default" : "outline"}
                    className="h-8 px-3 text-xs"
                >
                    <Monitor className="size-3 mr-1" />
                    Desktop
                </Button>
                <Button
                    onClick={() => handleMobileToggleClick(true)}
                    size="sm"
                    variant={currentMobileView ? "default" : "outline"}
                    className="h-8 px-3 text-xs"
                >
                    <Smartphone className="size-3 mr-1" />
                    Mobile
                </Button>
            </div>

            {/* Tour Controls - Vertical stack for better organization */}
            <div className="flex flex-col gap-1">
                <Button
                    onClick={handleManualTour}
                    disabled={isRunning}
                    size="sm"
                    variant="outline"
                    className="h-8 justify-start text-xs"
                >
                    <Users className="size-3 mr-2" />
                    Start Tour
                </Button>

                <Button
                    onClick={handleAutomatedTour}
                    disabled={isRunning}
                    size="sm"
                    variant="outline"
                    className="h-8 justify-start text-xs"
                >
                    <Play className="size-3 mr-2" />
                    Auto Demo
                </Button>

                <Button
                    onClick={handleReset}
                    disabled={isRunning}
                    size="sm"
                    variant="ghost"
                    className="h-8 justify-start text-xs text-muted-foreground hover:text-foreground"
                >
                    <RotateCcw className="size-3 mr-2" />
                    Reset
                </Button>
            </div>
        </div>
    );
}
