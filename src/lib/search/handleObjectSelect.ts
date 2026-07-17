import * as THREE from "three";
import type { SearchableObject } from "./buildSearchIndex";

export type { SearchableObject };

export type SelectionAction =
  | { kind: "sun" }
  | { kind: "star"; id: string }
  | { kind: "constellation"; id: string }
  | { kind: "planet"; id: string };

export interface ObjectSelectResult {
  action: SelectionAction;
  cameraTarget: THREE.Vector3 | null;
}

/**
 * Pure resolver for the object-selection branching in SearchModal's
 * `handleSelect`. Mirrors the exact same branching order and camera-target
 * math as the original, but returns a description of what to do instead of
 * calling store actions directly.
 *
 * Branch order matters and is preserved verbatim:
 *   1. obj.id === "sun"
 *   2. obj.type === "stellar"
 *   3. obj.type === "constellation"
 *   4. else (planet / dwarf planet)
 */
export function resolveObjectSelect(
  obj: SearchableObject,
  allStars: { id: string; x: number; y: number; z: number }[],
): ObjectSelectResult {
  if (obj.id === "sun") {
    return {
      action: { kind: "sun" },
      cameraTarget: new THREE.Vector3(0, 0, 0),
    };
  }

  if (obj.type === "stellar") {
    return {
      action: { kind: "star", id: obj.id },
      cameraTarget: new THREE.Vector3(obj.x, obj.y, obj.z),
    };
  }

  if (obj.type === "constellation") {
    // Calculate centroid from member stars for camera target
    const memberStars = allStars.filter((s) => obj.stars?.includes(s.id));
    let cameraTarget: THREE.Vector3 | null = null;
    if (memberStars.length > 0) {
      const centroid = new THREE.Vector3();
      memberStars.forEach((s) =>
        centroid.add(new THREE.Vector3(s.x, s.y, s.z)),
      );
      centroid.divideScalar(memberStars.length);
      cameraTarget = centroid;
    }
    return {
      action: { kind: "constellation", id: obj.id },
      cameraTarget,
    };
  }

  // planet / dwarf planet
  const dist = (obj.distanceScaled ?? 10) * 10;
  return {
    action: { kind: "planet", id: obj.id },
    cameraTarget: new THREE.Vector3(dist, 0, 0),
  };
}
