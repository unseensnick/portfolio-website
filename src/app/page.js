import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { portfolioData } from "@/data/portfolio";

/**
 * Main homepage component that renders all portfolio sections
 * Section IDs are used for navigation anchors
 */
export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero/introduction section */}
            <div id="home" className="relative z-10">
                <Hero {...portfolioData.hero} />
            </div>

            {/* Gradient divider */}
            <div className="max-w-7xl mx-auto px-8">
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </div>

            {/* Projects showcase section */}
            <div id="projects" className="relative z-10">
                <Projects {...portfolioData.projects} />
            </div>

            {/* About/bio section with light background */}
            <div id="about" className="relative z-10 bg-muted/30">
                <About {...portfolioData.about} />
            </div>

            {/* Gradient divider */}
            <div className="max-w-7xl mx-auto px-8">
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </div>

            {/* Contact form section */}
            <div id="contact" className="relative z-10">
                <Contact {...portfolioData.contact} />
            </div>

            {/* Site footer with copyright */}
            <Footer {...portfolioData.footer} />
        </div>
    );
}
