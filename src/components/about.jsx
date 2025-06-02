import Image from "next/image";

function TechTag({ text }) {
    return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-300">
            {text}
        </span>
    );
}

function InterestItem({ text }) {
    return (
        <div className="flex items-center gap-2 text-muted-foreground">
            <div className="size-1.5 rounded-full bg-primary"></div>
            <span className="text-sm">{text}</span>
        </div>
    );
}

export function About({
    title,
    paragraphs,
    technologies,
    interests,
    image,
    technologiesHeading,
    interestsHeading,
}) {
    return (
        <section className="py-24 lg:py-32">
            <div className="max-w-6xl mx-auto px-8">
                <div className="text-center mb-16 lg:mb-20">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                        {title}
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-20">
                    {/* Image Section */}
                    <div className="lg:col-span-2">
                        <div className="aspect-[3/4] bg-gradient-to-br from-muted via-muted to-muted/50 rounded-xl w-full relative overflow-hidden">
                            {image && (
                                <Image
                                    src={image}
                                    alt="About"
                                    fill
                                    className="object-cover rounded-xl"
                                />
                            )}
                            {!image && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="size-16 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <div className="size-8 rounded-lg bg-primary/20"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="lg:col-span-3 space-y-12">
                        {/* Story */}
                        <div className="space-y-6">
                            {paragraphs.map((paragraph, index) => (
                                <p
                                    key={index}
                                    className="text-lg text-muted-foreground leading-relaxed"
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* Technologies */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-foreground">
                                {technologiesHeading}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {technologies.map((tech, index) => (
                                    <TechTag key={index} text={tech} />
                                ))}
                            </div>
                        </div>

                        {/* Interests */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-foreground">
                                {interestsHeading}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {interests.map((interest, index) => (
                                    <InterestItem key={index} text={interest} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
