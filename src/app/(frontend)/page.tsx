import { RefreshRouteOnSave } from "@/components/RefreshRouteOnSave";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { DemoModeIndicator } from "@/components/demo-mode-indicator";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { MobileDemoWrapper } from "@/components/mobile-demo-wrapper";
import { Projects } from "@/components/projects";
import { SectionNavigation } from "@/components/section-navigation";
import { SiteHeader } from "@/components/site-header";
import { shouldUseDemoMode } from "@/lib/demo-utils";
import { getPortfolioData } from "@/lib/payload-utils";
import { commonClasses } from "@/lib/utils";
import { draftMode } from "next/headers";
import React from "react";

/**
 * Checks if we should show draft content from CMS
 * Draft mode enables live preview while editing
 */
async function shouldShowDraft(
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
): Promise<boolean> {
    const draft = await draftMode();
    if (draft.isEnabled) return true;

    const params = await searchParams;
    return params.draft === "true";
}

/**
 * Main portfolio page - renders all sections with data from CMS
 */
export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<React.ReactNode> {
    const isDraft = await shouldShowDraft(searchParams);
    const params = await searchParams;
    const data = await getPortfolioData(isDraft, params);
    const isDemo = shouldUseDemoMode(params);
    const showTourControls = isDemo;

    return (
        <MobileDemoWrapper showTourControls={showTourControls}>
            <RefreshRouteOnSave />

            <SiteHeader
                logo={data.nav.logo}
                subtitle={data.nav.subtitle}
                logoSplitAt={data.nav.logoSplitAt}
                navLinks={data.nav.links}
            />

            <div className="flex flex-1 bg-background">
                <main className="flex flex-1 flex-col">
                    <div className="min-h-screen bg-background relative">
                        {/* Mode indicators - positioned relative to wrapper */}
                        {isDraft && (
                            <div className="absolute top-4 right-4 z-50 bg-yellow-500 dark:bg-yellow-600 text-yellow-950 dark:text-yellow-50 px-3 py-1 rounded text-sm font-medium shadow-lg">
                                Draft Mode
                            </div>
                        )}
                        <DemoModeIndicator offset={isDraft} />

                        <div id="home" className="relative z-10">
                            <Hero {...data.hero} />
                        </div>

                        {/* Section divider */}
                        <div className="max-w-7xl mx-auto px-8">
                            <div className={commonClasses.sectionDivider}></div>
                        </div>

                        <div id="projects" className="relative z-10">
                            <Projects {...data.projects} />
                        </div>

                        {/* About section with subtle background */}
                        <div id="about" className="relative z-10 bg-muted/30">
                            <About {...data.about} />
                        </div>

                        <div className="max-w-7xl mx-auto px-8">
                            <div className={commonClasses.sectionDivider}></div>
                        </div>

                        <div id="contact" className="relative z-10">
                            <Contact {...data.contact} />
                        </div>

                        <Footer {...data.footer} />
                    </div>
                </main>
            </div>

            <SectionNavigation navLinks={data.nav.links} />
        </MobileDemoWrapper>
    );
}
