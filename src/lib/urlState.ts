"use client";

import { useEffect } from 'react';
import { FilterState } from './filters';

function serialize(filters: FilterState): string {
  const params = new URLSearchParams();
  if (filters.geoIds.length) params.set('geo', filters.geoIds.join(','));
  if (filters.categoryIds.length) params.set('cat', filters.categoryIds.join(','));
  if (filters.brandIds.length) params.set('brand', filters.brandIds.join(','));
  if (filters.productIds.length) params.set('prod', filters.productIds.join(','));
  if (filters.attributes.length) params.set('attr', filters.attributes.join(','));
  if (filters.productSearch) params.set('q', filters.productSearch);
  if (filters.minRating) params.set('minR', String(filters.minRating));
  if (filters.minSentiment) params.set('minS', String(filters.minSentiment));
  if (filters.dateFrom) params.set('from', filters.dateFrom);
  if (filters.dateTo) params.set('to', filters.dateTo);
  return params.toString();
}

function parse(qs: string): Partial<FilterState> {
  const params = new URLSearchParams(qs);
  const getList = (key: string) => (params.get(key)?.split(',').filter(Boolean) ?? []);
  const patch: Partial<FilterState> = {
    geoIds: getList('geo'),
    categoryIds: getList('cat'),
    brandIds: getList('brand'),
    productIds: getList('prod'),
    attributes: getList('attr'),
    productSearch: params.get('q') ?? '',
  };
  const minR = params.get('minR');
  if (minR) patch.minRating = Number(minR);
  const minS = params.get('minS');
  if (minS) patch.minSentiment = Number(minS);
  const from = params.get('from');
  const to = params.get('to');
  if (from) patch.dateFrom = from;
  if (to) patch.dateTo = to;
  return patch;
}

export function useUrlSync(filters: FilterState, applyPatch: (p: Partial<FilterState>) => void) {
  // Load from URL on mount
  useEffect(() => {
    const patch = parse(window.location.search);
    const hasAny = Object.keys(patch).some((k) => (patch as any)[k] && (Array.isArray((patch as any)[k]) ? (patch as any)[k].length : true));
    if (hasAny) applyPatch(patch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push to URL on changes
  useEffect(() => {
    const qs = serialize(filters);
    const url = qs ? `?${qs}` : window.location.pathname;
    window.history.replaceState(null, '', url);
  }, [filters]);
}