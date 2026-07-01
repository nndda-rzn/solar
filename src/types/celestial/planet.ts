export interface PlanetTextures {
  diffuse?: string;
  normal?: string;
  specular?: string;
  emissive?: string;
  clouds?: string;
  ring?: string;
}

export interface PlanetData {
  id: string;
  name: string;
  slug: string;
  radius: number;
  distance: number;
  orbitalPeriod: number;
  rotationSpeed: number;
  tilt: number;
  mass: string;
  temperature: string;
  moons: number;
  description: string;
  funFacts: string[];
  textures: PlanetTextures;
  hasRing?: boolean;
  hasAtmosphere?: boolean;
  atmosphereColor?: string;
}

export interface PlanetPosition {
  x: number;
  y: number;
  z: number;
}
