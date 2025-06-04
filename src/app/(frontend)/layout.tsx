import { SectionNavigation } from "@/components/section-navigation";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { getPortfolioData } from "@/lib/payload-utils";
import { Geist } from "next/font/google";
import React from "react";
import "./styles.css";

const geist = Geist({
    subsets: ["latin"],
});

export const metadata = {
    title: "Portfolio",
    description: "Personal portfolio website",
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
    // Fetch data from PayloadCMS or use fallback data if not available
    const data = await getPortfolioData();

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geist.className} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {/* Layout container with fixed header */}
                    <div
                        style={
                            { "--header-height": "5rem" } as React.CSSProperties
                        }
                        className="flex flex-col min-h-screen"
                    >
                        {/* Site header with logo, subtitle and navigation */}
                        <SiteHeader
                            logo={data.nav.logo}
                            subtitle={data.nav.subtitle}
                            navLinks={data.nav.links}
                        />

                        {/* Content area with sidebar */}
                        <div className="flex flex-1 bg-background">
                            {/* Main content wrapper */}
                            <main className="flex flex-1 flex-col">
                                {children}
                            </main>
                        </div>

                        {/* Desktop section navigation */}
                        <SectionNavigation navLinks={data.nav.links} />
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
