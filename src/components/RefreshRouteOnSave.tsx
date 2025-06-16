"use client";

import { logger } from "@/lib/utils";
import { RefreshRouteOnSave as PayloadLivePreview } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";
import React from "react";

export const RefreshRouteOnSave: React.FC = () => {
    const router = useRouter();

    return (
        <PayloadLivePreview
            refresh={() => {
                try {
                    router.refresh();
                } catch (error) {
                    const livePreviewLogger =
                        logger.createFeatureLogger("Live Preview");
                    livePreviewLogger.error("Error refreshing route:", error);
                    // Fallback: try to reload the page
                    if (typeof window !== "undefined") {
                        window.location.reload();
                    }
                }
            }}
            serverURL={
                process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3000"
            }
        />
    );
};
