import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SwRegister from "@/components/SwRegister";
import { NavigationEvents } from "@/components/NavigationEvents";
import { Suspense } from "react";
import { SEO_CONFIG } from "@/seo/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: SEO_CONFIG.title,
  description: SEO_CONFIG.description,
  keywords: SEO_CONFIG.keywords.join(', '),
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Suspense fallback={null}>
          <NavigationEvents />
        </Suspense>
        <SwRegister />
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
