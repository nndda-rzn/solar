export interface ProceduralTextureConfig {
  baseColor: string;
  noiseScale: number;
  noiseType: "simplex" | "fbm" | "ridged";
  detailLevel: number;
}

export interface DwarfPlanetData {
  id: string;
  name: string;
  slug: string;
  radius: number;
  distance: number;
  distanceScaled: number;
  orbitalPeriod: number;
  rotationSpeed: number;
  tilt: number;
  mass: string;
  temperature: string;
  moonCount: number;
  description: string;
  funFacts: string[];
  proceduralTexture: ProceduralTextureConfig;
  color: string;
}
