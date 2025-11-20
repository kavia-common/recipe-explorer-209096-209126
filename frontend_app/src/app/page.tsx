'use client';

import React from 'react';
import { SearchBar, FilterBar, RecipeGrid, Pagination, Breadcrumbs, CardSkeleton } from '../components';
import { getMockRecipes } from '../lib/mock/recipes';
import { RecipeSummary } from '../lib/types';

export default function HomePage() {
  const [query, setQuery] = React.useState('');
  const [filters, setFilters] = React.useState({ cuisine: '', course: '', diet: '', maxTime: '' as number | '' });
  const [page, setPage] = React.useState(1);
  const pageSize = 9;

  // simulate data
  const all: RecipeSummary[] = React.useMemo(() => getMockRecipes(48), []);

  const filtered = React.useMemo(() => {
    return all.filter((r) => {
      const q = query.trim().toLowerCase();
      const matchesQ =
        !q ||
        r.title.toLowerCase().includes(q) ||
        (r.cuisine || '').toLowerCase().includes(q) ||
        (r.course || '').toLowerCase().includes(q) ||
        (r.diet || '').toLowerCase().includes(q);
      const matchesCuisine = !filters.cuisine || r.cuisine === filters.cuisine;
      const matchesCourse = !filters.course || r.course === filters.course;
      const matchesDiet = !filters.diet || r.diet === filters.diet;
      const minutes = (r.totalTime || r.prepTime || r.cookTime || '').toLowerCase().match(/\d+/g);
      const totalMin = minutes ? Number(minutes[0]) : undefined;
      const matchesTime = !filters.maxTime || (typeof totalMin === 'number' && totalMin <= (filters.maxTime as number));
      return matchesQ && matchesCuisine && matchesCourse && matchesDiet && matchesTime;
    });
  }, [all, query, filters]);

  const total = filtered.length;
  const startIdx = (page - 1) * pageSize;
  const pageItems = filtered.slice(startIdx, startIdx + pageSize);

  React.useEffect(() => {
    setPage(1);
  }, [query, filters]);

  const cuisines = React.useMemo(
    () => Array.from(new Set(all.map((r) => r.cuisine).filter(Boolean))) as string[],
    [all]
  );
  const courses = React.useMemo(
    () => Array.from(new Set(all.map((r) => r.course).filter(Boolean))) as string[],
    [all]
  );
  const diets = React.useMemo(
    () => Array.from(new Set(all.map((r) => r.diet).filter(Boolean))) as string[],
    [all]
  );

  return (
    <main className="p-6 space-y-6 app-container">
      <a href="#content" className="skip-to-content">Skip to content</a>
      <Breadcrumbs items={[{ label: 'Home' }]} />
      <h1 className="text-3xl font-bold">Recipe Explorer</h1>
      <p className="text-gray-600">Discover and explore delicious recipes.</p>

      <SearchBar value={query} onChange={setQuery} label="Search recipes" className="max-w-2xl" />

      <FilterBar
        value={filters}
        onChange={setFilters}
        options={{ cuisines, courses, diets, times: [15, 30, 45, 60, 90] }}
      />

      <section id="content">
        {/* In a real app, show CardSkeletons during loading state */}
        {false ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <RecipeGrid recipes={pageItems} />
        )}
      </section>

      <div className="flex justify-center">
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
        />
      </div>
    </main>
  );
}
