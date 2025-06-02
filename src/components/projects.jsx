import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function ProjectItem({
    title,
    description,
    projectUrl,
    codeUrl,
    image,
    reverse = false,
}) {
    return (
        <div className="relative">
            <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                    reverse ? "lg:grid-flow-col-dense" : ""
                }`}
            >
                {/* Image */}
                <div className={`relative ${reverse ? "lg:col-start-2" : ""}`}>
                    <div className="aspect-[16/10] bg-gradient-to-br from-muted via-muted to-muted/50 rounded-xl overflow-hidden border border-border/50 group relative">
                        {image && (
                            <Image
                                src={image}
                                alt={title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        )}
                        {!image && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-lg bg-primary/20"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div
                    className={`space-y-6 ${
                        reverse ? "lg:col-start-1 lg:row-start-1" : ""
                    }`}
                >
                    <div className="space-y-4">
                        <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                            {title}
                        </h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Button
                            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300"
                            asChild
                        >
                            <Link href={projectUrl} target="_blank">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Live Demo
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="border-2 hover:bg-muted transition-all duration-300"
                            asChild
                        >
                            <Link href={codeUrl} target="_blank">
                                <Github className="w-4 h-4 mr-2" />
                                Source
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function Projects({ title, featured, items, viewAllLink }) {
    // Combine featured project with other projects for uniform display
    const allProjects = [featured, ...items];

    return (
        <section className="py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-16 lg:mb-20">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                        {title}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        A showcase of projects that demonstrate my approach to
                        solving complex problems through clean, efficient code.
                    </p>
                </div>

                {/* Projects List */}
                <div className="space-y-24 lg:space-y-32">
                    {allProjects.map((project, index) => (
                        <ProjectItem
                            key={index}
                            {...project}
                            reverse={index % 2 === 1}
                        />
                    ))}
                </div>

                {/* View All Projects */}
                <div className="text-center mt-20 lg:mt-24">
                    <div className="inline-flex flex-col items-center gap-4">
                        <p className="text-muted-foreground">
                            Want to see more of my work?
                        </p>
                        <Button
                            variant="outline"
                            size="lg"
                            className="px-8 py-4 text-base font-medium border-2 hover:bg-muted transition-all duration-300 group"
                            asChild
                        >
                            <Link href={viewAllLink} target="_blank">
                                <Github className="w-5 h-5 mr-2" />
                                View All on GitHub
                                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                                    →
                                </span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
