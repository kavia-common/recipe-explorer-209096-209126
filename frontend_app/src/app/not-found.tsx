import Link from "next/link";

export default function NotFound() {
  return (
    <main className="app-container py-16">
      <section
        className="card p-8 text-center"
        role="alert"
        aria-live="assertive"
      >
        <header className="mb-6">
          <h1 className="text-3xl font-semibold mb-2" style={{ color: "var(--color-text)" }}>
            404 – Page Not Found
          </h1>
          <p className="text-[color:var(--color-muted)]">
            The page you’re looking for doesn’t exist or has been moved.
          </p>
        </header>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="button primary">
            Go Home
          </Link>
          <Link href="/recipes" className="button" style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}>
            Browse Recipes
          </Link>
        </div>
      </section>
    </main>
  );
}
