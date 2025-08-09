"use client";

import FilterPanel from '@/components/FilterPanel';
import AttributeHeatmap from '@/components/Charts/AttributeHeatmap';
import BrandCompare from '@/components/Charts/BrandCompare';
import RatingDistribution from '@/components/Charts/RatingDistribution';
import ReviewsTable from '@/components/ReviewsTable';
import { FilterProvider } from '@/lib/state';

export default function MarketPage() {
  return (
    <FilterProvider>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-4">
          <FilterPanel />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <BrandCompare />
          <RatingDistribution />
        </div>
        <div className="lg:col-span-2">
          <AttributeHeatmap />
        </div>
        <div className="lg:col-span-4">
          <ReviewsTable />
        </div>
      </div>
    </FilterProvider>
  );
}