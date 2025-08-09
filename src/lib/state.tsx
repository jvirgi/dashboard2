"use client";

import React, { createContext, useContext, useMemo, useState } from 'react';
import { DATASET } from './sampleData';
import { DEFAULT_FILTERS, FilterState } from './filters';

export type ContextMenuItem = { label: string; onClick: () => void };
export type ContextMenuState = { x: number; y: number; items: ContextMenuItem[] } | null;

export type DrilldownState = { title: string; filtersPatch: Partial<FilterState> } | null;

export type FilterContextType = {
  filters: FilterState;
  setFilters: (updater: (prev: FilterState) => FilterState) => void;
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
};

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFiltersState] = useState<FilterState>({ ...DEFAULT_FILTERS });
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);
  const [drilldown, setDrilldown] = useState<DrilldownState>(null);

  const setFilters = (updater: (prev: FilterState) => FilterState) => {
    setFiltersState((prev) => ({ ...updater(prev) }));
  };

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

  const value = useMemo<FilterContextType>(
    () => ({
      filters,
      setFilters,
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
    }),
    [filters, contextMenu, drilldown]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used within FilterProvider');
  return ctx;
}