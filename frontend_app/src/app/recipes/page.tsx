import { Breadcrumbs, SearchBar, RecipeGrid } from "@/components";
import { listRecipes } from "@/lib/api/recipes";

export const metadata = {
  title: "Recipes · Recipe Explorer",
  description: "Browse our curated collection of delicious recipes.",
};

/**
 * PUBLIC_INTERFACE
 * Recipes index page using mock/static-friendly listing.
 */
export default async function RecipesIndex({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const sp = searchParams || {};
  const q = sp.q?.toString().trim() || "";
  const data = await listRecipes({ q, pageSize: 24, sortBy: "createdAt", sortDir: "desc" });

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Recipes" }]} />
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">All Recipes</h1>
        <p className="text-gray-600">
          Explore our latest and greatest. Use search to refine.
        </p>
      </header>
      {/* Inline search - non-interactive on server, navigates by client via NavBar as well */}
      <div>
        {/* Client SearchBar is optional here; keep read-only prompt for SSG */}
        <SearchBar value={q} className="max-w-xl" onSubmit={() => { /* no-op on server */ }} />
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
