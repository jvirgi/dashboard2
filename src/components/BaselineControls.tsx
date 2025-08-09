"use client";

import { useFilters } from '@/lib/state';

export default function BaselineControls() {
  const { filters, baselineFrom, baselineTo, setBaselineRange, baselineBrandId, setBaselineBrandId, dataset } = useFilters();

  const brandName = baselineBrandId ? dataset.dimensions.brands.find((b) => b.brandId === baselineBrandId)?.brandName : undefined;

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
      <span className="text-gray-500">Baseline:</span>
      <button
        className="px-2 py-1 rounded-md border border-gray-200 hover:border-brand-300 hover:text-brand-700"
        onClick={() => setBaselineRange(filters.dateFrom, filters.dateTo)}
        title="Set baseline to current date range"
      >
        Set to current range
      </button>
      <button
        className="px-2 py-1 rounded-md border border-gray-200 hover:border-brand-300 hover:text-brand-700"
        onClick={() => setBaselineRange(undefined, undefined)}
      >
        Clear baseline range
      </button>
      <span className="text-gray-500">{baselineFrom && baselineTo ? `${baselineFrom} → ${baselineTo}` : 'None'}</span>
      <span className="ml-4 text-gray-500">Brand baseline:</span>
      {brandName ? (
        <span className="px-2 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">{brandName}
          <button className="ml-1 text-brand-700/70 hover:text-brand-700" onClick={() => setBaselineBrandId(undefined)}>×</button>
        </span>
      ) : (
        <span className="text-gray-500">None</span>
      )}
    </div>
  );
}