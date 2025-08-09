"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useMemo } from 'react';
import { useFilters } from '@/lib/state';
import { applyFilters } from '@/lib/filters';

export default function BrandCompare() {
  const { dataset, filters, toggleBrand, showContextMenu, openDrilldown } = useFilters();

  const data = useMemo(() => {
    const facts = applyFilters(dataset, { ...filters, brandIds: [] });
    const byBrand: Record<string, { brandName: string; volume: number; avgRating: number; avgSentiment: number }> = {};
    const brandNameById = Object.fromEntries(dataset.dimensions.brands.map((b) => [b.brandId, b.brandName]));
    const ratingsByBrand: Record<string, { sum: number; count: number; sent: number }> = {};

    for (const f of facts) {
      const product = dataset.dimensions.products.find((p) => p.productId === f.productId)!;
      const brandId = product.brandId;
      byBrand[brandId] ||= { brandName: brandNameById[brandId], volume: 0, avgRating: 0, avgSentiment: 0 };
      byBrand[brandId].volume += 1;
      ratingsByBrand[brandId] ||= { sum: 0, count: 0, sent: 0 };
      ratingsByBrand[brandId].sum += f.starRating;
      ratingsByBrand[brandId].sent += f.sentiment;
      ratingsByBrand[brandId].count += 1;
    }

    return Object.entries(byBrand)
      .map(([brandId, v]) => ({
        brandId,
        brandName: v.brandName,
        volume: v.volume,
        avgRating: ratingsByBrand[brandId].sum / ratingsByBrand[brandId].count,
        avgSentiment: ratingsByBrand[brandId].sent / ratingsByBrand[brandId].count,
        selected: filters.brandIds.includes(brandId),
      }))
      .sort((a, b) => b.volume - a.volume);
  }, [dataset, filters]);

  const barFill = (selected: boolean) => (selected ? '#2563eb' : '#93c5fd');
  const barFill2 = (selected: boolean) => (selected ? '#10b981' : '#a7f3d0');

  return (
    <div className="card">
      <div className="card-header">Brand comparison: Volume, Avg Rating, Sentiment</div>
      <div className="card-body h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 24 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="brandName" angle={-15} textAnchor="end" height={50} />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="volume" name="Review Volume" fill="#60a5fa"
              onClick={(d) => toggleBrand((d as any).brandId)}
              onContextMenu={(d, index, e: any) => {
                e.preventDefault();
                const row = d as any;
                showContextMenu({
                  x: e.clientX,
                  y: e.clientY,
                  items: [
                    { label: `Filter to ${row.brandName}`, onClick: () => toggleBrand(row.brandId) },
                    { label: `Exclude ${row.brandName}`, onClick: () => {/* Exclude via setFilters could be added */} },
                    { label: `Drill into ${row.brandName} reviews`, onClick: () => openDrilldown({ title: `${row.brandName} • reviews`, filtersPatch: { brandIds: [row.brandId] } }) },
                  ],
                });
              }}
              shape={(props: any) => {
                const row = (props as any).payload;
                return (
                  <rect {...props} fill={barFill(row.selected)} rx={6} ry={6} />
                );
              }}
            />
            <Bar yAxisId="right" dataKey="avgRating" name="Avg Rating" fill="#34d399"
              onClick={(d) => toggleBrand((d as any).brandId)}
              onContextMenu={(d, index, e: any) => {
                e.preventDefault();
                const row = d as any;
                showContextMenu({
                  x: e.clientX,
                  y: e.clientY,
                  items: [
                    { label: `Filter to ${row.brandName}`, onClick: () => toggleBrand(row.brandId) },
                    { label: `Drill into ${row.brandName} reviews`, onClick: () => openDrilldown({ title: `${row.brandName} • reviews`, filtersPatch: { brandIds: [row.brandId] } }) },
                  ],
                });
              }}
              shape={(props: any) => {
                const row = (props as any).payload;
                return <rect {...props} fill={barFill2(row.selected)} rx={6} ry={6} />;
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}