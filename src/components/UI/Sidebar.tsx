"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function RailItem({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname.startsWith(href);
  return (
    <Link href={href as any} className={`rail-item ${active ? 'active' : ''}`} title={label} aria-label={label}>
      {icon}
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="app-rail flex flex-col items-center py-3 gap-3">
      <div className="h-9 w-9 rounded-lg brand-gradient" />
      <div className="mt-2 flex flex-col gap-2">
        <RailItem href="/market" label="Market" icon={<span>📊</span>} />
        <RailItem href="/product-trends" label="Trends" icon={<span>📈</span>} />
        <RailItem href="/market-trends" label="Discovery" icon={<span>🧭</span>} />
      </div>
      <div className="mt-auto flex flex-col gap-2">
        <a className="rail-item" href="#" title="Help" aria-label="Help">❓</a>
        <a className="rail-item" href="#" title="Profile" aria-label="Profile">👤</a>
      </div>
    </aside>
  );
}