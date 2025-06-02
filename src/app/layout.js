import { AppSidebar } from "@/components/app-sidebar";
import { SectionNavigation } from "@/components/section-navigation";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { portfolioData } from "@/data/portfolio";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
    subsets: ["latin"],
});

export const metadata = {
    title: "Portfolio",
    description: "Personal portfolio website",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geist.className} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {/* Main layout container with fixed header height */}
                    <div
                        style={{ "--header-height": "5rem" }}
                        className="flex flex-col min-h-screen"
                    >
                        {/* Sidebar provider for responsive layout */}
                        <SidebarProvider
                            defaultOpen={false}
                            className="flex flex-col flex-1"
                        >
                            {/* Fixed site header */}
                            <SiteHeader
                                logo={portfolioData.nav.logo}
                                subtitle={portfolioData.nav.subtitle}
                                navLinks={portfolioData.nav.links}
                            />

                            {/* Content area with sidebar */}
                            <div className="flex flex-1 bg-background">
                                {/* Main content area */}
                                <SidebarInset>
                                    <main className="flex flex-1 flex-col">
                                        {children}
                                    </main>
                                </SidebarInset>

                                {/* Left sidebar */}
                                <AppSidebar
                                    side="left"
                                    navLinks={portfolioData.nav.links}
                                />
                            </div>

                            {/* Section Navigation - Fixed positioned */}
                            <SectionNavigation
                                navLinks={portfolioData.nav.links}
                            />
                        </SidebarProvider>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
