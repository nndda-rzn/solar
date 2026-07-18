import { StarData, StarPosition } from "@/types/celestial/star";

const STELLAR_RADIUS = 1000;

export function raDecToCartesian(
  ra: number,
  dec: number,
  radius: number = STELLAR_RADIUS,
): { x: number; y: number; z: number } {
  const raRad = (ra * Math.PI) / 180;
  const decRad = (dec * Math.PI) / 180;

  const x = radius * Math.cos(decRad) * Math.cos(raRad);
  const y = radius * Math.sin(decRad);
  const z = radius * Math.cos(decRad) * Math.sin(raRad);

  return { x, y, z };
}

export function positionStar(star: StarData): StarPosition {
  const { x, y, z } = raDecToCartesian(star.ra, star.dec);
  return { ...star, x, y, z };
}

export function positionStars(stars: StarData[]): StarPosition[] {
  return stars.map(positionStar);
}

export function magnitudeToSize(magnitude: number): number {
  const minSize = 0.5;
  const maxSize = 3.0;
  const minMag = -1.5;
  const maxMag = 6.0;

  const normalized = Math.max(
    0,
    Math.min(1, (maxMag - magnitude) / (maxMag - minMag)),
  );
  return minSize + normalized * (maxSize - minSize);
}

export function magnitudeToGlowScale(magnitude: number): number {
  const minGlow = 1.5;
  const maxGlow = 4.0;
  const minMag = -1.5;
  const maxMag = 6.0;

  const normalized = Math.max(
    0,
    Math.min(1, (maxMag - magnitude) / (maxMag - minMag)),
  );
  return minGlow + normalized * (maxGlow - minGlow);
}
