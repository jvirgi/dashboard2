"use client";

import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { DATASET } from './sampleData';
import { DEFAULT_FILTERS, FilterState } from './filters';
import { useUrlSync } from './urlState';

export type ContextMenuItem = { label: string; onClick: () => void };
export type ContextMenuState = { x: number; y: number; items: ContextMenuItem[] } | null;

export type DrilldownState = { title: string; filtersPatch: Partial<FilterState> } | null;

export type SavedView = { id: string; name: string; filters: FilterState };

export type FilterContextType = {
  filters: FilterState;
  setFilters: (updater: (prev: FilterState) => FilterState) => void;
  applyFiltersPatch: (patch: Partial<FilterState>) => void;
  resetFilters: () => void;
  dataset: typeof DATASET;
  toggleBrand: (brandId: string) => void;
  toggleCategory: (categoryId: string) => void;
  toggleGeo: (geoId: string) => void;
  selectProductIds: (productIds: string[]) => void;
  setDateRange: (from?: string, to?: string) => void;
  // UI overlay
  contextMenu: ContextMenuState;
  showContextMenu: (cm: ContextMenuState) => void;
  hideContextMenu: () => void;
  drilldown: DrilldownState;
  openDrilldown: (d: DrilldownState) => void;
  closeDrilldown: () => void;
  // Baseline
  baselineBrandId?: string;
  setBaselineBrandId: (id?: string) => void;
  baselineFrom?: string;
  baselineTo?: string;
  setBaselineRange: (from?: string, to?: string) => void;
  // Saved views
  views: SavedView[];
  saveView: (name: string) => void;
  applyView: (id: string) => void;
  deleteView: (id: string) => void;
};

const FilterContext = createContext<FilterContextType | null>(null);

function loadViews(): SavedView[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('voc_views') || '[]') as SavedView[]; } catch { return []; }
}

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFiltersState] = useState<FilterState>({ ...DEFAULT_FILTERS });
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);
  const [drilldown, setDrilldown] = useState<DrilldownState>(null);
  const [baselineBrandId, setBaselineBrandId] = useState<string | undefined>(undefined);
  const [baselineFrom, setBaselineFrom] = useState<string | undefined>(undefined);
  const [baselineTo, setBaselineTo] = useState<string | undefined>(undefined);
  const [views, setViews] = useState<SavedView[]>([]);

  useEffect(() => setViews(loadViews()), []);

  useUrlSync(filters, (patch) => setFiltersState((prev) => ({ ...prev, ...patch })));

  const setFilters = (updater: (prev: FilterState) => FilterState) => {
    setFiltersState((prev) => ({ ...updater(prev) }));
  };

  const applyFiltersPatch = (patch: Partial<FilterState>) => setFiltersState((prev) => ({ ...prev, ...patch }));

  const resetFilters = () => setFiltersState({ ...DEFAULT_FILTERS });

  const toggleBrand = (brandId: string) =>
    setFilters((prev) => {
      const exists = prev.brandIds.includes(brandId);
      return { ...prev, brandIds: exists ? prev.brandIds.filter((b) => b !== brandId) : [...prev.brandIds, brandId] };
    });

  const toggleCategory = (categoryId: string) =>
    setFilters((prev) => {
      const exists = prev.categoryIds.includes(categoryId);
      return { ...prev, categoryIds: exists ? prev.categoryIds.filter((c) => c !== categoryId) : [...prev.categoryIds, categoryId] };
    });

  const toggleGeo = (geoId: string) =>
    setFilters((prev) => {
      const exists = prev.geoIds.includes(geoId);
      return { ...prev, geoIds: exists ? prev.geoIds.filter((g) => g !== geoId) : [...prev.geoIds, geoId] };
    });

  const selectProductIds = (productIds: string[]) => setFilters((prev) => ({ ...prev, productIds }));

  const setDateRange = (from?: string, to?: string) => setFilters((prev) => ({ ...prev, dateFrom: from, dateTo: to }));

  const showContextMenu = (cm: ContextMenuState) => setContextMenu(cm);
  const hideContextMenu = () => setContextMenu(null);

  const openDrilldown = (d: DrilldownState) => setDrilldown(d);
  const closeDrilldown = () => setDrilldown(null);

  const setBaselineRange = (from?: string, to?: string) => { setBaselineFrom(from); setBaselineTo(to); };

  const saveView = (name: string) => {
    const id = `${Date.now()}`;
    const next = [...views, { id, name, filters }];
    setViews(next);
    if (typeof window !== 'undefined') localStorage.setItem('voc_views', JSON.stringify(next));
  };

  const applyView = (id: string) => {
    const v = views.find((x) => x.id === id);
    if (v) setFiltersState({ ...v.filters });
  };

  const deleteView = (id: string) => {
    const next = views.filter((v) => v.id !== id);
    setViews(next);
    if (typeof window !== 'undefined') localStorage.setItem('voc_views', JSON.stringify(next));
  };

  const value = useMemo<FilterContextType>(
    () => ({
      filters,
      setFilters,
      applyFiltersPatch,
      resetFilters,
      dataset: DATASET,
      toggleBrand,
      toggleCategory,
      toggleGeo,
      selectProductIds,
      setDateRange,
      contextMenu,
      showContextMenu,
      hideContextMenu,
      drilldown,
      openDrilldown,
      closeDrilldown,
      baselineBrandId,
      setBaselineBrandId,
      baselineFrom,
      baselineTo,
      setBaselineRange,
      views,
      saveView,
      applyView,
      deleteView,
    }),
    [filters, contextMenu, drilldown, baselineBrandId, baselineFrom, baselineTo, views]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used within FilterProvider');
  return ctx;
}