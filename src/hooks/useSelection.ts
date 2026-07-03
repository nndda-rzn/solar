import { useState, useCallback } from "react";
import * as THREE from "three";
import { useExplorerStore } from "@/lib/store/explorer-store";

export function useSelection(id: string) {
  const [hovered, setHovered] = useState(false);

  const selectedPlanet = useExplorerStore((s) => s.selectedPlanet);
  const isSelected = selectedPlanet === id;

  const selectPlanet = useExplorerStore((s) => s.selectPlanet);
  const setCameraTarget = useExplorerStore((s) => s.setCameraTarget);
  const setIsTransitioning = useExplorerStore((s) => s.setIsTransitioning);

  const handleClick = useCallback(
    (
      e: { stopPropagation: () => void },
      groupRef: React.RefObject<THREE.Group | null>,
    ) => {
      e.stopPropagation();
      if (isSelected) {
        selectPlanet(null);
        setCameraTarget(null);
      } else {
        selectPlanet(id);
        if (groupRef.current) {
          const pos = new THREE.Vector3();
          groupRef.current.getWorldPosition(pos);
          setCameraTarget(pos);
          setIsTransitioning(true);
        }
      }
    },
    [id, isSelected, selectPlanet, setCameraTarget, setIsTransitioning],
  );

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    useExplorerStore.getState().hoverPlanet(id);
  }, [id]);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    useExplorerStore.getState().hoverPlanet(null);
  }, []);

  return {
    isSelected,
    isHovered: hovered,
    handleClick,
    handlePointerOver,
    handlePointerOut,
  };
}
