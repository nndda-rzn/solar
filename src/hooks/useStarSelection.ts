import { useState, useCallback } from "react";
import * as THREE from "three";
import { useExplorerStore } from "@/lib/store/explorer-store";

export function useStarSelection(id: string) {
  const [hovered, setHovered] = useState(false);

  const selectedStar = useExplorerStore((s) => s.selectedStar);
  const isSelected = selectedStar === id;

  const selectStar = useExplorerStore((s) => s.selectStar);
  const setCameraTarget = useExplorerStore((s) => s.setCameraTarget);
  const setIsTransitioning = useExplorerStore((s) => s.setIsTransitioning);

  const handleClick = useCallback(
    (
      e: { stopPropagation: () => void },
      groupRef: React.RefObject<THREE.Group | null>,
    ) => {
      e.stopPropagation();
      if (isSelected) {
        selectStar(null);
        setCameraTarget(null);
      } else {
        selectStar(id);
        if (groupRef.current) {
          const pos = new THREE.Vector3();
          groupRef.current.getWorldPosition(pos);
          setCameraTarget(pos);
          setIsTransitioning(true);
        }
      }
    },
    [id, isSelected, selectStar, setCameraTarget, setIsTransitioning],
  );

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    useExplorerStore.getState().hoverStar(id);
  }, [id]);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    useExplorerStore.getState().hoverStar(null);
  }, []);

  return {
    isSelected,
    isHovered: hovered,
    handleClick,
    handlePointerOver,
    handlePointerOut,
  };
}
