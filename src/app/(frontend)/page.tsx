import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { RefreshRouteOnSave } from "@/components/RefreshRouteOnSave";
import { SectionNavigation } from "@/components/section-navigation";
import { SiteHeader } from "@/components/site-header";
import { getPortfolioData } from "@/lib/payload-utils";
import { draftMode } from "next/headers";
import React from "react";

/**
 * Check if we should show draft content based on search params or draft mode
 */
async function shouldShowDraft(
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
): Promise<boolean> {
    // Check if Next.js draft mode is enabled
    const draft = await draftMode();
    if (draft.isEnabled) return true;

    // Await searchParams in Next.js 15+
    const params = await searchParams;

    // Check for draft parameter in URL
    return params.draft === "true";
}

/**
 * Main homepage component that renders all portfolio sections
 * Section IDs are used for navigation anchors
 */
export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<React.ReactNode> {
    // Determine if we should fetch draft content
    const isDraft = await shouldShowDraft(searchParams);

    // Fetch data from PayloadCMS or use fallback data if not available
    const data = await getPortfolioData(isDraft);

    return (
        <>
            {/* Live Preview Component - only renders in admin context */}
            <RefreshRouteOnSave />

            {/* Site header with hexagon logo, subtitle and navigation - now gets draft content */}
            <SiteHeader
                logo={data.nav.logo}
                subtitle={data.nav.subtitle}
                logoSplitAt={data.nav.logoSplitAt}
                navLinks={data.nav.links}
            />

            {/* Main content area */}
            <div className="flex flex-1 bg-background">
                {/* Main content wrapper */}
                <main className="flex flex-1 flex-col">
                    <div className="min-h-screen bg-background">
                        {/* Show draft indicator when in draft mode */}
                        {isDraft && (
                            <div className="fixed top-20 right-4 z-50 bg-yellow-500 text-black px-3 py-1 rounded text-sm font-medium">
                                Draft Mode
                            </div>
                        )}

                        {/* Hero/introduction section */}
                        <div id="home" className="relative z-10">
                            <Hero {...data.hero} />
                        </div>

                        {/* Gradient divider */}
                        <div className="max-w-7xl mx-auto px-8">
                            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                        </div>

                        {/* Projects showcase section */}
                        <div id="projects" className="relative z-10">
                            <Projects {...data.projects} />
                        </div>

                        {/* About/bio section with light background */}
                        <div id="about" className="relative z-10 bg-muted/30">
                            <About {...data.about} />
                        </div>

                        {/* Gradient divider */}
                        <div className="max-w-7xl mx-auto px-8">
                            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                        </div>

                        {/* Contact form section */}
                        <div id="contact" className="relative z-10">
                            <Contact {...data.contact} />
                        </div>

                        {/* Site footer with copyright */}
                        <Footer {...data.footer} />
                    </div>
                </main>
            </div>

            {/* Desktop section navigation - now gets draft content */}
            <SectionNavigation navLinks={data.nav.links} />
        </>
    );
}
