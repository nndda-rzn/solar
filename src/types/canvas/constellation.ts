export interface ConstellationStar {
  id: string;
  name: string;
  magnitude: number;
  type: "main-sequence" | "giant" | "supergiant" | "dwarf";
  color: string;
  x: number;
  y: number;
}

export interface ConstellationLine {
  from: string;
  to: string;
}

export interface Constellation {
  id: string;
  name: string;
  indonesianName: string;
  description: string;
  mythology: string;
  bestViewing: string;
  stars: ConstellationStar[];
  lines: ConstellationLine[];
  center: { x: number; y: number };
}
