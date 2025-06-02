import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { portfolioData } from "@/data/portfolio";

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            <div className="pt-20">
                <Hero {...portfolioData.hero} />
                <Projects {...portfolioData.projects} />
                <About {...portfolioData.about} />
                <Contact {...portfolioData.contact} />
            </div>
            <Footer {...portfolioData.footer} />
        </div>
    );
}
