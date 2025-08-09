"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useMemo } from 'react';
import { useFilters } from '@/lib/state';
import { applyFilters } from '@/lib/filters';

export default function RatingDistribution() {
  const { dataset, filters, setFilters, showContextMenu, openDrilldown } = useFilters();

  const data = useMemo(() => {
    const facts = applyFilters(dataset, filters);
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1|2|3|4|5, number>;
    for (const f of facts) counts[f.starRating] += 1;
    return [1,2,3,4,5].map((r) => ({ rating: r, count: counts[r as 1|2|3|4|5], selected: (filters.minRating ?? 0) <= r }));
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
            <Bar dataKey="count" fill="#8b5cf6"
              onClick={(d) => setFilters((prev) => ({ ...prev, minRating: (d as any).rating }))}
              onContextMenu={(d, index, e: any) => {
                e.preventDefault();
                const row = d as any;
                showContextMenu({
                  x: e.clientX,
                  y: e.clientY,
                  items: [
                    { label: `Set min rating ≥ ${row.rating}`, onClick: () => setFilters((prev) => ({ ...prev, minRating: row.rating })) },
                    { label: `Drill into ${row.rating}-star reviews`, onClick: () => openDrilldown({ title: `${row.rating}-star reviews`, filtersPatch: {} }) },
                  ],
                });
              }}
              shape={(props: any) => {
                const row = (props as any).payload;
                const fill = row.selected ? '#6d28d9' : '#c4b5fd';
                return <rect {...props} fill={fill} rx={6} ry={6} />;
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}