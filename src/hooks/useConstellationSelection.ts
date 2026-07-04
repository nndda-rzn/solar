import { useState, useCallback } from "react";
import * as THREE from "three";
import { useExplorerStore } from "@/lib/store/explorer-store";

export function useConstellationSelection(id: string) {
  const [hovered, setHovered] = useState(false);

  const selectedConstellation = useExplorerStore(
    (s) => s.selectedConstellation,
  );
  const isSelected = selectedConstellation === id;

  const selectConstellation = useExplorerStore((s) => s.selectConstellation);
  const setCameraTarget = useExplorerStore((s) => s.setCameraTarget);
  const setIsTransitioning = useExplorerStore((s) => s.setIsTransitioning);

  const handleClick = useCallback(
    (e: { stopPropagation: () => void }, targetPosition: THREE.Vector3) => {
      e.stopPropagation();
      if (isSelected) {
        selectConstellation(null);
        setCameraTarget(null);
      } else {
        selectConstellation(id);
        setCameraTarget(targetPosition);
        setIsTransitioning(true);
      }
    },
    [id, isSelected, selectConstellation, setCameraTarget, setIsTransitioning],
  );

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    useExplorerStore.getState().hoverConstellation(id);
  }, [id]);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    useExplorerStore.getState().hoverConstellation(null);
  }, []);

  return {
    isSelected,
    isHovered: hovered,
    handleClick,
    handlePointerOver,
    handlePointerOut,
  };
}
