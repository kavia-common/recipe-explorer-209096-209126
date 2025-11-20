'use client';

import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useDebouncedValue from '@/hooks/useDebouncedValue';

type RecipesQueryState = {
  q: string;
  cuisine: string;
  course: string;
  diet: string;
  timeMin?: number | null;
  timeMax?: number | null;
  page: number;
};

type RecipesContextValue = {
  /** Current query state derived from the URL */
  state: RecipesQueryState;
  /** Debounced query string for live search UIs */
  debouncedQ: string;
  /** Setters update URLSearchParams, which becomes the single source of truth */
  setQ: (value: string, opts?: { debounce?: boolean }) => void;
  setCuisine: (value: string) => void;
  setCourse: (value: string) => void;
  setDiet: (value: string) => void;
  setTimeMin: (value: number | '' | null) => void;
  setTimeMax: (value: number | '' | null) => void;
  setPage: (page: number) => void;
  /** Reset all filters and search */
  reset: () => void;
};

const RecipesContext = createContext<RecipesContextValue | undefined>(undefined);

/**
 * PUBLIC_INTERFACE
 * RecipesProvider
 * Provides lightweight state management for listing/search pages by reading and
 * updating URLSearchParams. Keys managed:
 * - q, cuisine, course, diet, timeMin, timeMax, page
 * Usage:
 *   <RecipesProvider>
 *     ... children can call useRecipes() to read and update state ...
 *   </RecipesProvider>
 */
export function RecipesProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const readNumber = (key: string): number | null => {
    const v = searchParams?.get(key);
    if (v == null || v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const state: RecipesQueryState = useMemo(() => {
    const q = searchParams?.get('q')?.toString() ?? '';
    const cuisine = searchParams?.get('cuisine')?.toString() ?? '';
    const course = searchParams?.get('course')?.toString() ?? '';
    const diet = searchParams?.get('diet')?.toString() ?? '';
    const timeMin = readNumber('timeMin');
    const timeMax = readNumber('timeMax');
    const page = (() => {
      const p = readNumber('page');
      return p && p > 0 ? p : 1;
    })();

    return { q, cuisine, course, diet, timeMin: timeMin ?? null, timeMax: timeMax ?? null, page };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Debounced q for live search suggestions or throttled fetches
  const debouncedQ = useDebouncedValue(state.q, 300);

  const setParams = useCallback(
    (patch: Partial<RecipesQueryState>) => {
      const sp = new URLSearchParams(searchParams?.toString() || '');

      const setOrDelete = (key: string, val: string | number | null | undefined) => {
        if (val === null || val === undefined || val === '' || (typeof val === 'number' && !Number.isFinite(val))) {
          sp.delete(key);
        } else {
          sp.set(key, String(val));
        }
      };

      if ('q' in patch) setOrDelete('q', patch.q ?? '');
      if ('cuisine' in patch) setOrDelete('cuisine', patch.cuisine ?? '');
      if ('course' in patch) setOrDelete('course', patch.course ?? '');
      if ('diet' in patch) setOrDelete('diet', patch.diet ?? '');
      if ('timeMin' in patch) setOrDelete('timeMin', patch.timeMin ?? null);
      if ('timeMax' in patch) setOrDelete('timeMax', patch.timeMax ?? null);

      // If filters/search changed, reset page to 1 unless page is explicitly patched
      const onlyPagePatched = Object.keys(patch).length === 1 && Object.prototype.hasOwnProperty.call(patch, 'page');
      if ('page' in patch) {
        setOrDelete('page', patch.page ?? 1);
      } else if (!onlyPagePatched) {
        setOrDelete('page', 1);
      }

      // Build new URL
      const qs = sp.toString();
      const url = qs ? `${pathname}?${qs}` : pathname || '/';
      // Use replace to avoid polluting history with each keystroke on search
      router.replace(url);
    },
    [pathname, router, searchParams]
  );

  const setQ: RecipesContextValue['setQ'] = useCallback(
    (value, opts) => {
      if (opts?.debounce) {
        // For most cases, caller can debounce before calling. Still, we keep API simple.
        const sp = new URLSearchParams(searchParams?.toString() || '');
        if (!value) sp.delete('q');
        else sp.set('q', value);
        sp.delete('page');
        const url = `${pathname}${sp.toString() ? `?${sp.toString()}` : ''}`;
        router.replace(url);
      } else {
        setParams({ q: value });
      }
    },
    [pathname, router, searchParams, setParams]
  );

  const setCuisine = useCallback((value: string) => setParams({ cuisine: value || '' }), [setParams]);
  const setCourse = useCallback((value: string) => setParams({ course: value || '' }), [setParams]);
  const setDiet = useCallback((value: string) => setParams({ diet: value || '' }), [setParams]);
  const setTimeMin = useCallback(
    (value: number | '' | null) => setParams({ timeMin: value === '' ? null : (value as number | null) }),
    [setParams]
  );
  const setTimeMax = useCallback(
    (value: number | '' | null) => setParams({ timeMax: value === '' ? null : (value as number | null) }),
    [setParams]
  );
  const setPage = useCallback((page: number) => setParams({ page: Math.max(1, page) }), [setParams]);

  const reset = useCallback(() => {
    const url = pathname || '/';
    router.replace(url);
  }, [pathname, router]);

  const value = useMemo<RecipesContextValue>(
    () => ({
      state,
      debouncedQ,
      setQ,
      setCuisine,
      setCourse,
      setDiet,
      setTimeMin,
      setTimeMax,
      setPage,
      reset,
    }),
    [state, debouncedQ, setQ, setCuisine, setCourse, setDiet, setTimeMin, setTimeMax, setPage, reset]
  );

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * useRecipes
 * Access the RecipesProvider context for reading current state and performing updates.
 */
export function useRecipes(): RecipesContextValue {
  const ctx = useContext(RecipesContext);
  if (!ctx) {
    throw new Error('useRecipes must be used within a RecipesProvider');
  }
  return ctx;
}

export default RecipesProvider;
