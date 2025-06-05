import "@/app/(frontend)/styles.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Geist } from "next/font/google";
import React from "react";

const geist = Geist({
    subsets: ["latin"],
});

export const metadata = {
    title: "Reset Password - Portfolio",
    description: "Reset your password for the portfolio admin panel",
};

interface ResetPasswordLayoutProps {
    children: React.ReactNode;
}

export default function ResetPasswordLayout({
    children,
}: ResetPasswordLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geist.className} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {/* Simple layout container for password reset */}
                    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-muted/30 to-background">
                        {/* Minimal header with theme toggle and branding */}
                        <header className="w-full border-b border-border/50 bg-background/80 backdrop-blur-sm">
                            <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
                                {/* Logo/Brand */}
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary font-bold text-sm">
                                            &lt;/&gt;
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold text-foreground leading-none">
                                            unseensnick
                                        </span>
                                        <span className="text-xs text-muted-foreground leading-none">
                                            Full Stack Developer
                                        </span>
                                    </div>
                                </div>

                                {/* Theme toggle */}
                                <ThemeToggle />
                            </div>
                        </header>

                        {/* Main content area */}
                        <main className="flex-1 flex items-center justify-center p-4">
                            {children}
                        </main>

                        {/* Minimal footer */}
                        <footer className="w-full border-t border-border/50 bg-background/50 backdrop-blur-sm">
                            <div className="py-4 px-6 text-center">
                                <p className="text-xs text-muted-foreground">
                                    © {new Date().getFullYear()} unseensnick.
                                    All rights reserved.
                                </p>
                            </div>
                        </footer>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
