import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Recipe Explorer",
  description: "Browse, search, and discover delicious recipes with a modern, accessible interface.",
  applicationName: "Recipe Explorer",
  authors: [{ name: "Recipe Explorer" }],
  keywords: ["recipes", "cooking", "food", "search", "browse"],
  creator: "Recipe Explorer",
  publisher: "Recipe Explorer",
  metadataBase: new URL("https://example.com"),
};

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
      <body
        suppressHydrationWarning
        className="min-h-full antialiased"
      >
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
