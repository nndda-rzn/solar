"use client";

import { ConstellationCatalog } from "@/types/celestial/constellation";
import constellationData from "@/data/stellar/constellations.json";

export function useConstellationData() {
  const catalog = constellationData as ConstellationCatalog;

  const getConstellationById = (id: string) => {
    return catalog.constellations.find((c) => c.id === id);
  };

  return {
    constellations: catalog.constellations,
    getConstellationById,
  };
}
