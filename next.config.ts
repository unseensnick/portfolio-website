import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import { withNextVideo } from "next-video/process";

const nextConfig: NextConfig = {
    /* config options here */
};

export default withNextVideo(withPayload(nextConfig), { folder: 'media' });