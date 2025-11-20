import React from 'react';
import { theme } from './theme';

type TagVariant = 'default' | 'info' | 'success' | 'warning' | 'error' | 'outline';

export type TagProps = {
  children: React.ReactNode;
  variant?: TagVariant;
  className?: string;
  title?: string;
};

// PUBLIC_INTERFACE
export function Tag({ children, variant = 'default', className, title }: TagProps) {
  /** Tag/Badge component for small labels and recipe metadata. */
  const base =
    'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full transition-colors';
  const variants: Record<TagVariant, string> = {
    default: `bg-[${theme.colors.tagBg}] text-[${theme.colors.tagText}]`,
    info: 'bg-blue-50 text-blue-700',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    error: 'bg-rose-50 text-rose-700',
    outline: `border border-[${theme.colors.border}] text-[${theme.colors.text}]`,
  };

  return (
    <span
      className={`${base} ${variants[variant]} ${className || ''}`}
      aria-label={typeof children === 'string' ? children : title}
      title={title}
    >
      {children}
    </span>
  );
}

export default Tag;
