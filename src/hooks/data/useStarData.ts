"use client";

import { useMemo } from "react";
import { StarData, StarCatalog } from "@/types/celestial/star";
import { positionStars } from "@/lib/utils/coordinates";
import starCatalogData from "@/data/stellar/star-catalog.json";

export function useStarData() {
  const catalog = starCatalogData as StarCatalog;

  const stars = useMemo(() => positionStars(catalog.stars), [catalog.stars]);

  const getStarById = (id: string) => {
    return stars.find((s) => s.id === id);
  };

  return {
    stars,
    getStarById,
  };
}
