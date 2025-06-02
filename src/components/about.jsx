"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";

function TechTag({ text, isMobile = false }) {
    return (
        <span
            className={`inline-flex items-center rounded-full font-medium bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-300 ${
                isMobile ? "px-3 py-1.5 text-sm" : "px-3 py-1.5 text-sm"
            }`}
        >
            {text}
        </span>
    );
}

function InterestItem({ text, isMobile = false }) {
    return (
        <div className="flex items-center gap-2 text-muted-foreground">
            <div
                className={`rounded-full bg-primary ${
                    isMobile ? "size-1.5" : "size-1.5"
                }`}
            ></div>
            <span className={isMobile ? "text-sm" : "text-sm"}>{text}</span>
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
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <section className="py-16">
                <div className="px-6">
                    {/* Mobile Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                            {title}
                        </h2>
                    </div>

                    <div className="space-y-10">
                        {/* Mobile Image */}
                        <div className="mx-auto max-w-sm">
                            <div className="aspect-square bg-gradient-to-br from-muted via-muted to-muted/50 rounded-2xl w-full relative overflow-hidden border border-border/50 shadow-xl">
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
                                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <div className="size-6 rounded-lg bg-primary/20"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Content */}
                        <div className="space-y-8">
                            {/* Story */}
                            <div className="space-y-4">
                                {paragraphs.map((paragraph, index) => (
                                    <p
                                        key={index}
                                        className="text-base text-muted-foreground leading-relaxed"
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            {/* Technologies */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground">
                                    {technologiesHeading}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {technologies.map((tech, index) => (
                                        <TechTag
                                            key={index}
                                            text={tech}
                                            isMobile={true}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Interests */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground">
                                    {interestsHeading}
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {interests.map((interest, index) => (
                                        <InterestItem
                                            key={index}
                                            text={interest}
                                            isMobile={true}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Desktop version (unchanged)
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
