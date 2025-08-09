"use client";

import './globals.css';
import KPIBar from '@/components/KPIBar';
import ActiveFilterChips from '@/components/ActiveFilterChips';
import CommandPalette from '@/components/UI/CommandPalette';
import BaselineControls from '@/components/BaselineControls';
import SavedViewsBar from '@/components/SavedViewsBar';
import { FilterProvider } from '@/lib/state';
import ContextMenuOverlay from '@/components/UI/ContextMenu';
import DrilldownDrawer from '@/components/UI/DrilldownDrawer';
import Sidebar from '@/components/UI/Sidebar';
import TopBar from '@/components/UI/TopBar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[color:rgb(var(--surface-1))] text-slate-900 dark:bg-transparent dark:text-slate-100">
        <FilterProvider>
          <ContextMenuOverlay />
          <DrilldownDrawer />
          <div className="app-shell">
            <Sidebar />
            <div>
              <TopBar />
              <main className="container-padded py-6 animate-fadeIn">
                <KPIBar />
                <BaselineControls />
                <SavedViewsBar />
                <ActiveFilterChips />
                {children}
              </main>
            </div>
          </div>
          <CommandPalette />
        </FilterProvider>
      </body>
    </html>
  );
}