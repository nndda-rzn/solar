"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useOrbitAnimation } from "@/hooks/useOrbitAnimation";
import {
  useCelestialSelection,
  CelestialType,
} from "@/hooks/useCelestialSelection";

interface OrbitConfig {
  distance: number;
  period: number;
  initialOffset?: number;
}

interface CelestialBaseProps {
  id: string;
  name: string;
  radius: number;
  color?: string;
  orbitConfig?: OrbitConfig;
  position?: [number, number, number];
  selectionRing?: boolean;
  label?: string;
  children?: React.ReactNode;
  /** Type of celestial object for selection state. Defaults to "planet" */
  type?: CelestialType;
}

export function CelestialBase({
  id,
  name,
  radius,
  color,
  orbitConfig,
  position,
  selectionRing = true,
  label,
  children,
  type = "planet",
}: CelestialBaseProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  // Cache target vector to avoid allocation every frame
  const targetScaleVec = useRef(new THREE.Vector3(1, 1, 1));

  const {
    isSelected,
    isHovered,
    handleClick,
    handlePointerOver,
    handlePointerOut,
  } = useCelestialSelection(type, id);

  useOrbitAnimation(orbitConfig || null, groupRef);

  useFrame(() => {
    if (!meshRef.current) return;
    const targetScale = isHovered || isSelected ? 1.15 : 1;
    targetScaleVec.current.setScalar(targetScale);
    meshRef.current.scale.lerp(targetScaleVec.current, 0.1);
  });

  const onClick = (e: { stopPropagation: () => void }) => {
    handleClick(e, groupRef);
  };

  const initialPosition = position
    ? new THREE.Vector3(...position)
    : orbitConfig
      ? undefined
      : new THREE.Vector3(0, 0, 0);

  return (
    <group ref={groupRef} position={initialPosition}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[radius * 2, 32, 32]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {children}

      {label && (
        <Html
          position={[0, radius * 2 + 1.5, 0]}
          center
          distanceFactor={50}
          occlude={false}
          style={{ pointerEvents: "none" }}
        >
          <div className="select-none text-center whitespace-nowrap">
            <div
              className="text-xs font-semibold tracking-wider drop-shadow-lg"
              style={{ color: color || "#ffffffcc" }}
            >
              {label}
            </div>
          </div>
        </Html>
      )}

      {isSelected && selectionRing && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 2 + 0.5, radius * 2 + 0.8, 64]} />
          <meshBasicMaterial
            color="#4a9eff"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
