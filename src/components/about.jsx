import Image from "next/image";

function ListItem({ text }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-sm">{text}</span>
        </div>
    );
}

export function About({ title, paragraphs, technologies, interests, image }) {
    return (
        <section id="about" className="max-w-6xl mx-auto px-8 py-24">
            <h2 className="text-3xl font-semibold mb-16">{title}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                <div className="aspect-square bg-muted rounded-xl w-full relative">
                    {image && (
                        <Image
                            src={image}
                            alt="About"
                            fill
                            className="object-cover rounded-xl"
                        />
                    )}
                </div>
                <div className="space-y-12 max-w-lg">
                    <div className="space-y-8">
                        {paragraphs.map((paragraph, index) => (
                            <p
                                key={index}
                                className="text-base text-muted-foreground leading-relaxed"
                            >
                                {paragraph}
                            </p>
                        ))}
                    </div>
                    <div className="space-y-12">
                        <div>
                            <h3 className="text-lg font-semibold mb-6">
                                Technologies
                            </h3>
                            <div className="flex flex-wrap gap-y-4 gap-x-12">
                                {technologies.map((tech) => (
                                    <ListItem key={tech} text={tech} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-6">
                                Interests
                            </h3>
                            <div className="flex flex-wrap gap-y-4 gap-x-12">
                                {interests.map((interest) => (
                                    <ListItem key={interest} text={interest} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
