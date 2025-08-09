"use client";

import FilterPanel from '@/components/FilterPanel';
import TrendChart from '@/components/Charts/TrendChart';
import ReviewsTable from '@/components/ReviewsTable';
import { FilterProvider } from '@/lib/state';
import ContextMenuOverlay from '@/components/UI/ContextMenu';
import DrilldownDrawer from '@/components/UI/DrilldownDrawer';

export default function ProductTrendsPage() {
  return (
    <FilterProvider>
      <ContextMenuOverlay />
      <DrilldownDrawer />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-4">
          <FilterPanel />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <TrendChart metric="volume" />
          <TrendChart metric="avgRating" />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <TrendChart metric="avgSentiment" />
          <div className="card">
            <div className="card-header">Insights & potential actions</div>
            <div className="card-body text-sm text-gray-700 space-y-2">
              <p>• Watchlist: Sudden dip in average rating signals potential quality issue in a subset of products. Consider QA deep-dive and customer outreach.</p>
              <p>• Opportunity: Positive lift in sentiment for “refill” attributes; consider expanding refillable lineup and messaging.</p>
              <p>• Test idea: A/B test new mint intensity descriptors for Oral Care in UK region based on feedback.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <ReviewsTable />
        </div>
      </div>
    </FilterProvider>
  );
}