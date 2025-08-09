"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useMemo } from 'react';
import { useFilters } from '@/lib/state';
import { applyFilters } from '@/lib/filters';

export default function RatingDistribution() {
  const { dataset, filters, setFilters } = useFilters();

  const data = useMemo(() => {
    const facts = applyFilters(dataset, filters);
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1|2|3|4|5, number>;
    for (const f of facts) counts[f.starRating] += 1;
    return [1,2,3,4,5].map((r) => ({ rating: r, count: counts[r as 1|2|3|4|5] }));
  }, [dataset, filters]);

  return (
    <div className="card">
      <div className="card-header">Star rating distribution</div>
      <div className="card-body h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rating" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#8b5cf6" onClick={(d) => setFilters((prev) => ({ ...prev, minRating: (d as any).rating }))} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}