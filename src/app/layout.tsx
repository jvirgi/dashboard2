"use client";

import './globals.css';
import Link from 'next/link';
import KPIBar from '@/components/KPIBar';
import ActiveFilterChips from '@/components/ActiveFilterChips';
import CommandPalette from '@/components/UI/CommandPalette';
import BaselineControls from '@/components/BaselineControls';
import SavedViewsBar from '@/components/SavedViewsBar';
import { FilterProvider } from '@/lib/state';
import ContextMenuOverlay from '@/components/UI/ContextMenu';
import DrilldownDrawer from '@/components/UI/DrilldownDrawer';
import ThemeSelector from '@/components/UI/ThemeSelector';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 dark:bg-transparent dark:text-gray-100">
        <FilterProvider>
          <ContextMenuOverlay />
          <DrilldownDrawer />
          <header className="sticky top-0 z-40 header-glass">
            <div className="container-padded flex items-center justify-between h-14">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent.purple" />
                <span className="font-semibold">VoC Analytics</span>
              </div>
              <nav className="flex items-center gap-6 text-sm">
                <Link className="hover:text-brand-600" href="/market">Market Compare</Link>
                <Link className="hover:text-brand-600" href="/product-trends">Product Trends</Link>
                <Link className="hover:text-brand-600" href="/market-trends">Market Trends</Link>
                <ThemeSelector />
              </nav>
            </div>
          </header>
          <main className="container-padded py-6 animate-fadeIn">
            <KPIBar />
            <BaselineControls />
            <SavedViewsBar />
            <ActiveFilterChips />
            {children}
          </main>
          <CommandPalette />
        </FilterProvider>
      </body>
    </html>
  );
}