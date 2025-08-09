"use client";

import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useMemo } from 'react';
import { useFilters } from '@/lib/state';
import { applyFilters } from '@/lib/filters';

export default function TrendChart({ metric = 'volume' as 'volume' | 'avgRating' | 'avgSentiment' }) {
  const { dataset, filters, setDateRange } = useFilters();

  const data = useMemo(() => {
    const facts = applyFilters(dataset, filters);
    const map: Record<string, { date: string; volume: number; avgRatingSum: number; avgRatingCount: number; avgSentimentSum: number; avgSentimentCount: number }> = {};

    for (const f of facts) {
      const date = f.reviewDate;
      map[date] ||= { date, volume: 0, avgRatingSum: 0, avgRatingCount: 0, avgSentimentSum: 0, avgSentimentCount: 0 };
      map[date].volume += 1;
      map[date].avgRatingSum += f.starRating;
      map[date].avgRatingCount += 1;
      map[date].avgSentimentSum += f.sentiment;
      map[date].avgSentimentCount += 1;
    }

    return Object.values(map)
      .map((d) => ({
        date: d.date,
        volume: d.volume,
        avgRating: d.avgRatingCount ? d.avgRatingSum / d.avgRatingCount : 0,
        avgSentiment: d.avgSentimentCount ? d.avgSentimentSum / d.avgSentimentCount : 0,
      }))
      .sort((a, b) => (a.date < b.date ? -1 : 1));
  }, [dataset, filters]);

  return (
    <div className="card">
      <div className="card-header">Trend over time</div>
      <div className="card-body h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            {metric === 'volume' && <Line type="monotone" dataKey="volume" stroke="#60a5fa" dot={false} />}
            {metric === 'avgRating' && <Line type="monotone" dataKey="avgRating" stroke="#34d399" dot={false} />}
            {metric === 'avgSentiment' && <Line type="monotone" dataKey="avgSentiment" stroke="#f59e0b" dot={false} />}
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-2 flex justify-end">
          <button className="text-xs text-gray-500 hover:text-brand-600" onClick={() => setDateRange(undefined, undefined)}>Clear date filter</button>
        </div>
      </div>
    </div>
  );
}