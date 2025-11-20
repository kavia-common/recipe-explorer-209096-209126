import Link from 'next/link';
import React from 'react';
import ImageWithFallback from '../ui/ImageWithFallback';
import { Tag } from '../ui/Tag';
import { theme } from '../ui/theme';
import { RecipeSummary } from '../../lib/types';

export type RecipeCardProps = {
  recipe: RecipeSummary;
  href?: string;
  className?: string;
};

// PUBLIC_INTERFACE
export function RecipeCard({ recipe, href = '#', className }: RecipeCardProps) {
  /** Recipe card preview with image, title, tags and metadata. */
  return (
    <article
      className={`group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition ${className || ''}`}
      style={{ border: `1px solid ${theme.colors.border}` }}
    >
      <Link href={href} className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300">
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <ImageWithFallback
            src={recipe.image || '/placeholder.png'}
            alt={recipe.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="p-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
            {recipe.title}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {recipe.cuisine && <Tag>{recipe.cuisine}</Tag>}
            {recipe.course && <Tag variant="info">{recipe.course}</Tag>}
            {recipe.diet && <Tag variant="success">{recipe.diet}</Tag>}
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <span aria-label="Preparation time">
              ⏱ {recipe.totalTime || recipe.prepTime || recipe.cookTime || '—'}
            </span>
            {typeof recipe.rating === 'number' && (
              <span aria-label="Rating">⭐ {recipe.rating.toFixed(1)}</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

export default RecipeCard;
