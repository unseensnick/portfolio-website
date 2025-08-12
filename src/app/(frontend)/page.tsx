import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { SectionNavigation } from "@/components/section-navigation";
import { SiteHeader } from "@/components/site-header";
import { commonClasses } from "@/lib/utils";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <SiteHeader
                logo="YourName"
                subtitle="Web Developer"
                navLinks={[
                    { label: "Home", href: "#home" },
                    { label: "Projects", href: "#projects" },
                    { label: "About", href: "#about" },
                    { label: "Contact", href: "#contact" },
                ]}
            />

            <div className="flex flex-1 bg-background">
                <main className="flex flex-1 flex-col">
                    <div className="min-h-screen bg-background relative">
                        <div id="home" className="relative z-10">
                            <Hero
                                greeting="Welcome to my Portfolio"
                                title="Full Stack Developer"
                                description="Building modern web applications with passion and precision. Specializing in React, TypeScript, and Next.js to create exceptional digital experiences."
                                githubUrl="https://github.com"
                                ctaText="View GitHub"
                                secondaryCtaText="View Projects"
                                secondaryCtaLink="#projects"
                                image="/placeholder-image.svg"
                                imagePosition="center"
                                aspectRatio="landscape"
                            />
                        </div>

                        {/* Section divider */}
                        <div className="max-w-7xl mx-auto px-8">
                            <div className={commonClasses.sectionDivider}></div>
                        </div>

                        <div id="projects" className="relative z-10">
                            <Projects
                                title="Featured Projects"
                                description="A showcase of my recent work and contributions to the developer community"
                                featured={{
                                    title: "Portfolio Website",
                                    description: [
                                        { text: "A modern, responsive portfolio website built with Next.js and Tailwind CSS. Features dark mode, smooth animations, and optimized performance." },
                                        { text: "Implemented using TypeScript for type safety, with a focus on accessibility and SEO optimization. The design system emphasizes clean aesthetics and user experience." }
                                    ],
                                    technologies: [
                                        { name: "Next.js" },
                                        { name: "TypeScript" },
                                        { name: "Tailwind CSS" },
                                        { name: "Payload CMS" }
                                    ],
                                    projectUrl: "#",
                                    codeUrl: "https://github.com"
                                }}
                                items={[
                                    {
                                        title: "E-Commerce Platform",
                                        description: [
                                            { text: "Full-stack e-commerce solution with user authentication, payment processing, and inventory management." },
                                            { text: "Built with React, Node.js, and PostgreSQL, featuring a responsive design and real-time updates." }
                                        ],
                                        technologies: [
                                            { name: "React" },
                                            { name: "Node.js" },
                                            { name: "PostgreSQL" },
                                            { name: "Stripe" }
                                        ],
                                        projectUrl: "#",
                                        codeUrl: "https://github.com"
                                    },
                                    {
                                        title: "Task Management App",
                                        description: [
                                            { text: "Collaborative task management application with real-time updates and team collaboration features." },
                                            { text: "Features drag-and-drop functionality, deadline tracking, and team member assignments with notification system." }
                                        ],
                                        technologies: [
                                            { name: "Vue.js" },
                                            { name: "Express.js" },
                                            { name: "MongoDB" },
                                            { name: "Socket.io" }
                                        ],
                                        projectUrl: "#",
                                        codeUrl: "https://github.com"
                                    }
                                ]}
                                viewAllLink="https://github.com"
                                viewMoreText="Want to see more of my work?"
                            />
                        </div>

                        {/* About section with subtle background */}
                        <div id="about" className="relative z-10 bg-muted/30">
                            <About
                                title="About Me"
                                paragraphs={[
                                    "I'm a passionate full-stack developer with a love for creating beautiful, functional web applications. My journey in software development began with curiosity and has evolved into a comprehensive skill set spanning modern web technologies.",
                                    "I believe in writing clean, maintainable code and staying up-to-date with the latest industry trends and best practices. When I'm not coding, you can find me exploring new technologies, contributing to open source projects, or sharing knowledge with the developer community."
                                ]}
                                technologies={[
                                    "React",
                                    "TypeScript",
                                    "Next.js",
                                    "Node.js",
                                    "Tailwind CSS",
                                    "PostgreSQL",
                                    "MongoDB",
                                    "Docker",
                                    "AWS",
                                    "Git"
                                ]}
                                interests={[
                                    "Web Development",
                                    "UI/UX Design",
                                    "Open Source",
                                    "Cloud Architecture",
                                    "DevOps",
                                    "Mobile Development"
                                ]}
                                technologiesHeading="Technologies I Use"
                                interestsHeading="Areas of Interest"
                                image="/placeholder-image.svg"
                                imagePosition="center"
                                aspectRatio="portrait"
                            />
                        </div>

                        <div className="max-w-7xl mx-auto px-8">
                            <div className={commonClasses.sectionDivider}></div>
                        </div>

                        <div id="contact" className="relative z-10">
                            <Contact
                                title="Get in Touch"
                                description="Feel free to reach out for collaborations or just a friendly hello"
                                email="hello@example.com"
                                github="github.com/username"
                                emailSubtitle="Email me anytime"
                                githubSubtitle="Check out my code"
                                ctaTitle="Let's work together"
                                ctaDescription="Have a project in mind? Let's discuss how I can help you."
                            />
                        </div>

                        <Footer copyright="© 2025 All rights reserved." />
                    </div>
                </main>
            </div>

            <SectionNavigation 
                navLinks={[
                    { label: "Home", href: "#home" },
                    { label: "Projects", href: "#projects" },
                    { label: "About", href: "#about" },
                    { label: "Contact", href: "#contact" },
                ]} 
            />
        </div>
    );
}
