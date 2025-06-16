import { ThemeProvider } from "@/components/theme-provider";
import { Geist } from "next/font/google";
import React from "react";
import "./styles.css";

const geist = Geist({
    subsets: ["latin"],
});

interface RootLayoutProps {
    children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            </head>
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
