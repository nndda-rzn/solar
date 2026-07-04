export interface StarData {
  id: string;
  name: string;
  hip: number;
  ra: number;
  dec: number;
  magnitude: number;
  spectralType: string;
  color: string;
  distance: number;
  content: {
    en: {
      description: string;
      facts: string[];
    };
    id: {
      description: string;
      facts: string[];
    };
  };
}

export interface StarPosition extends StarData {
  x: number;
  y: number;
  z: number;
}

export interface StarCatalog {
  stars: StarData[];
}
