import { useState, useCallback } from "react";
import * as THREE from "three";
import { useExplorerStore } from "@/lib/store/explorer-store";

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

  // Map type to store selectors
  const selectedId = useExplorerStore((s) => {
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

  const setCameraTarget = useExplorerStore((s) => s.setCameraTarget);
  const setIsTransitioning = useExplorerStore((s) => s.setIsTransitioning);

  // Get the appropriate select function based on type
  const selectFn = useCallback(
    (newId: string | null) => {
      const state = useExplorerStore.getState();
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

  // Get the appropriate hover function based on type
  const hoverFn = useCallback(
    (newId: string | null) => {
      const state = useExplorerStore.getState();
      switch (type) {
        case "planet":
          state.hoverPlanet(newId);
          break;
        case "star":
          state.hoverStar(newId);
          break;
        case "constellation":
          state.hoverConstellation(newId);
          break;
      }
    },
    [type],
  );

  /**
   * Handle click with a group ref (for planets and stars).
   * Gets world position from the group ref.
   */
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
          setIsTransitioning(true);
        }
      }
    },
    [id, isSelected, selectFn, setCameraTarget, setIsTransitioning],
  );

  /**
   * Handle click with a direct position (for constellations).
   */
  const handleClickWithPosition = useCallback(
    (e: { stopPropagation: () => void }, targetPosition: THREE.Vector3) => {
      e.stopPropagation();
      if (isSelected) {
        selectFn(null);
        setCameraTarget(null);
      } else {
        selectFn(id);
        setCameraTarget(targetPosition);
        setIsTransitioning(true);
      }
    },
    [id, isSelected, selectFn, setCameraTarget, setIsTransitioning],
  );

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    hoverFn(id);
  }, [id, hoverFn]);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    hoverFn(null);
  }, [hoverFn]);

  return {
    isSelected,
    isHovered: hovered,
    handleClick,
    handleClickWithPosition,
    handlePointerOver,
    handlePointerOut,
  };
}
