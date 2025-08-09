"use client";

import { useMemo } from 'react';
import { useFilters } from '@/lib/state';
import { applyFilters } from '@/lib/filters';

export default function DrilldownDrawer() {
  const { dataset, filters, drilldown, closeDrilldown } = useFilters();
  const mergedFilters = useMemo(() => ({ ...filters, ...(drilldown?.filtersPatch ?? {}) }), [filters, drilldown]);
  const facts = useMemo(() => applyFilters(dataset, mergedFilters).slice(0, 100), [dataset, mergedFilters]);

  if (!drilldown) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[190] animate-slideUp">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-t-2xl shadow-elevated border border-gray-200 bg-white/80 backdrop-blur dark:bg-white/10 dark:border-white/10">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/10">
            <div className="text-sm font-semibold">{drilldown.title}</div>
            <button className="text-sm text-gray-500 hover:text-brand-600" onClick={closeDrilldown}>Close</button>
          </div>
          <div className="max-h-[50vh] overflow-auto p-4 text-sm">
            {facts.map((f) => (
              <div key={f.reviewId} className="py-2 border-b border-gray-100 last:border-b-0 dark:border-white/10">
                <div className="text-gray-800 dark:text-gray-100">{f.title ? `${f.title} — ` : ''}{f.text}</div>
                <div className="text-[11px] text-gray-500 mt-1">Rating: {f.starRating} • Sentiment: {f.sentiment.toFixed(2)} • Date: {f.reviewDate}</div>
              </div>
            ))}
            {facts.length === 0 && <div className="text-gray-500">No reviews match this drilldown.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}