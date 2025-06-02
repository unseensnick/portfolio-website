import Link from "next/link";

export function Contact({ title, description, email, github }) {
    return (
        <section id="contact" className="max-w-6xl mx-auto px-8 py-24">
            <h2 className="text-3xl font-semibold mb-16">{title}</h2>
            <div className="max-w-lg mx-auto text-center">
                <p className="text-base text-muted-foreground mb-12 leading-relaxed">
                    {description}
                </p>
                <div className="flex flex-col items-center gap-4">
                    <Link
                        href={`mailto:${email}`}
                        className="text-base hover:text-primary transition-colors"
                    >
                        {email}
                    </Link>
                    <Link
                        href={`https://${github}`}
                        className="text-base hover:text-primary transition-colors"
                    >
                        {github}
                    </Link>
                </div>
            </div>
        </section>
    );
}
