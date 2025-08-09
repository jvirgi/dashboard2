"use client";

import { useState } from 'react';
import FilterPanel from '@/components/FilterPanel';

export default function FilterDrawer() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <button className="btn btn-primary" onClick={() => setOpen(true)}>Filters</button>
      </div>
      {open && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-[#0f1627] shadow-elevated">
            <div className="p-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
              <div className="text-sm font-semibold">Filters</div>
              <button className="btn btn-ghost" onClick={() => setOpen(false)}>Close</button>
            </div>
            <div className="p-4 overflow-auto h-[calc(100%-56px)]">
              <FilterPanel />
            </div>
          </div>
        </div>
      )}
    </>
  );
}