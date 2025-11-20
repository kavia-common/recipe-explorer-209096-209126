import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { Suspense } from "react";
import React from "react";

const SITE_URL =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_FRONTEND_URL ||
      process.env.NEXT_PUBLIC_API_BASE ||
      process.env.NEXT_PUBLIC_BACKEND_URL)) ||
  "https://example.com";

// PUBLIC_INTERFACE
export const metadata: Metadata = {
  title: {
    default: "Recipe Explorer",
    template: "%s · Recipe Explorer",
  },
  description:
    "Browse, search, and discover delicious recipes with a modern, accessible interface.",
  applicationName: "Recipe Explorer",
  authors: [{ name: "Recipe Explorer" }],
  keywords: [
    "recipes",
    "cooking",
    "food",
    "search",
    "browse",
    "ingredients",
    "meal",
    "dinner ideas",
  ],
  creator: "Recipe Explorer",
  publisher: "Recipe Explorer",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Recipe Explorer",
    title: "Recipe Explorer",
    description:
      "Browse, search, and discover delicious recipes with a modern, accessible interface.",
    url: SITE_URL,
    images: [
      {
        url: "/assets/og-default.png",
        width: 1200,
        height: 630,
        alt: "Recipe Explorer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recipe Explorer",
    description:
      "Browse, search, and discover delicious recipes with a modern, accessible interface.",
    images: ["/assets/og-default.png"],
    creator: "@recipe_explorer",
  },
  category: "food & drink",
  // Add manifest and icons for PWA/favicon support
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", rel: "icon", type: "image/x-icon", sizes: "any" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  themeColor: "#2563EB",
};

// PUBLIC_INTERFACE
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full scroll-smooth"
    >
      <head>
        {/* Explicit manifest and favicon links for broad/static export compatibility */}
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#2563EB" />
      </head>
      <body suppressHydrationWarning className="min-h-full antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <header className="site-header">
          <div className="app-container">
            <Suspense fallback={<div aria-hidden className="h-16" />}>
              <NavBar />
            </Suspense>
          </div>
        </header>
        <main id="main-content" className="app-container py-8">
          {children}
        </main>
        <footer className="app-container page-footer" role="contentinfo">
          <p>
            © {new Date().getFullYear()} Recipe Explorer · Built with
            <span className="sr-only"> love and </span> Next.js
          </p>
        </footer>
      </body>
    </html>
  );
}
