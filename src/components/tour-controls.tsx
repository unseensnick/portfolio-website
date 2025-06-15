"use client";

import { Button } from "@/components/ui/button";
import { tourControls } from "@/lib/guided-tour";
import { Play, RotateCcw, Users } from "lucide-react";
import { useState } from "react";

interface TourControlsProps {
    className?: string;
}

/**
 * Tour control buttons for starting manual or automated tours
 */
export function TourControls({ className }: TourControlsProps) {
    const [isRunning, setIsRunning] = useState(false);

    const handleManualTour = () => {
        if (isRunning) return;
        setIsRunning(true);

        const driverObj = tourControls.start();

        const originalDestroy = driverObj.destroy;
        driverObj.destroy = function () {
            setIsRunning(false);
            originalDestroy.call(this);
        };
    };

    const handleAutomatedTour = () => {
        if (isRunning) return;
        setIsRunning(true);

        const driverObj = tourControls.startAutomated(3000);

        const originalDestroy = driverObj.destroy;
        driverObj.destroy = function () {
            setIsRunning(false);
            originalDestroy.call(this);
        };
    };

    const handleReset = () => {
        tourControls.reset();
        alert("Tour status reset! The tour will show again for new visitors.");
    };

    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            <Button
                onClick={handleManualTour}
                disabled={isRunning}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
            >
                <Users className="h-4 w-4" />
                Start Tour
            </Button>

            <Button
                onClick={handleAutomatedTour}
                disabled={isRunning}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
            >
                <Play className="h-4 w-4" />
                Auto Demo
            </Button>

            <Button
                onClick={handleReset}
                disabled={isRunning}
                size="sm"
                variant="ghost"
                className="flex items-center gap-2"
            >
                <RotateCcw className="h-4 w-4" />
                Reset
            </Button>
        </div>
    );
}
