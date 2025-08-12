import { ThemeProvider } from "@/components/theme-provider";
import { Geist } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";

const geist = Geist({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Portfolio - Full Stack Developer",
    description: "Modern portfolio showcasing full-stack development projects and skills",
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): React.JSX.Element {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
            </head>
            <body className={`${geist.className} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="flex flex-col min-h-screen">{children}</div>
                </ThemeProvider>
            </body>
        </html>
    );
}