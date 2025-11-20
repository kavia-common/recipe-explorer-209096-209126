'use client';

import React from 'react';
import { theme } from '../ui/theme';

export type FilterState = {
  cuisine: string;
  course: string;
  diet: string;
  maxTime: number | '';
};

export type FilterBarProps = {
  value: FilterState;
  onChange: (value: FilterState) => void;
  options?: {
    cuisines?: string[];
    courses?: string[];
    diets?: string[];
    times?: number[]; // minutes options
  };
  className?: string;
};

// PUBLIC_INTERFACE
export function FilterBar({
  value,
  onChange,
  options,
  className,
}: FilterBarProps) {
  /** Filter controls for cuisine, course, diet, and time with Reset. */
  const update = (patch: Partial<FilterState>) => {
    onChange({ ...value, ...patch });
  };

  const reset = () => {
    onChange({ cuisine: '', course: '', diet: '', maxTime: '' });
  };

  const Select = ({
    id,
    label,
    value,
    onChange,
    children,
  }: {
    id: string;
    label: string;
    value: string | number | '';
    onChange: (val: string | number | '') => void;
    children: React.ReactNode;
  }) => (
    <label className="flex flex-col gap-1 text-sm text-gray-700" htmlFor={id}>
      <span className="font-medium">{label}</span>
      <select
        id={id}
        value={value as string | number | ''}
        onChange={(e) => onChange(e.target.value as string)}
        className="px-3 py-2 rounded-md bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-300 outline-none"
      >
        {children}
      </select>
    </label>
  );

  return (
    <div
      className={`w-full bg-white rounded-xl p-3 md:p-4 shadow-sm ring-1 ring-gray-200 ${className || ''}`}
      style={{ borderRadius: 12 }}
      role="region"
      aria-label="Recipe filters"
    >
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
        <Select
          id="filter-cuisine"
          label="Cuisine"
          value={value.cuisine || ''}
          onChange={(v: string | number | '') => update({ cuisine: (v as string) || '' })}
        >
          <option value="">All</option>
          {(options?.cuisines || []).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>

        <Select
          id="filter-course"
          label="Course"
          value={value.course || ''}
          onChange={(v: string | number | '') => update({ course: (v as string) || '' })}
        >
          <option value="">All</option>
          {(options?.courses || []).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>

        <Select
          id="filter-diet"
          label="Diet"
          value={value.diet || ''}
          onChange={(v: string | number | '') => update({ diet: (v as string) || '' })}
        >
          <option value="">All</option>
          {(options?.diets || []).map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Select>

        <Select
          id="filter-time"
          label="Max Time"
          value={value.maxTime ?? ''}
          onChange={(v) => update({ maxTime: v ? Number(v) : '' })}
        >
          <option value="">Any</option>
          {(options?.times || [15, 30, 45, 60]).map((t) => (
            <option key={t} value={t}>{t} min</option>
          ))}
        </Select>

        <div className="flex justify-end md:justify-start">
          <button
            type="button"
            onClick={reset}
            className="h-10 px-4 rounded-md font-medium text-white shadow-sm"
            style={{ background: theme.colors.secondary, transition: theme.transitions.base }}
            onMouseEnter={(e) => ((e.currentTarget.style.filter = 'brightness(0.95)'))}
            onMouseLeave={(e) => ((e.currentTarget.style.filter = ''))}
            aria-label="Reset filters"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
