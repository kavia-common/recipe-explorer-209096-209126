"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * NavBar component renders the top navigation with brand, links, and a global search form.
 * - Provides an accessible nav landmark with current page indication.
 * - Search submits to /recipes?q=... while remaining non-breaking if that route doesn't exist yet.
 */
export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState("");

  // Keep input value in sync with query string when it changes
  useEffect(() => {
    const current = searchParams?.get("q") ?? "";
    setQ(current);
  }, [searchParams]);

  const isActive = useCallback(
    (href: string) => {
      if (!pathname) return false;
      // Treat index routes as exact match, others as startsWith
      if (href === "/") return pathname === "/";
      return pathname.startsWith(href);
    },
    [pathname]
  );

  const handleSearch = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const query = q.trim();
      const target = query ? `/recipes?q=${encodeURIComponent(query)}` : "/recipes";
      // push is fine in client; /recipes may not exist yet but navigation is allowed.
      router.push(target);
    },
    [q, router]
  );

  const navLinks = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/recipes", label: "Recipes" },
    ],
    []
  );

  return (
    <nav
      aria-label="Primary"
      className="site-nav flex items-center justify-between gap-4 py-4"
    >
      <div className="flex items-center gap-3 min-w-0">
        <Link href="/" className="flex items-center gap-2" aria-label="Recipe Explorer Home">
          <span
            aria-hidden="true"
            className="h-8 w-8 rounded-xl"
            style={{
              background:
                "conic-gradient(from 180deg at 50% 50%, rgba(37,99,235,0.85), rgba(245,158,11,0.85))",
              boxShadow: "var(--shadow-md)",
            }}
          />
          <span className="font-semibold text-lg truncate">Recipe Explorer</span>
        </Link>
      </div>
      <ul className="flex items-center gap-1">
        {navLinks.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`transition-colors ${active ? "" : "hover:bg-[rgba(37,99,235,0.06)]"}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <form
        role="search"
        aria-label="Search recipes"
        onSubmit={handleSearch}
        className="flex items-center gap-2 min-w-[220px] w-full max-w-sm"
      >
        <label htmlFor="global-search" className="sr-only">
          Search recipes
        </label>
        <input
          id="global-search"
          name="q"
          type="search"
          placeholder="Search recipes..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="input"
          aria-describedby="global-search-help"
        />
        <button type="submit" className="button primary">
          Search
        </button>
        <span id="global-search-help" className="sr-only">
          Submit to search recipes
        </span>
      </form>
    </nav>
  );
}
