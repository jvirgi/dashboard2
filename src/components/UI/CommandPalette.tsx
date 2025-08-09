"use client";

import { useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { useFilters } from '@/lib/state';
import Link from 'next/link';

export default function CommandPalette() {
  const { dataset, toggleBrand, selectProductIds } = useFilters();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const data = useMemo(() => {
    const pages = [
      { type: 'page', name: 'Market Compare', href: '/market' },
      { type: 'page', name: 'Product Trends', href: '/product-trends' },
      { type: 'page', name: 'Market Trends', href: '/market-trends' },
    ];
    const brands = dataset.dimensions.brands.map((b) => ({ type: 'brand', id: b.brandId, name: b.brandName }));
    const products = dataset.dimensions.products.map((p) => ({ type: 'product', id: p.productId, name: p.productName }));
    return [...pages, ...brands, ...products];
  }, [dataset]);

  const fuse = useMemo(() => new Fuse(data as any, { keys: ['name'], threshold: 0.3 }), [data]);
  const results = q ? fuse.search(q).slice(0, 8).map((r) => r.item) : data.slice(0, 8);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[210] flex items-start justify-center pt-24">
      <div className="absolute inset-0 bg-black/20" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-xl card animate-scaleIn">
        <div className="p-3 border-b border-gray-100">
          <input className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-200" placeholder="Search (pages, brands, products)…" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
        </div>
        <div className="max-h-80 overflow-auto">
          {results.map((item: any, idx: number) => (
            <div key={idx} className="px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between">
              <div>{item.name}</div>
              {item.type === 'page' ? (
                <Link className="text-xs text-brand-700" href={item.href} onClick={() => setOpen(false)}>Go</Link>
              ) : item.type === 'brand' ? (
                <button className="text-xs text-brand-700" onClick={() => { toggleBrand(item.id); setOpen(false); }}>Filter</button>
              ) : (
                <button className="text-xs text-brand-700" onClick={() => { selectProductIds([item.id]); setOpen(false); }}>Focus</button>
              )}
            </div>
          ))}
          {!results.length && <div className="px-3 py-3 text-sm text-gray-500">No results</div>}
        </div>
        <div className="p-2 text-[11px] text-gray-500">Tip: Press Esc to close</div>
      </div>
    </div>
  );
}