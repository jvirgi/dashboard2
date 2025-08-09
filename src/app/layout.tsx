"use client";

import './globals.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [isDark]);
  return (
    <button
      className="text-xs px-2 py-1 rounded-md border border-gray-200 hover:border-brand-300 hover:text-brand-700 dark:border-white/10 dark:hover:border-white/30"
      onClick={() => setIsDark((d) => !d)}
      title="Toggle theme"
    >
      {isDark ? 'Light' : 'Dark'}
    </button>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 dark:bg-transparent dark:text-gray-100">
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
              <ThemeToggle />
            </nav>
          </div>
        </header>
        <main className="container-padded py-6 animate-fadeIn">{children}</main>
      </body>
    </html>
  );
}