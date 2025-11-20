"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components";

/**
 * PUBLIC_INTERFACE
 * Error boundary for recipe detail route. Displays a friendly message and recovery actions.
 */
export default function ErrorRecipe({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // You could log error.digest to a monitoring service here
    // console.error(error);
  }, [error]);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Recipes", href: "/recipes" },
          { label: "Error" },
        ]}
      />
      <section
        className="card p-6"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
        <p className="text-gray-700 mb-4">
          We couldn&apos;t load this recipe. You can retry or go back to the recipe list.
        </p>
        <div className="flex gap-3">
          <button className="button primary" onClick={reset}>
            Retry
          </button>
          <Link href="/recipes" className="button">
            Back to Recipes
          </Link>
        </div>
      </section>
    </div>
  );
}
