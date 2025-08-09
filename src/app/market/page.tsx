"use client";

import AttributeHeatmap from '@/components/Charts/AttributeHeatmap';
import BrandCompare from '@/components/Charts/BrandCompare';
import RatingDistribution from '@/components/Charts/RatingDistribution';
import ReviewsTable from '@/components/ReviewsTable';
import FilterDrawer from '@/components/UI/FilterDrawer';

export default function MarketPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-4">
        <FilterDrawer />
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
  );
}