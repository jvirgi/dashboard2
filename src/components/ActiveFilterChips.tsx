"use client";

import { useMemo } from 'react';
import { useFilters } from '@/lib/state';

export default function ActiveFilterChips() {
  const { filters, applyFiltersPatch, dataset, resetFilters } = useFilters();

  const chips = useMemo(() => {
    const out: { label: string; onRemove: () => void }[] = [];
    const { dimensions } = dataset;
    if (filters.brandIds.length) {
      for (const id of filters.brandIds) {
        const b = dimensions.brands.find((x) => x.brandId === id);
        out.push({ label: `Brand: ${b?.brandName ?? id}`, onRemove: () => applyFiltersPatch({ brandIds: filters.brandIds.filter((x) => x !== id) }) });
      }
    }
    if (filters.categoryIds.length) for (const id of filters.categoryIds) { const c = dimensions.categories.find((x) => x.categoryId === id); out.push({ label: `Category: ${c?.categoryName ?? id}`, onRemove: () => applyFiltersPatch({ categoryIds: filters.categoryIds.filter((x) => x !== id) }) }); }
    if (filters.geoIds.length) for (const id of filters.geoIds) { const g = dimensions.geographies.find((x) => x.geoId === id); out.push({ label: `Geo: ${g?.country ?? id}`, onRemove: () => applyFiltersPatch({ geoIds: filters.geoIds.filter((x) => x !== id) }) }); }
    if (filters.attributes.length) for (const a of filters.attributes) out.push({ label: `Attr: ${a}`, onRemove: () => applyFiltersPatch({ attributes: filters.attributes.filter((x) => x !== a) }) });
    if (filters.productSearch) out.push({ label: `Search: ${filters.productSearch}`, onRemove: () => applyFiltersPatch({ productSearch: '' }) });
    if (filters.minRating) out.push({ label: `Min Rating: ${filters.minRating}`, onRemove: () => applyFiltersPatch({ minRating: undefined }) });
    if (filters.minSentiment) out.push({ label: `Min Sentiment: ${filters.minSentiment}`, onRemove: () => applyFiltersPatch({ minSentiment: undefined }) });
    if (filters.dateFrom || filters.dateTo) out.push({ label: `Date: ${filters.dateFrom ?? ''}→${filters.dateTo ?? ''}`, onRemove: () => applyFiltersPatch({ dateFrom: undefined, dateTo: undefined }) });
    return out;
  }, [filters, dataset, applyFiltersPatch]);

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map((c, i) => (
        <span key={i} className="px-2 py-1 rounded-full text-xs bg-brand-50 text-brand-700 border border-brand-200">
          {c.label}
          <button className="ml-1 text-brand-700/70 hover:text-brand-700" onClick={c.onRemove}>×</button>
        </span>
      ))}
      <button className="text-xs px-2 py-1 rounded-md border border-gray-200 hover:border-brand-300 hover:text-brand-700" onClick={() => resetFilters()}>Clear all</button>
    </div>
  );
}