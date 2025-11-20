'use client';

import React from 'react';
import { theme } from '../ui/theme';

export type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
  maxButtons?: number;
};

// PUBLIC_INTERFACE
export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
  maxButtons = 5,
}: PaginationProps) {
  /** Pagination control with Prev/Next and numbered pages. */
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const start = Math.max(1, page - Math.floor(maxButtons / 2));
  const end = Math.min(totalPages, start + maxButtons - 1);
  const startAdjusted = Math.max(1, Math.min(start, Math.max(1, end - maxButtons + 1)));

  const nums = Array.from({ length: Math.min(maxButtons, totalPages) }, (_, i) => startAdjusted + i);

  const baseBtn =
    'min-w-9 h-9 px-3 inline-flex items-center justify-center rounded-md border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition';
  const solid = `bg-[${theme.colors.primary}] text-white border-transparent hover:brightness-95`;
  const ghost =
    'bg-white text-gray-700 border-gray-200 hover:bg-gray-50';

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={`flex items-center gap-2 ${className || ''}`}
    >
      <button
        type="button"
        className={`${baseBtn} ${ghost}`}
        onClick={() => canPrev && onPageChange(page - 1)}
        disabled={!canPrev}
        aria-disabled={!canPrev}
        aria-label="Previous page"
      >
        Prev
      </button>

      {nums[0] > 1 && (
        <>
          <button className={`${baseBtn} ${ghost}`} onClick={() => onPageChange(1)}>1</button>
          <span className="px-1 text-gray-500" aria-hidden>…</span>
        </>
      )}

      {nums.map((n) => (
        <button
          key={n}
          type="button"
          className={`${baseBtn} ${n === page ? solid : ghost}`}
          onClick={() => onPageChange(n)}
          aria-current={n === page ? 'page' : undefined}
        >
          {n}
        </button>
      ))}

      {nums[nums.length - 1] < totalPages && (
        <>
          <span className="px-1 text-gray-500" aria-hidden>…</span>
          <button className={`${baseBtn} ${ghost}`} onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </button>
        </>
      )}

      <button
        type="button"
        className={`${baseBtn} ${ghost}`}
        onClick={() => canNext && onPageChange(page + 1)}
        disabled={!canNext}
        aria-disabled={!canNext}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination;
