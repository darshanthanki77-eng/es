import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "EssSmartSeller - Smart E-Commerce Management Platform",
    description: "Comprehensive e-commerce management system with sales analytics, supplier management, and store health monitoring",
    keywords: "e-commerce, sales analytics, supplier management, store health, dashboard",
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased font-outfit">
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
