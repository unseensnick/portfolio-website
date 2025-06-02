import Link from "next/link";

export function Navigation({ logo, links }) {
    return (
        <nav className="fixed w-full top-0 z-10">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-4">
                <Link href="/" className="text-sm font-medium">
                    {logo}
                </Link>
                <div className="flex items-center space-x-8">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
