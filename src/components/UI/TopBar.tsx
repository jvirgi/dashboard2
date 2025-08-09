"use client";

import ThemeSelector from '@/components/UI/ThemeSelector';
import { useState } from 'react';

export default function TopBar() {
  const [q, setQ] = useState('');
  return (
    <div className="topbar">
      <div className="container-padded h-14 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <input
            className="w-full max-w-md px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:rgb(var(--brand))]/30 bg-white/80"
            placeholder="Search products, brands, topics…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost">Export</button>
          <button className="btn btn-primary">Save view</button>
          <ThemeSelector />
        </div>
      </div>
    </div>
  );
}