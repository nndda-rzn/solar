import { PlanetPosition } from "@/types/celestial/planet";

export function calculateOrbitalPosition(
  distance: number,
  orbitalPeriod: number,
  dayOffset: number,
  tilt: number = 0,
): PlanetPosition {
  const angle = ((dayOffset / orbitalPeriod) * 2 * Math.PI) % (2 * Math.PI);
  const x = distance * Math.cos(angle);
  const z = distance * Math.sin(angle);
  const y = 0;

  return { x, y, z };
}

export function auToSceneUnits(au: number): number {
  return au * 10;
}

export function formatDistance(au: number): string {
  if (au < 0.01) {
    return `${(au * 149597870.7).toFixed(0)} km`;
  }
  if (au < 1) {
    return `${((au * 149597870.7) / 1000000).toFixed(1)} million km`;
  }
  return `${au.toFixed(2)} AU`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}
