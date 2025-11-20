import { Breadcrumbs, SearchBar, RecipeGrid } from "@/components";
import { listRecipes } from "@/lib/api/recipes";
import { headers } from "next/headers";

/**
 * PUBLIC_INTERFACE
 * Recipes index page using mock/static-friendly listing.
 * Static-export friendly: does not await or depend on dynamic searchParams.
 */
export default async function RecipesIndex() {
  // Static export friendly query parsing from headers as a best-effort fallback.
  let trimmed = "";
  try {
    const h = await headers();
    const qHeader = h.get("x-invoke-query") || "";
    if (qHeader) {
      const usp = new URLSearchParams(qHeader);
      const hv = usp.get("q") || "";
      trimmed = hv.trim();
    } else {
      const referer = h.get("referer");
      if (referer) {
        try {
          const url = new URL(referer);
          const hv = url.searchParams.get("q") || "";
          trimmed = hv.trim();
        } catch {
          // ignore parse failures
        }
      }
    }
  } catch {
    // headers() may not be available in some SSG contexts; keep empty query
  }

  const data = await listRecipes({
    q: trimmed,
    pageSize: 24,
    sortBy: "createdAt",
    sortDir: "desc",
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Recipes" }]} />
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">All Recipes</h1>
        <p className="text-gray-600">
          Explore our latest and greatest. Use search to refine.
        </p>
      </header>
      {/* Inline search - read-only on server, navigation handled by NavBar on client */}
      <div>
        <SearchBar value={trimmed} className="max-w-xl" />
      </div>
      <section aria-label="Recipe results">
        <RecipeGrid
          recipes={data.items.map((r) => ({
            id: r.id,
            slug: r.slug,
            title: r.title,
            image: r.image,
            cuisine: r.cuisine,
            course: r.course,
            diet: r.diets?.[0],
            totalTime: r.totalTimeMinutes ? `${r.totalTimeMinutes} min` : undefined,
            rating: r.rating,
          }))}
          linkBuilder={(r) => `/recipes/${encodeURIComponent(r.slug || r.id || "")}`}
        />
      </section>
    </div>
  );
}
