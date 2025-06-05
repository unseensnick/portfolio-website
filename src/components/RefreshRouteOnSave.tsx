"use client";

import { RefreshRouteOnSave as PayloadLivePreview } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";
import React from "react";

export const RefreshRouteOnSave: React.FC = () => {
    const router = useRouter();

    return (
        <PayloadLivePreview
            refresh={() => {
                console.log("[Live Preview] Refreshing route...");
                router.refresh();
            }}
            serverURL={
                process.env.NEXT_PUBLIC_SITE_URL ||
                process.env.LOCAL_DEV_URL ||
                "http://localhost:3000"
            }
        />
    );
};
