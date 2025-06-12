"use client";

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
                    console.error(
                        "[Live Preview] Error refreshing route:",
                        error
                    );
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
