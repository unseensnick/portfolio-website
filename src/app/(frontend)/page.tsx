import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { getPortfolioData } from "@/lib/payload-utils";
import React from "react";

/**
 * Main homepage component that renders all portfolio sections
 * Section IDs are used for navigation anchors
 */
export default async function Home(): Promise<React.ReactNode> {
    // Fetch data from PayloadCMS or use fallback data if not available
    const data = await getPortfolioData();

    return (
        <div className="min-h-screen bg-background">
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
    );
}
