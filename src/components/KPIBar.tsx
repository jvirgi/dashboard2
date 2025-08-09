"use client";

import { useMemo } from 'react';
import { useFilters } from '@/lib/state';
import { applyFilters } from '@/lib/filters';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

function Card({ title, value, delta, children }: { title: string; value: string; delta?: number; children?: React.ReactNode }) {
  const deltaColor = delta === undefined ? 'text-gray-500' : delta >= 0 ? 'text-emerald-600' : 'text-rose-600';
  const deltaSign = delta && delta > 0 ? '+' : '';
  return (
    <div className="card p-3">
      <div className="text-[11px] uppercase text-gray-500 mb-1">{title}</div>
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <div className="text-xl font-semibold">{value}</div>
          {delta !== undefined && (
            <div className={`text-xs ${deltaColor}`}>{deltaSign}{Math.round(delta * 100)}%</div>
          )}
        </div>
        <div className="w-24 h-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function KPIBar() {
  const { dataset, filters, baselineFrom, baselineTo } = useFilters();
  const facts = useMemo(() => applyFilters(dataset, filters), [dataset, filters]);

  const series = useMemo(() => {
    const map: Record<string, { date: string; vol: number; ratingSum: number; ratingCnt: number; sentSum: number; sentCnt: number }> = {};
    for (const f of facts) {
      map[f.reviewDate] ||= { date: f.reviewDate, vol: 0, ratingSum: 0, ratingCnt: 0, sentSum: 0, sentCnt: 0 };
      map[f.reviewDate].vol += 1;
      map[f.reviewDate].ratingSum += f.starRating;
      map[f.reviewDate].ratingCnt += 1;
      map[f.reviewDate].sentSum += f.sentiment;
      map[f.reviewDate].sentCnt += 1;
    }
    return Object.values(map).sort((a, b) => (a.date < b.date ? -1 : 1)).map((d) => ({
      date: d.date,
      vol: d.vol,
      rating: d.ratingCnt ? d.ratingSum / d.ratingCnt : 0,
      sentiment: d.sentCnt ? d.sentSum / d.sentCnt : 0,
    }));
  }, [facts]);

  const current = useMemo(() => {
    const vol = facts.length;
    const rating = facts.reduce((s, f) => s + f.starRating, 0) / (facts.length || 1);
    const sentiment = facts.reduce((s, f) => s + f.sentiment, 0) / (facts.length || 1);
    return { vol, rating, sentiment };
  }, [facts]);

  const baselineDelta = useMemo(() => {
    if (!baselineFrom || !baselineTo) return { vol: undefined, rating: undefined, sentiment: undefined } as const;
    const inRange = facts.filter((f) => f.reviewDate >= baselineFrom && f.reviewDate <= baselineTo);
    if (!inRange.length) return { vol: undefined, rating: undefined, sentiment: undefined } as const;
    const vol = (current.vol - inRange.length) / Math.max(1, inRange.length);
    const rating = (current.rating - (inRange.reduce((s, f) => s + f.starRating, 0) / inRange.length)) / 5;
    const sentiment = (current.sentiment - (inRange.reduce((s, f) => s + f.sentiment, 0) / inRange.length));
    return { vol, rating, sentiment } as const;
  }, [baselineFrom, baselineTo, facts, current]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
      <Card title="Review Volume" value={current.vol.toLocaleString()} delta={baselineDelta.vol}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series}><Line type="monotone" dataKey="vol" stroke="#3b82f6" dot={false} /></LineChart>
        </ResponsiveContainer>
      </Card>
      <Card title="Avg Rating" value={current.rating.toFixed(2)} delta={baselineDelta.rating}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series}><Line type="monotone" dataKey="rating" stroke="#10b981" dot={false} /></LineChart>
        </ResponsiveContainer>
      </Card>
      <Card title="Avg Sentiment" value={current.sentiment.toFixed(2)} delta={baselineDelta.sentiment}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series}><Line type="monotone" dataKey="sentiment" stroke="#f59e0b" dot={false} /></LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}