"use client";

import { toPng } from 'html-to-image';
import { useRef } from 'react';
import { useFilters } from '@/lib/state';
import { applyFilters } from '@/lib/filters';

export default function ExportBar() {
  const ref = useRef<HTMLDivElement>(null);
  const { dataset, filters } = useFilters();

  const downloadPng = async () => {
    if (!ref.current) return;
    const dataUrl = await toPng(ref.current);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'dashboard.png';
    a.click();
  };

  const downloadCsv = () => {
    const facts = applyFilters(dataset, filters).slice(0, 2000);
    const headers = ['reviewId', 'productId', 'geoId', 'reviewDate', 'starRating', 'sentiment', 'title', 'text'];
    const rows = [headers.join(',')].concat(
      facts.map((f) => headers.map((h) => JSON.stringify((f as any)[h] ?? '')).join(','))
    );
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reviews.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-2 text-xs mb-4">
      <button className="px-2 py-1 rounded-md border border-gray-200 hover:border-brand-300 hover:text-brand-700" onClick={downloadPng}>Export PNG</button>
      <button className="px-2 py-1 rounded-md border border-gray-200 hover:border-brand-300 hover:text-brand-700" onClick={downloadCsv}>Export CSV</button>
      <div ref={ref} className="sr-only" aria-hidden />
    </div>
  );
}