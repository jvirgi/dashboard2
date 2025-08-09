import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VoC Analytics Dashboard',
  description: 'Voice of Consumer analytics for CPG products',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
          <div className="container-padded flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-brand-600" />
              <span className="font-semibold">VoC Analytics</span>
            </div>
            <nav className="flex items-center gap-6 text-sm">
              <Link className="hover:text-brand-600" href="/market">Market Compare</Link>
              <Link className="hover:text-brand-600" href="/product-trends">Product Trends</Link>
              <Link className="hover:text-brand-600" href="/market-trends">Market Trends</Link>
              <a className="text-gray-400" href="https://" target="_blank" rel="noreferrer">Docs</a>
            </nav>
          </div>
        </header>
        <main className="container-padded py-6">{children}</main>
      </body>
    </html>
  );
}