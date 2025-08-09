"use client";

import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Brush, ReferenceDot } from 'recharts';
import { useMemo } from 'react';
import { useFilters } from '@/lib/state';
import { applyFilters } from '@/lib/filters';

export default function TrendChart({ metric = 'volume' as 'volume' | 'avgRating' | 'avgSentiment' }) {
  const { dataset, filters, setDateRange, baselineFrom, baselineTo } = useFilters();

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

  const meanStd = useMemo(() => {
    const values = data.map((d) => (metric === 'volume' ? d.volume : metric === 'avgRating' ? d.avgRating : d.avgSentiment));
    const mean = values.reduce((s, v) => s + v, 0) / Math.max(1, values.length);
    const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / Math.max(1, values.length);
    const std = Math.sqrt(variance);
    const outliers = new Set(data.filter((d) => {
      const v = metric === 'volume' ? d.volume : metric === 'avgRating' ? d.avgRating : d.avgSentiment;
      return std > 0 && Math.abs((v - mean) / std) > 2.2;
    }).map((d) => d.date));
    return { mean, std, outliers };
  }, [data, metric]);

  return (
    <div className="card">
      <div className="card-header">Trend over time</div>
      <div className="card-body h-80">
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
            {data.map((d, i) => (
              meanStd.outliers.has(d.date) ? <ReferenceDot key={i} x={d.date} y={(metric === 'volume' ? d.volume : metric === 'avgRating' ? d.avgRating : d.avgSentiment)} r={4} fill="#ef4444" stroke="none" /> : null
            ))}
            <Brush dataKey="date" height={16} travellerWidth={8} stroke="#9ca3af" onChange={(range: any) => {
              if (!range?.startIndex || !range?.endIndex) return;
              const start = data[range.startIndex]?.date;
              const end = data[range.endIndex]?.date;
              if (start && end) setDateRange(start, end);
            }} />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <button className="hover:text-brand-600" onClick={() => setDateRange(undefined, undefined)}>Clear date filter</button>
          {baselineFrom && baselineTo && <div>Baseline: {baselineFrom} → {baselineTo}</div>}
        </div>
      </div>
    </div>
  );
}