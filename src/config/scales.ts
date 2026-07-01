export type ScaleMode = "solar" | "stellar" | "galactic" | "cosmic";

export interface ScaleConfig {
  id: ScaleMode;
  name: string;
  minDistance: number;
  maxDistance: number;
  label: string;
}

export const SCALES: Record<ScaleMode, ScaleConfig> = {
  solar: {
    id: "solar",
    name: "Solar System",
    minDistance: 5,
    maxDistance: 500,
    label: "Solar System",
  },
  stellar: {
    id: "stellar",
    name: "Stellar Neighborhood",
    minDistance: 500,
    maxDistance: 5000,
    label: "Stars",
  },
  galactic: {
    id: "galactic",
    name: "Galaxy",
    minDistance: 5000,
    maxDistance: 50000,
    label: "Galaxy",
  },
  cosmic: {
    id: "cosmic",
    name: "Cosmic",
    minDistance: 50000,
    maxDistance: 1000000,
    label: "Universe",
  },
};

export const ZOOM_THRESHOLDS: Record<string, number> = {
  "solar-stellar": 500,
  "stellar-galactic": 5000,
  "galactic-cosmic": 50000,
};
