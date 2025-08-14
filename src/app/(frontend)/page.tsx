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
import React from "react";

/**
 * Checks if we should show draft content from PayloadCMS
 * Live preview is handled by PayloadCMS's built-in draft system
 */
function shouldShowDraft(
    searchParams: { [key: string]: string | string[] | undefined }
): boolean {
    return searchParams.draft === "true";
}

/**
 * Main portfolio page - renders all sections with data from PayloadCMS
 * Uses PayloadCMS's built-in draft system for live preview
 */
export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<React.ReactNode> {
    const params = await searchParams;
    const isDraft = shouldShowDraft(params);
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
                        {/* Demo mode indicator only - PayloadCMS handles draft indicators */}
                        <DemoModeIndicator offset={false} />

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
