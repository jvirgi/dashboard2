"use client";

import FilterPanel from '@/components/FilterPanel';
import TrendChart from '@/components/Charts/TrendChart';
import ReviewsTable from '@/components/ReviewsTable';
import { FilterProvider } from '@/lib/state';
import { useFilters } from '@/lib/state';
import { useMemo } from 'react';
import { applyFilters } from '@/lib/filters';

function EmergingTopics() {
  const { dataset, filters } = useFilters();
  const topics = useMemo(() => {
    const facts = applyFilters(dataset, filters);
    const counts = new Map<string, number>();
    for (const f of facts) {
      for (const a of f.attributesMentioned) counts.set(a, (counts.get(a) ?? 0) + (f.sentiment >= 0 ? 2 : 1));
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, [dataset, filters]);

  return (
    <div className="card">
      <div className="card-header">Emerging topics</div>
      <div className="card-body flex flex-wrap gap-2">
        {topics.map(([topic, score]) => (
          <span key={topic} className="px-2 py-1 rounded-full text-xs bg-brand-50 text-brand-700 border border-brand-100">{topic} <span className="text-gray-500">({score})</span></span>
        ))}
      </div>
    </div>
  );
}

function NewEntrants() {
  const { dataset, filters } = useFilters();
  const entrants = useMemo(() => {
    const facts = applyFilters(dataset, filters);
    const byProduct = new Map<string, number>();
    for (const f of facts) byProduct.set(f.productId, (byProduct.get(f.productId) ?? 0) + 1);
    return Array.from(byProduct.entries()).sort((a, b) => a[1] - b[1]).slice(0, 8).map(([pid]) => dataset.dimensions.products.find((p) => p.productId === pid)!);
  }, [dataset, filters]);

  return (
    <div className="card">
      <div className="card-header">Potential new entrants or niche growth</div>
      <div className="card-body grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {entrants.map((p) => (
          <div key={p.productId} className="p-3 border border-gray-100 rounded-lg bg-white">
            <div className="text-sm font-medium">{p.productName}</div>
            <div className="text-xs text-gray-500">{p.attributes.join(', ')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MarketTrendsPage() {
  return (
    <FilterProvider>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-4">
          <FilterPanel />
        </div>
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <TrendChart metric="volume" />
          <TrendChart metric="avgSentiment" />
          <TrendChart metric="avgRating" />
        </div>
        <div className="lg:col-span-2">
          <EmergingTopics />
        </div>
        <div className="lg:col-span-2">
          <NewEntrants />
        </div>
        <div className="lg:col-span-4">
          <ReviewsTable />
        </div>
      </div>
    </FilterProvider>
  );
}