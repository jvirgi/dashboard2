"use client";

import { useMemo } from 'react';
import { useFilters } from '@/lib/state';
import { applyFilters } from '@/lib/filters';

function colorFor(value: number) {
  // value 0..1 -> color scale green to red
  const r = Math.round(255 * (1 - value));
  const g = Math.round(255 * value);
  return `rgb(${r}, ${g}, 96)`;
}

export default function AttributeHeatmap() {
  const { dataset, filters, toggleBrand } = useFilters();

  const { brands, attributes, matrix } = useMemo(() => {
    const facts = applyFilters(dataset, { ...filters, brandIds: [] });
    const brandIds = dataset.dimensions.brands.map((b) => b.brandId);
    const brandName = Object.fromEntries(dataset.dimensions.brands.map((b) => [b.brandId, b.brandName]));
    const attributeSet = new Set<string>();
    dataset.dimensions.products.forEach((p) => p.attributes.forEach((a) => attributeSet.add(a)));
    const attrs = Array.from(attributeSet).sort().slice(0, 20);

    const counts: Record<string, Record<string, { pos: number; neg: number }>> = {};

    for (const f of facts) {
      const product = dataset.dimensions.products.find((p) => p.productId === f.productId)!;
      const brand = product.brandId;
      counts[brand] ||= {} as any;
      for (const a of f.attributesMentioned) {
        if (!attrs.includes(a)) continue;
        counts[brand][a] ||= { pos: 0, neg: 0 };
        if (f.sentiment >= 0) counts[brand][a].pos += 1;
        else counts[brand][a].neg += 1;
      }
    }

    const mat = brandIds.map((b) => attrs.map((a) => {
      const cell = counts[b]?.[a];
      const total = (cell?.pos ?? 0) + (cell?.neg ?? 0);
      const score = total ? (cell!.pos / total) : 0.5; // 0..1, 0.5 neutral
      return { total, score };
    }));

    return { brands: brandIds.map((id) => ({ id, name: brandName[id] })), attributes: attrs, matrix: mat };
  }, [dataset, filters]);

  return (
    <div className="card">
      <div className="card-header">Attribute sentiment by brand</div>
      <div className="card-body overflow-auto">
        <div className="min-w-[700px]">
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${attributes.length}, minmax(28px, 1fr))` }}>
            <div />
            {attributes.map((a) => (
              <div key={a} className="text-[10px] text-gray-500 text-center px-1 truncate" title={a}>{a}</div>
            ))}
            {brands.map((b, i) => (
              <>
                <button key={`${b.id}-label`} className="text-left text-xs font-medium pr-2 hover:text-brand-600" onClick={() => toggleBrand(b.id)}>
                  {b.name}
                </button>
                {matrix[i].map((cell, j) => (
                  <div key={`${b.id}-${attributes[j]}`} className="h-7 border border-white" style={{ backgroundColor: colorFor(cell.score) }} title={`${attributes[j]}: ${(cell.score * 100).toFixed(0)}% positive (${cell.total})`} />
                ))}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}