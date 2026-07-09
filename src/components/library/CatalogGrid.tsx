"use client";

import { LibraryCard, type LibraryItemType } from "./LibraryCard";

export interface CatalogItem {
  id: string;
  title: string;
  subtitle?: string;
  type: LibraryItemType;
  accentColor?: string;
  stats?: Array<{ label: string; value: string }>;
}

export interface CatalogGridProps {
  items: CatalogItem[];
  emptyLabel: string;
  onSelect: (id: string, type: LibraryItemType) => void;
}

export function CatalogGrid({ items, emptyLabel, onSelect }: CatalogGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-white/10 bg-cosmic-nebula/20 p-6 text-center text-white/40">
        {emptyLabel}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <LibraryCard
          key={`${item.type}-${item.id}`}
          {...item}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
