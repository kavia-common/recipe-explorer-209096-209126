import { DetailSkeleton, Breadcrumbs } from "@/components";

/**
 * PUBLIC_INTERFACE
 * Loading state for recipe detail route.
 */
export default function LoadingRecipe() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Recipes", href: "/recipes" }, { label: "Loading…" }]} />
      <DetailSkeleton />
    </div>
  );
}
