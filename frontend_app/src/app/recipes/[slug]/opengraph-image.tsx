import { ImageResponse } from "next/og";
import { getRecipeBySlug } from "@/lib/api/recipes";
import type { Recipe } from "@/lib/types";

// Route Segment Config
// Ensure compatibility with `output: "export"` by opting into static generation.
export const dynamic = "force-static";
export const revalidate = 0;

// PUBLIC_INTERFACE
export const alt = "Recipe Open Graph Image";

// PUBLIC_INTERFACE
export const size = {
  width: 1200,
  height: 630,
};

// PUBLIC_INTERFACE
export const contentType = "image/png";

function pickFallback(slug: string): Recipe {
  return {
    id: slug,
    slug,
    title: slug
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" "),
    description: "Discover ingredients, steps, and nutrition.",
    ingredients: [],
    steps: [],
    image: undefined,
    createdAt: new Date().toISOString(),
  };
}

// PUBLIC_INTERFACE
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let recipe = await getRecipeBySlug(slug);
  if (!recipe) {
    recipe = pickFallback(slug);
  }

  const title = recipe.title || "Recipe";
  const subtitle =
    recipe.description ||
    [recipe.cuisine, recipe.course].filter(Boolean).join(" • ") ||
    "Recipe Explorer";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(249,250,251,1))",
          padding: 48,
          justifyContent: "space-between",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            color: "#111827",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              gap: 12,
              alignItems: "center",
              color: "#1D4ED8",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background:
                  "conic-gradient(from 180deg at 50% 50%, rgba(37,99,235,0.85), rgba(245,158,11,0.85))",
              }}
            />
            <span style={{ fontSize: 28, fontWeight: 600 }}>
              Recipe Explorer
            </span>
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: 900,
              wordBreak: "break-word",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#374151",
              maxWidth: 1000,
              lineHeight: 1.35,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#6B7280",
            fontSize: 22,
          }}
        >
          <div>www.recipe-explorer.example</div>
          <div>Cook • Learn • Enjoy</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
