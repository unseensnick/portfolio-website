import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Geist } from "next/font/google";
import "../(frontend)/styles.css";

const geist = Geist({
    subsets: ["latin"],
});

export default function ResetPasswordLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            </head>
            <body className={`${geist.className} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <ThemeToggle className="absolute top-4 right-4" />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
