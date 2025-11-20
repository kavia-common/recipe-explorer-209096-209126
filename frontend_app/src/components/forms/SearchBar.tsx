'use client';

import React from 'react';
import { theme } from '../ui/theme';

export type SearchBarProps = {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  label?: string;
  debounceMs?: number;
  className?: string;
};

// PUBLIC_INTERFACE
export function SearchBar({
  value = '',
  onChange,
  onSubmit,
  placeholder = 'Search recipes...',
  label = 'Search',
  debounceMs = 300,
  className,
}: SearchBarProps) {
  /** Debounced accessible search input with visible label and clear button. */
  const [internal, setInternal] = React.useState(value);
  const debounced = React.useRef<NodeJS.Timeout | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => setInternal(value), [value]);

  React.useEffect(() => {
    return () => {
      if (debounced.current) clearTimeout(debounced.current);
    };
  }, []);

  const emitChange = (val: string) => {
    if (!onChange) return;
    if (debounced.current) clearTimeout(debounced.current);
    debounced.current = setTimeout(() => onChange(val), debounceMs);
  };

  const clear = () => {
    setInternal('');
    onChange?.('');
    inputRef.current?.focus();
  };

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSubmit?.(internal);
  };

  return (
    <form onSubmit={submit} className={className} role="search" aria-label="Recipe search">
      <label htmlFor="searchbar-input" className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div
        className="flex items-center gap-2 rounded-md bg-white shadow-sm ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-blue-300 transition"
        style={{ borderRadius: 10 }}
      >
        <input
          id="searchbar-input"
          ref={inputRef}
          type="search"
          inputMode="search"
          value={internal}
          onChange={(e) => {
            setInternal(e.target.value);
            emitChange(e.target.value);
          }}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-gray-900 placeholder-gray-400 bg-transparent outline-none"
          aria-label={label}
        />
        {internal && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={clear}
            className="text-gray-400 hover:text-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 rounded-md"
            title="Clear"
          >
            ×
          </button>
        )}
        <button
          type="submit"
          className="mx-1 my-1 px-3 py-1.5 rounded-md text-white font-medium shadow-sm"
          style={{
            background: theme.colors.primary,
            transition: theme.transitions.base,
          }}
          onMouseEnter={(e) => ((e.currentTarget.style.background = theme.colors.primaryHover))}
          onMouseLeave={(e) => ((e.currentTarget.style.background = theme.colors.primary))}
        >
          Search
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
