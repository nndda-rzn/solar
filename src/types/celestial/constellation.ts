export interface ConstellationLine {
  from: string;
  to: string;
}

export interface ConstellationData {
  id: string;
  name: string;
  indonesianName: string;
  abbreviation: string;
  stars: string[];
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
