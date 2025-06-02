import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { portfolioData } from "@/data/portfolio";

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div id="home" className="relative z-10">
                <Hero {...portfolioData.hero} />
            </div>

            {/* Divider */}
            <div className="max-w-7xl mx-auto px-8">
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </div>

            {/* Projects Section */}
            <div id="projects" className="relative z-10">
                <Projects {...portfolioData.projects} />
            </div>

            {/* About Section */}
            <div id="about" className="relative z-10 bg-muted/30">
                <About {...portfolioData.about} />
            </div>

            {/* Divider */}
            <div className="max-w-7xl mx-auto px-8">
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </div>

            {/* Contact Section */}
            <div id="contact" className="relative z-10">
                <Contact {...portfolioData.contact} />
            </div>

            {/* Footer */}
            <Footer {...portfolioData.footer} />
        </div>
    );
}
