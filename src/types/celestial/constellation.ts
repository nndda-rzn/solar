export interface ConstellationLine {
  from: string;
  to: string;
}

export interface ConstellationCanvasStar {
  id: string;
  name: string;
  magnitude: number;
  type: "main-sequence" | "giant" | "supergiant" | "dwarf";
  color: string;
  x: number;
  y: number;
}

export interface ConstellationData {
  id: string;
  name: string;
  indonesianName: string;
  abbreviation: string;
  bestViewing: string;
  center: { x: number; y: number };
  stars: string[];
  canvasStars: ConstellationCanvasStar[];
  lines: ConstellationLine[];
  content: {
    en: {
      description: string;
      mythology: string;
    };
    id: {
      description: string;
      mythology: string;
    };
  };
}

export interface ConstellationCatalog {
  constellations: ConstellationData[];
}
