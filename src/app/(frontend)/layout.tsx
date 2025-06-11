import { ThemeProvider } from "@/components/theme-provider";
import { generateFaviconMetadata } from "@/lib/favicon-utils";
import { Geist } from "next/font/google";
import React from "react";
import "./styles.css";

const geist = Geist({
    subsets: ["latin"],
});

export const metadata = {
    title: "unseensnick - Web Developer",
    description:
        "Portfolio of unseensnick, a passionate web developer specializing in modern web technologies",
    keywords: [
        "unseensnick",
        "web developer",
        "web developer",
        "portfolio",
        "react",
        "nextjs",
        "typescript",
    ],
    authors: [{ name: "unseensnick" }],
    creator: "unseensnick",

    // Favicon using hexagon logo (server-side generated)
    icons: generateFaviconMetadata(),

    // Theme colors that match your design
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    ],

    // Open Graph metadata for social sharing
    openGraph: {
        title: "unseensnick - Web Developer",
        description: "Portfolio of unseensnick, a passionate web developer",
        type: "website",
        locale: "en_US",
        siteName: "unseensnick Portfolio",
    },

    // Twitter card metadata
    twitter: {
        card: "summary",
        title: "unseensnick - Web Developer",
        description: "Portfolio of unseensnick, a passionate web developer",
        creator: "@unseensnick", // Add your Twitter handle if you have one
    },

    // Robots and indexing
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    // Viewport settings
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 5,
        userScalable: true,
    },
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geist.className} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {/* Simplified layout - navigation moved to page component for live preview */}
                    <div className="flex flex-col min-h-screen">{children}</div>
                </ThemeProvider>
            </body>
        </html>
    );
}
