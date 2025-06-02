import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

function ProjectCard({
    title,
    description,
    projectUrl,
    codeUrl,
    image,
    className,
    featured = false,
}) {
    return (
        <Card
            className={`border-border bg-card overflow-hidden rounded-xl ${className}`}
        >
            <div
                className={`${
                    featured ? "aspect-[16/9]" : "aspect-video"
                } bg-muted w-full relative`}
            >
                {image && (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                )}
            </div>
            <div className={`${featured ? "p-12" : "p-8"}`}>
                <h3
                    className={`${
                        featured ? "text-xl" : "text-lg"
                    } font-semibold mb-4`}
                >
                    {title}
                </h3>
                <p
                    className={`${
                        featured ? "text-base" : "text-sm"
                    } text-muted-foreground mb-8 leading-relaxed`}
                >
                    {description}
                </p>
                <div className="flex gap-8">
                    <Button
                        variant="link"
                        className="text-primary hover:text-primary/80 p-0 h-auto text-sm font-normal"
                        asChild
                    >
                        <Link href={projectUrl}>View project →</Link>
                    </Button>
                    <Button
                        variant="link"
                        className="text-primary hover:text-primary/80 p-0 h-auto text-sm font-normal"
                        asChild
                    >
                        <Link href={codeUrl}>Code →</Link>
                    </Button>
                </div>
            </div>
        </Card>
    );
}

export function Projects({ title, featured, items, viewAllLink }) {
    return (
        <section id="projects" className="max-w-6xl mx-auto px-8 py-24">
            <h2 className="text-3xl font-semibold mb-16">{title}</h2>

            {/* Featured Project */}
            <div className="mb-16">
                <ProjectCard {...featured} featured={true} />
            </div>

            {/* Other Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {items.map((project, index) => (
                    <ProjectCard key={index} {...project} />
                ))}
            </div>

            <div className="text-center mt-16">
                <Button
                    variant="outline"
                    className="text-sm bg-transparent border-border hover:bg-muted transition-colors px-8 py-4"
                    asChild
                >
                    <Link href={viewAllLink}>View All Projects →</Link>
                </Button>
            </div>
        </section>
    );
}
