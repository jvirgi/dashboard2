"use client";

import { useState } from 'react';
import { useFilters } from '@/lib/state';

export default function SavedViewsBar() {
  const { views, saveView, applyView, deleteView } = useFilters();
  const [name, setName] = useState('');

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
      <input className="px-2 py-1 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-200" value={name} onChange={(e) => setName(e.target.value)} placeholder="Save current view as…" />
      <button className="px-2 py-1 rounded-md border border-gray-200 hover:border-brand-300 hover:text-brand-700" onClick={() => { if (name.trim()) { saveView(name.trim()); setName(''); } }}>Save</button>
      {views.map((v) => (
        <span key={v.id} className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
          <button className="hover:underline" onClick={() => applyView(v.id)}>{v.name}</button>
          <button className="ml-1 text-gray-500 hover:text-rose-600" onClick={() => deleteView(v.id)}>×</button>
        </span>
      ))}
    </div>
  );
}