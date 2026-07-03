"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useExplorerStore } from "@/lib/store/explorer-store";
import { ZOOM_THRESHOLDS, ScaleMode } from "@/config/scales";

export function ScaleManager() {
  const { scale, setScale } = useExplorerStore();
  const { camera } = useThree();

  useFrame(() => {
    const distance = camera.position.length();

    let newScale: ScaleMode = "solar";

    if (distance >= ZOOM_THRESHOLDS["galactic-cosmic"]) {
      newScale = "cosmic";
    } else if (distance >= ZOOM_THRESHOLDS["stellar-galactic"]) {
      newScale = "galactic";
    } else if (distance >= ZOOM_THRESHOLDS["solar-stellar"]) {
      newScale = "stellar";
    } else {
      newScale = "solar";
    }

    if (newScale !== scale) {
      setScale(newScale);
    }
  });

  return null;
}
