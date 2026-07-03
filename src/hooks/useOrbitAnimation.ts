import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { calculateOrbitalPosition } from "@/lib/utils/astronomy";
import { useSimulationStore } from "@/lib/store/simulation-store";

interface OrbitConfig {
  distance: number;
  period: number;
  initialOffset?: number;
}

export function useOrbitAnimation(
  config: OrbitConfig | null,
  groupRef: React.RefObject<THREE.Group | null>,
) {
  const positionRef = useRef(new THREE.Vector3());

  useFrame((state) => {
    if (!config || !groupRef.current) return;

    const { isPlaying, speed } = useSimulationStore.getState();
    if (!isPlaying) return;

    const dayOffset = state.clock.getElapsedTime() * speed;
    const pos = calculateOrbitalPosition(
      config.distance,
      config.period,
      dayOffset,
      0,
    );

    positionRef.current.set(pos.x, pos.y, pos.z);
    groupRef.current.position.copy(positionRef.current);
  });

  return positionRef;
}
