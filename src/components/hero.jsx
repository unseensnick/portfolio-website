import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function Hero({ greeting, title, description, githubUrl, image }) {
    return (
        <section id="home" className="max-w-6xl mx-auto px-8 pt-24 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <div className="space-y-8 max-w-lg">
                    <p className="text-sm text-muted-foreground uppercase tracking-wider">
                        {greeting}
                    </p>
                    <h1 className="text-4xl lg:text-5xl font-semibold leading-tight">
                        {title}
                    </h1>
                    <p className="text-base text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                    <Link
                        href={githubUrl}
                        target="_blank"
                        className="inline-block"
                    >
                        <Button
                            variant="link"
                            className="text-primary hover:text-primary/80 p-0 h-auto text-base font-normal"
                        >
                            GitHub →
                        </Button>
                    </Link>
                </div>
                <div className="aspect-video bg-muted rounded-xl w-full relative">
                    {image && (
                        <Image
                            src={image}
                            alt="Hero"
                            fill
                            className="object-cover rounded-xl"
                            priority
                        />
                    )}
                </div>
            </div>
        </section>
    );
}
