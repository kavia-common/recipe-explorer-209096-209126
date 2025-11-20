"use client";

import React from "react";
import { Tag } from "@/components/ui/Tag";
import type { Recipe } from "@/lib/types";
import { classNames } from "@/lib/utils";

/**
 * PUBLIC_INTERFACE
 * Client-only checklist for recipe ingredients with local checkbox state.
 */
export default function IngredientsChecklist({
  ingredients,
}: {
  ingredients: Recipe["ingredients"];
}) {
  const [checked, setChecked] = React.useState<Set<number>>(new Set());

  return (
    <section className="card p-4 md:p-6" aria-label="Ingredients" role="region">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Ingredients</h2>
        <button
          type="button"
          className="button"
          onClick={() => setChecked(new Set())}
          aria-label="Clear checked ingredients"
        >
          Clear checks
        </button>
      </header>

      <ul className="space-y-2">
        {ingredients?.map((ing, idx) => {
          const id = `ing-${idx}`;
          const isChecked = checked.has(idx);
          return (
            <li key={id} className="flex items-start gap-3">
              <input
                id={id}
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300"
                checked={isChecked}
                onChange={() =>
                  setChecked((prev) => {
                    const next = new Set(prev);
                    if (isChecked) next.delete(idx);
                    else next.add(idx);
                    return next;
                  })
                }
                aria-describedby={`${id}-label`}
              />
              <label
                id={`${id}-label`}
                htmlFor={id}
                className={classNames(
                  "flex-1 cursor-pointer",
                  isChecked ? "text-gray-400 line-through" : "text-gray-900"
                )}
              >
                <span className="font-medium capitalize">{ing.name}</span>
                <span className="ml-2 text-gray-700">
                  {[
                    ing.quantity != null && ing.quantity !== "" ? ing.quantity : "",
                    ing.unit || "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                </span>
                {ing.note && (
                  <span className="ml-2 text-gray-500">({ing.note})</span>
                )}
                {ing.optional && (
                  <Tag className="ml-2 align-middle" variant="outline" title="Optional">
                    optional
                  </Tag>
                )}
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
