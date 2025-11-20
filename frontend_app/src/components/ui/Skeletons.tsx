import React from 'react';
import { theme } from './theme';

const shimmer =
  'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent';

const styles = `
@keyframes shimmer {
  100% { transform: translateX(100%); }
}
`;

// PUBLIC_INTERFACE
export function CardSkeleton() {
  /** Skeleton UI for a recipe card. */
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200">
        <div className={`${shimmer}`} style={{ backgroundColor: theme.colors.skeletonFrom }}>
          <div className="w-full aspect-[4/3]" />
        </div>
        <div className="p-4 space-y-2">
          <div className={`${shimmer} h-4 rounded`} style={{ backgroundColor: theme.colors.skeletonFrom }} />
          <div className={`${shimmer} h-4 w-2/3 rounded`} style={{ backgroundColor: theme.colors.skeletonFrom }} />
          <div className="flex gap-2 pt-2">
            <div className={`${shimmer} h-6 w-16 rounded-full`} style={{ backgroundColor: theme.colors.skeletonFrom }} />
            <div className={`${shimmer} h-6 w-20 rounded-full`} style={{ backgroundColor: theme.colors.skeletonFrom }} />
          </div>
        </div>
      </div>
    </>
  );
}

// PUBLIC_INTERFACE
export function ListSkeletonItem() {
  /** Skeleton UI for a list row. */
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="flex items-center gap-4 py-3">
        <div className={`${shimmer} h-16 w-24 rounded-md`} style={{ backgroundColor: theme.colors.skeletonFrom }} />
        <div className="flex-1 space-y-2">
          <div className={`${shimmer} h-4 rounded`} style={{ backgroundColor: theme.colors.skeletonFrom }} />
          <div className={`${shimmer} h-4 w-2/3 rounded`} style={{ backgroundColor: theme.colors.skeletonFrom }} />
        </div>
      </div>
    </>
  );
}

// PUBLIC_INTERFACE
export function DetailSkeleton() {
  /** Skeleton UI for a recipe detail page. */
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="space-y-6">
        <div className={`${shimmer} w-full aspect-video rounded-xl`} style={{ backgroundColor: theme.colors.skeletonFrom }} />
        <div className={`${shimmer} h-7 w-1/2 rounded-md`} style={{ backgroundColor: theme.colors.skeletonFrom }} />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`${shimmer} h-4 rounded`} style={{ backgroundColor: theme.colors.skeletonFrom }} />
            ))}
          </div>
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`${shimmer} h-4 rounded`} style={{ backgroundColor: theme.colors.skeletonFrom }} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
