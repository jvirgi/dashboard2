"use client";

import { useEffect } from 'react';
import { useFilters } from '@/lib/state';

export default function ContextMenuOverlay() {
  const { contextMenu, hideContextMenu } = useFilters();

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') hideContextMenu(); };
    const onClick = () => hideContextMenu();
    if (contextMenu) {
      window.addEventListener('keydown', onEsc);
      window.addEventListener('click', onClick);
    }
    return () => {
      window.removeEventListener('keydown', onEsc);
      window.removeEventListener('click', onClick);
    };
  }, [contextMenu, hideContextMenu]);

  if (!contextMenu) return null;

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      <div
        className="absolute pointer-events-auto min-w-[220px] rounded-xl border border-gray-200 bg-white shadow-elevated overflow-hidden animate-scaleIn dark:bg-white/10 dark:text-gray-100 dark:border-white/10"
        style={{ left: contextMenu.x, top: contextMenu.y }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div className="py-1">
          {contextMenu.items.map((item, idx) => (
            <button
              key={idx}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/10"
              onClick={(e) => { e.stopPropagation(); item.onClick(); hideContextMenu(); }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}