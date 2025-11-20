import React from 'react';
import { RecipeSummary } from '../../lib/types';
import RecipeCard from './RecipeCard';

export type RecipeGridProps = {
  recipes: RecipeSummary[];
  linkBuilder?: (recipe: RecipeSummary) => string;
  className?: string;
  emptyState?: React.ReactNode;
};

// PUBLIC_INTERFACE
export function RecipeGrid({
  recipes,
  linkBuilder = (r) => `/recipe/${encodeURIComponent(r.id || r.slug || r.title)}`,
  className,
  emptyState,
}: RecipeGridProps) {
  /** Responsive grid of RecipeCard items. */
  if (!recipes || recipes.length === 0) {
    return <div className="text-gray-600">{emptyState || 'No recipes found.'}</div>;
  }

  return (
    <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className || ''}`}>
      {recipes.map((r) => (
        <RecipeCard key={r.id || r.slug || r.title} recipe={r} href={linkBuilder(r)} />
      ))}
    </div>
  );
}

export default RecipeGrid;
