"use client";

import { useMemo, useState } from 'react';
import { useFilters } from '@/lib/state';
import { applyFilters } from '@/lib/filters';
import { format } from 'date-fns';

export default function FilterPanel() {
  const { filters, setFilters, resetFilters, dataset, toggleBrand, toggleCategory, toggleGeo, selectProductIds, setDateRange } = useFilters();
  const { dimensions } = dataset;
  const [open, setOpen] = useState(true);

  const filteredFacts = useMemo(() => applyFilters(dataset, filters), [dataset, filters]);

  const [productSearch, setProductSearch] = useState(filters.productSearch);
  const [attrInput, setAttrInput] = useState('');

  const attributesUniverse = useMemo(() => {
    const set = new Set<string>();
    dimensions.products.forEach((p) => p.attributes.forEach((a) => set.add(a)));
    return Array.from(set).sort();
  }, [dimensions.products]);

  const productsOptions = useMemo(() => {
    const q = productSearch.toLowerCase();
    if (!q) return dimensions.products.slice(0, 200);
    return dimensions.products.filter((p) => p.productName.toLowerCase().includes(q)).slice(0, 200);
  }, [dimensions.products, productSearch]);

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>Filters</span>
          <span className="text-xs text-gray-500">({filteredFacts.length.toLocaleString()} reviews)</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm text-gray-500 hover:text-brand-600" onClick={() => resetFilters()}>Reset</button>
          <button className="text-sm text-gray-500 hover:text-brand-600" onClick={() => setOpen((o) => !o)}>{open ? 'Hide' : 'Show'}</button>
        </div>
      </div>
      {open && (
        <div className="card-body grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Geography</h3>
            <div className="max-h-40 overflow-auto space-y-2">
              {dimensions.geographies.map((g) => (
                <label key={g.geoId} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={filters.geoIds.includes(g.geoId)} onChange={() => toggleGeo(g.geoId)} />
                  <span>{g.country}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {dimensions.categories.map((c) => (
                <button key={c.categoryId} className={`px-2 py-1 rounded-full text-xs border ${filters.categoryIds.includes(c.categoryId) ? 'bg-brand-50 border-brand-200 text-brand-700' : 'border-gray-200 text-gray-700'}`} onClick={() => toggleCategory(c.categoryId)}>
                  {c.categoryName}
                </button>
              ))}
            </div>

            <h3 className="text-xs font-semibold text-gray-500 uppercase mt-4 mb-2">Brands</h3>
            <div className="flex flex-wrap gap-2">
              {dimensions.brands.map((b) => (
                <button key={b.brandId} className={`px-2 py-1 rounded-full text-xs border ${filters.brandIds.includes(b.brandId) ? 'bg-brand-50 border-brand-200 text-brand-700' : 'border-gray-200 text-gray-700'}`} onClick={() => toggleBrand(b.brandId)}>
                  {b.brandName}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Products (search + include/exclude)</h3>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. +mint -sensitive ultra"
              value={productSearch}
              onChange={(e) => {
                setProductSearch(e.target.value);
                setFilters((prev) => ({ ...prev, productSearch: e.target.value }));
              }}
            />
            <div className="mt-2 max-h-36 overflow-auto border border-gray-100 rounded-lg divide-y">
              {productsOptions.map((p) => (
                <label key={p.productId} className="flex items-center gap-2 px-2 py-1 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.productIds.includes(p.productId)}
                    onChange={(e) => {
                      const selected = new Set(filters.productIds);
                      if (e.target.checked) selected.add(p.productId);
                      else selected.delete(p.productId);
                      selectProductIds(Array.from(selected));
                    }}
                  />
                  <span className="truncate" title={p.productName}>{p.productName}</span>
                </label>
              ))}
            </div>

            <h3 className="text-xs font-semibold text-gray-500 uppercase mt-4 mb-2">Attributes</h3>
            <div className="flex items-center gap-2 mb-2">
              <input className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Add attribute" value={attrInput} onChange={(e) => setAttrInput(e.target.value)} />
              <button className="text-sm px-2 py-1 rounded-md border border-gray-200" onClick={() => {
                const v = attrInput.trim().toLowerCase();
                if (!v) return;
                if (!filters.attributes.includes(v)) setFilters((prev) => ({ ...prev, attributes: [...prev.attributes, v] }));
                setAttrInput('');
              }}>Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.attributes.map((a) => (
                <span key={a} className="px-2 py-1 rounded-full text-xs bg-gray-100">
                  {a}
                  <button className="ml-1 text-gray-500" onClick={() => setFilters((prev) => ({ ...prev, attributes: prev.attributes.filter((x) => x !== a) }))}>×</button>
                </span>
              ))}
            </div>
            <div className="mt-2 text-[11px] text-gray-500">Suggestions: {attributesUniverse.slice(0, 10).join(', ')}…</div>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Metrics</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <label className="flex flex-col gap-1">
                <span className="text-gray-500">Min Rating</span>
                <input type="number" min={1} max={5} step={1} value={filters.minRating ?? ''} onChange={(e) => setFilters((prev) => ({ ...prev, minRating: e.target.value ? Number(e.target.value) : undefined }))} className="border border-gray-200 rounded-lg px-3 py-2" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-gray-500">Min Sentiment</span>
                <input type="number" min={-1} max={1} step={0.1} value={filters.minSentiment ?? ''} onChange={(e) => setFilters((prev) => ({ ...prev, minSentiment: e.target.value ? Number(e.target.value) : undefined }))} className="border border-gray-200 rounded-lg px-3 py-2" />
              </label>
              <label className="flex flex-col gap-1 col-span-2">
                <span className="text-gray-500">Date Range</span>
                <div className="flex items-center gap-2">
                  <input type="date" value={filters.dateFrom ?? ''} onChange={(e) => setDateRange(e.target.value || undefined, filters.dateTo)} className="border border-gray-200 rounded-lg px-3 py-2" />
                  <span>to</span>
                  <input type="date" value={filters.dateTo ?? ''} onChange={(e) => setDateRange(filters.dateFrom, e.target.value || undefined)} className="border border-gray-200 rounded-lg px-3 py-2" />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {filters.dateFrom && filters.dateTo ? `${format(new Date(filters.dateFrom), 'MMM d, yyyy')} – ${format(new Date(filters.dateTo), 'MMM d, yyyy')}` : 'All time'}
                </div>
              </label>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}