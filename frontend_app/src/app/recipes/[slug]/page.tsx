import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import React from "react";
import { Tag } from "@/components/ui/Tag";
import { theme } from "@/components/ui/theme";
import { getRecipeBySlug } from "@/lib/api/recipes";
import type { Recipe } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import IngredientsChecklist from "@/components/recipes/IngredientsChecklist";

/**
 * PUBLIC_INTERFACE
 * Generate page metadata dynamically from recipe content for SEO.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) {
    return {
      title: "Recipe not found · Recipe Explorer",
      description: "The requested recipe could not be found.",
    };
  }
  const title = `${recipe.title} · Recipe Explorer`;
  const description =
    recipe.description ||
    `View ingredients, steps, and nutrition for ${recipe.title}.`;
  const images = recipe.image ? [recipe.image] : [];
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

/**
 * Get list of static params for SSG using the mock dataset.
 * We import the mock JSON directly for static export friendliness.
 */
export async function generateStaticParams() {
  const data = (await import("@/lib/mock/recipes.json")).default as Recipe[];
  return data.map((r) => ({ slug: r.slug }));
}

function humanizeServings(servings?: number | string): string {
  if (servings == null || servings === "") return "—";
  return String(servings);
}

function minutesTotal(r: Recipe): number | undefined {
  if (typeof r.totalTimeMinutes === "number") return r.totalTimeMinutes;
  const total = (r.prepTimeMinutes || 0) + (r.cookTimeMinutes || 0);
  return total || undefined;
}

/**
 * PUBLIC_INTERFACE
 * Recipe Detail Page
 * Renders hero, meta, tags, ingredients (client-side checklist), steps, nutrition, and gallery.
 */
export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  const totalMins = minutesTotal(recipe);
  const timeLabel = formatTime(totalMins);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Recipes", href: "/recipes" },
    { label: recipe!.title },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={crumbs} />

      <article
        className="space-y-6"
        role="article"
        aria-labelledby="recipe-title"
      >
        {/* Hero Section */}
        <section
          className="card overflow-hidden"
          aria-label="Recipe hero"
          role="region"
        >
          <div className="relative w-full aspect-video">
            <ImageWithFallback
              src={recipe!.image || "/placeholder.png"}
              alt={recipe!.title}
              fill
              sizes="100vw"
              priority
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="p-4 md:p-6">
            <h1
              id="recipe-title"
              className="text-2xl md:text-3xl font-bold mb-2"
            >
              {recipe!.title}
            </h1>
            {recipe!.description && (
              <p className="text-gray-700">{recipe!.description}</p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-700">
              <span
                className="inline-flex items-center gap-1"
                aria-label="Rating"
              >
                ⭐
                <span className="font-medium">
                  {typeof recipe!.rating === "number"
                    ? recipe!.rating.toFixed(1)
                    : "—"}
                </span>
              </span>
              <span aria-label="Total time" className="inline-flex items-center gap-1">
                ⏱ {timeLabel}
              </span>
              <span aria-label="Servings" className="inline-flex items-center gap-1">
                🍽 {humanizeServings(recipe!.servings)}
              </span>
              {recipe!.author?.name && (
                <span aria-label="Author" className="inline-flex items-center gap-1">
                  👨‍🍳 {recipe!.author!.name}
                </span>
              )}
            </div>

            {/* Tags */}
            {(recipe!.tags?.length ||
              recipe!.cuisine ||
              recipe!.course ||
              recipe!.diets?.length) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {recipe!.cuisine && <Tag>{recipe!.cuisine}</Tag>}
                {recipe!.course && <Tag variant="info">{recipe!.course}</Tag>}
                {recipe!.diets?.map((d) => (
                  <Tag key={d} variant="success">
                    {d}
                  </Tag>
                ))}
                {recipe!.tags?.map((t) => (
                  <Tag key={t} variant="outline">
                    {t}
                  </Tag>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Ingredients and Steps */}
          <section
            className="lg:col-span-2 space-y-6"
            aria-label="Recipe content"
            role="region"
          >
            <IngredientsChecklist ingredients={recipe!.ingredients} />

            <StepsOrdered steps={recipe!.steps} />
          </section>

          {/* Nutrition + Info Card */}
          <aside
            className="space-y-6"
            aria-label="Recipe sidebar"
            role="complementary"
          >
            <section className="card p-4" aria-label="Timing and servings">
              <h2 className="text-lg font-semibold mb-3">At a glance</h2>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-gray-500">Prep</dt>
                  <dd className="font-medium">
                    {formatTime(recipe!.prepTimeMinutes)}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Cook</dt>
                  <dd className="font-medium">
                    {formatTime(recipe!.cookTimeMinutes)}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Total</dt>
                  <dd className="font-medium">{timeLabel}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Servings</dt>
                  <dd className="font-medium">
                    {humanizeServings(recipe!.servings)}
                  </dd>
                </div>
              </dl>
            </section>

            <NutritionTable nutrition={recipe!.nutrition} />

            {/* Gallery if images exist */}
            {Array.isArray(recipe!.images) && recipe!.images.length > 0 && (
              <section className="card p-4" aria-label="Gallery">
                <h2 className="text-lg font-semibold mb-3">Gallery</h2>
                <ul className="grid grid-cols-2 gap-3">
                  {recipe!.images!.map((img, i) => (
                    <li key={`${img}-${i}`} className="relative aspect-[4/3] rounded-md overflow-hidden">
                      <ImageWithFallback
                        src={img}
                        alt={`${recipe!.title} image ${i + 1}`}
                        fill
                        sizes="(max-width: 1024px) 50vw, 256px"
                        style={{ objectFit: "cover" }}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <Link
              href="/recipes"
              className="button w-full justify-center"
              aria-label="Back to recipe list"
              style={{ borderColor: theme.colors.border }}
            >
              ← Back to Recipes
            </Link>
          </aside>
        </div>
      </article>
    </div>
  );
}



/**
 * Steps ordered list with clear numbering and accessible structure.
 */
function StepsOrdered({ steps }: { steps: Recipe["steps"] }) {
  return (
    <section className="card p-4 md:p-6" aria-label="Steps" role="region">
      <h2 className="text-xl font-semibold mb-4">Steps</h2>
      <ol className="space-y-4 list-decimal list-inside">
        {steps?.map((s) => (
          <li key={s.number} className="pl-1">
            <p className="text-gray-900">{s.instruction}</p>
            {typeof s.timeMinutes === "number" && s.timeMinutes > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                Estimated: {formatTime(s.timeMinutes)}
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

/**
 * Nutrition table surfaced with simple dl grid, ensuring accessible name and values.
 */
function NutritionTable({
  nutrition,
}: {
  nutrition: Recipe["nutrition"];
}) {
  if (!nutrition) return null;
  const entries = Object.entries(nutrition).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  if (entries.length === 0) return null;

  return (
    <section className="card p-4" aria-label="Nutrition" role="region">
      <h2 className="text-lg font-semibold mb-3">Nutrition (per serving)</h2>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        {entries.map(([k, v]) => (
          <div key={k}>
            <dt className="text-gray-500">{labelFromKey(k)}</dt>
            <dd className="font-medium">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function labelFromKey(k: string): string {
  return k
    .replace(/_/g, " ")
    .replace(/(\b\w)/g, (m) => m.toUpperCase())
    .replace(/G$/i, " g")
    .replace(/Mg$/i, " mg");
}


