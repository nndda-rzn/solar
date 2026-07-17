"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useScaleStore } from "@/lib/store/scale-store";
import { ZOOM_THRESHOLDS, ScaleMode } from "@/config/scales";
import { cosmicEventBus } from "@/lib/events/event-bus";

export function ScaleManager() {
  const { scale, setScale } = useScaleStore();
  const { camera } = useThree();

  useFrame(() => {
    const distance = camera.position.length();

    let newScale: ScaleMode = "solar";

    if (distance >= ZOOM_THRESHOLDS["galactic-cosmic"]!) {
      newScale = "cosmic";
    } else if (distance >= ZOOM_THRESHOLDS["stellar-galactic"]!) {
      newScale = "galactic";
    } else if (distance >= ZOOM_THRESHOLDS["solar-stellar"]!) {
      newScale = "stellar";
    } else {
      newScale = "solar";
    }

    if (newScale !== scale) {
      setScale(newScale);
      cosmicEventBus.emit({
        type: "scale_reached",
        payload: { scale: newScale },
      });
    }
  });

  return null;
}
