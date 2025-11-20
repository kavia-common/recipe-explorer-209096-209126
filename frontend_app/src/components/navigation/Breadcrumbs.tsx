import Link from 'next/link';
import React from 'react';
import { theme } from '../ui/theme';

export type Crumb = {
  label: string;
  href?: string;
};

export type BreadcrumbsProps = {
  items: Crumb[];
  className?: string;
};

// PUBLIC_INTERFACE
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  /** Accessible breadcrumbs with proper nav/aria structure. */
  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-sm text-gray-600 ${className || ''}`}
    >
      <ol className="flex items-center gap-2">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-[color:var(--bread-link, #1D4ED8)] hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 rounded"
                  style={{ ['--bread-link' as unknown as string]: theme.colors.primary } as React.CSSProperties}
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="font-medium text-gray-900">
                  {item.label}
                </span>
              )}
              {!isLast && <span className="mx-2 text-gray-400">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
