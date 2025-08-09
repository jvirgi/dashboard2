"use client";

import { useMemo, useState } from 'react';
import { applyFilters } from '@/lib/filters';
import { useFilters } from '@/lib/state';
import { format } from 'date-fns';

export default function ReviewsTable() {
  const { dataset, filters, toggleBrand, selectProductIds } = useFilters();
  const facts = useMemo(() => applyFilters(dataset, filters).slice(0, 300), [dataset, filters]);
  const [activeReview, setActiveReview] = useState<string | null>(null);

  const productById = useMemo(() => Object.fromEntries(dataset.dimensions.products.map((p) => [p.productId, p])), [dataset]);
  const brandById = useMemo(() => Object.fromEntries(dataset.dimensions.brands.map((b) => [b.brandId, b])), [dataset]);
  const geoById = useMemo(() => Object.fromEntries(dataset.dimensions.geographies.map((g) => [g.geoId, g])), [dataset]);

  return (
    <div className="card">
      <div className="card-header">Consumer comments</div>
      <div className="card-body">
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 pr-2">Date</th>
                <th className="py-2 pr-2">Brand</th>
                <th className="py-2 pr-2">Product</th>
                <th className="py-2 pr-2">Rating</th>
                <th className="py-2 pr-2">Sentiment</th>
                <th className="py-2 pr-2">Geo</th>
                <th className="py-2 pr-2">Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {facts.map((f) => {
                const p = productById[f.productId];
                const b = brandById[p.brandId];
                const g = geoById[f.geoId];
                return (
                  <tr key={f.reviewId} className="hover:bg-gray-50">
                    <td className="py-2 pr-2 whitespace-nowrap">{format(new Date(f.reviewDate), 'yyyy-MM-dd')}</td>
                    <td className="py-2 pr-2">
                      <button className="text-brand-700 hover:underline" onClick={() => toggleBrand(p.brandId)}>{b.brandName}</button>
                    </td>
                    <td className="py-2 pr-2 max-w-[240px]">
                      <button className="text-gray-700 hover:underline" onClick={() => selectProductIds([p.productId])}>{p.productName}</button>
                    </td>
                    <td className="py-2 pr-2">{'★'.repeat(f.starRating)}{'☆'.repeat(5 - f.starRating)}</td>
                    <td className="py-2 pr-2">{f.sentiment.toFixed(2)}</td>
                    <td className="py-2 pr-2">{g.country}</td>
                    <td className="py-2 pr-2">
                      <button className="text-left hover:underline" onClick={() => setActiveReview(activeReview === f.reviewId ? null : f.reviewId)}>
                        {f.title ? `${f.title} — ` : ''}{f.text}
                      </button>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {f.attributesMentioned.map((a) => (
                          <span key={a} className="px-1.5 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-700">{a}</span>
                        ))}
                      </div>
                      {activeReview === f.reviewId && (
                        <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-100 text-xs text-gray-600">
                          <div><strong>Detail:</strong> This review mentions {f.attributesMentioned.join(', ')}.</div>
                          <div><strong>Possible action:</strong> Investigate {f.sentiment < 0 ? 'quality or fit issues' : 'amplifying positive attributes'} for similar products.</div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}