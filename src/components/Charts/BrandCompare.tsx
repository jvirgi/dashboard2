"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useMemo } from 'react';
import { useFilters } from '@/lib/state';
import { applyFilters } from '@/lib/filters';

export default function BrandCompare() {
  const { dataset, filters, toggleBrand } = useFilters();

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
      }))
      .sort((a, b) => b.volume - a.volume);
  }, [dataset, filters]);

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
            <Bar yAxisId="left" dataKey="volume" name="Review Volume" fill="#60a5fa" onClick={(d) => toggleBrand((d as any).brandId)} />
            <Bar yAxisId="right" dataKey="avgRating" name="Avg Rating" fill="#34d399" onClick={(d) => toggleBrand((d as any).brandId)} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}