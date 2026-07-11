import { useState, useCallback } from "react";
import * as THREE from "three";
import { useSelectionStore } from "@/lib/store/selection-store";
import { useCameraStore } from "@/lib/store/camera-store";

export type CelestialType = "planet" | "star" | "constellation";

/**
 * Generic selection hook that consolidates useSelection, useStarSelection,
 * and useConstellationSelection into a single reusable hook.
 *
 * @param type - The type of celestial object
 * @param id - The unique identifier for the object
 */
export function useCelestialSelection(type: CelestialType, id: string) {
  const [hovered, setHovered] = useState(false);

  const selectedId = useSelectionStore((s) => {
    switch (type) {
      case "planet":
        return s.selectedPlanet;
      case "star":
        return s.selectedStar;
      case "constellation":
        return s.selectedConstellation;
    }
  });

  const isSelected = selectedId === id;

  const setCameraTarget = useCameraStore((s) => s.setCameraTarget);

  const selectFn = useCallback(
    (newId: string | null) => {
      const state = useSelectionStore.getState();
      switch (type) {
        case "planet":
          state.selectPlanet(newId);
          break;
        case "star":
          state.selectStar(newId);
          break;
        case "constellation":
          state.selectConstellation(newId);
          break;
      }
    },
    [type],
  );

  const handleClick = useCallback(
    (
      e: { stopPropagation: () => void },
      groupRef: React.RefObject<THREE.Group | null>,
    ) => {
      e.stopPropagation();
      if (isSelected) {
        selectFn(null);
        setCameraTarget(null);
      } else {
        selectFn(id);
        if (groupRef.current) {
          const pos = new THREE.Vector3();
          groupRef.current.getWorldPosition(pos);
          setCameraTarget(pos);
        }
      }
    },
    [id, isSelected, selectFn, setCameraTarget],
  );

  const handleClickWithPosition = useCallback(
    (e: { stopPropagation: () => void }, targetPosition: THREE.Vector3) => {
      e.stopPropagation();
      if (isSelected) {
        selectFn(null);
        setCameraTarget(null);
      } else {
        selectFn(id);
        setCameraTarget(targetPosition);
      }
    },
    [id, isSelected, selectFn, setCameraTarget],
  );

  const handlePointerOver = useCallback(() => {
    setHovered(true);
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
  }, []);

  return {
    isSelected,
    isHovered: hovered,
    handleClick,
    handleClickWithPosition,
    handlePointerOver,
    handlePointerOut,
  };
}
