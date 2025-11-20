import { ImageResponse } from "next/og";
import { getRecipeBySlug } from "@/lib/api/recipes";
import type { Recipe } from "@/lib/types";

// Ensure compatibility with `output: "export"` by opting into static generation.
export const dynamic = "force-static";
export const revalidate = 0;

// PUBLIC_INTERFACE
export const alt = "Recipe Twitter Image";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

function fallback(slug: string): Recipe {
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
  if (!recipe) recipe = fallback(slug);

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
            "linear-gradient(180deg, rgba(37,99,235,0.10), rgba(249,250,251,1))",
          padding: 48,
          justifyContent: "space-between",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              background:
                "conic-gradient(from 180deg at 50% 50%, rgba(37,99,235,0.85), rgba(245,158,11,0.85))",
            }}
          />
          <div style={{ fontSize: 36, fontWeight: 700 }}>Recipe Explorer</div>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              gap: 16,
            }}
          >
            <div
              style={{
                fontSize: 60,
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                wordBreak: "break-word",
              }}
            >
              {title}
            </div>
            <div style={{ fontSize: 26, color: "#374151" }}>{subtitle}</div>
          </div>
        </div>
        <div style={{ color: "#6B7280", fontSize: 22, textAlign: "right" }}>
          recipe-explorer
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
