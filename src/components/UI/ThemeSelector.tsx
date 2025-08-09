"use client";

import { useEffect, useState } from 'react';

const THEMES = [
  { id: 'classic', name: 'Classic (Blue)', darkCapable: true },
  { id: 'ocean', name: 'Ocean (Blue/Cyan)', darkCapable: true },
  { id: 'emerald', name: 'Emerald (Green/Teal)', darkCapable: true },
  { id: 'plum', name: 'Plum (Purple/Pink)', darkCapable: true },
  { id: 'slate', name: 'Slate (Neutral)', darkCapable: true },
];

export default function ThemeSelector() {
  const [theme, setTheme] = useState<string>('classic');
  const [dark, setDark] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('voc_theme');
      const storedDark = localStorage.getItem('voc_dark');
      if (stored) setTheme(stored);
      if (storedDark) setDark(storedDark === '1');
    } catch {}
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (dark) root.classList.add('dark'); else root.classList.remove('dark');
    try {
      localStorage.setItem('voc_theme', theme);
      localStorage.setItem('voc_dark', dark ? '1' : '0');
    } catch {}
  }, [theme, dark]);

  return (
    <div className="flex items-center gap-2">
      <select
        className="text-xs px-2 py-1 rounded-md border border-gray-200 hover:border-brand-300 dark:border-white/10 bg-white/70 dark:bg-white/10"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        title="Theme"
      >
        {THEMES.map((t) => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
      <button
        className="text-xs px-2 py-1 rounded-md border border-gray-200 hover:border-brand-300 hover:text-brand-700 dark:border-white/10 dark:hover:border-white/30"
        onClick={() => setDark((d) => !d)}
        title="Toggle dark mode"
      >
        {dark ? 'Light' : 'Dark'}
      </button>
    </div>
  );
}