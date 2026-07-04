import { StarCatalog } from "@/types/celestial/star";
import { ConstellationCatalog } from "@/types/celestial/constellation";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateStellarData(
  stars: StarCatalog,
  constellations: ConstellationCatalog,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const starIds = new Set(stars.stars.map((s) => s.id));

  for (const c of constellations.constellations) {
    for (const line of c.lines) {
      if (!starIds.has(line.from)) {
        errors.push(
          `Constellation "${c.id}": star "${line.from}" not found in catalog`,
        );
      }
      if (!starIds.has(line.to)) {
        errors.push(
          `Constellation "${c.id}": star "${line.to}" not found in catalog`,
        );
      }
    }
    for (const starId of c.stars) {
      if (!starIds.has(starId)) {
        warnings.push(
          `Constellation "${c.id}": member star "${starId}" not in catalog`,
        );
      }
    }
  }

  for (const s of stars.stars) {
    if (s.ra < 0 || s.ra > 360)
      errors.push(`Star "${s.id}": RA ${s.ra} out of range`);
    if (s.dec < -90 || s.dec > 90)
      errors.push(`Star "${s.id}": Dec ${s.dec} out of range`);
    if (s.magnitude < -2 || s.magnitude > 7)
      warnings.push(`Star "${s.id}": unusual magnitude ${s.magnitude}`);
  }

  const ids = stars.stars.map((s) => s.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length > 0) errors.push(`Duplicate star IDs: ${dupes.join(", ")}`);

  for (const s of stars.stars) {
    if (!s.content?.en?.description)
      warnings.push(`Star "${s.id}": missing EN description`);
    if (!s.content?.id?.description)
      warnings.push(`Star "${s.id}": missing ID description`);
  }

  return { valid: errors.length === 0, errors, warnings };
}
