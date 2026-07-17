"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CelestialBase } from "@/components/cosmic-explorer/CelestialBase";
import { StarPosition } from "@/types/celestial/star";
import { magnitudeToSize, magnitudeToGlowScale } from "@/lib/utils/coordinates";
import { StarGlow } from "./StarGlow";
import { useCelestialSelection } from "@/hooks/useCelestialSelection";

interface StarProps {
  star: StarPosition;
}

export function Star({ star }: StarProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const starSize = magnitudeToSize(star.magnitude);
  const glowScale = magnitudeToGlowScale(star.magnitude);
  const showLabel = star.magnitude < 2.0;

  const { isHovered } = useCelestialSelection("star", star.id);

  const geometries = useMemo(
    () => ({
      high: new THREE.SphereGeometry(starSize, 16, 16),
      medium: new THREE.SphereGeometry(starSize, 8, 8),
      low: new THREE.SphereGeometry(starSize, 4, 4),
    }),
    [starSize],
  );

  useFrame(() => {
    if (meshRef.current) {
      const distance = camera.position.distanceTo(
        meshRef.current.getWorldPosition(new THREE.Vector3()),
      );
      if (distance < 100) {
        meshRef.current.geometry = geometries.high;
      } else if (distance < 250) {
        meshRef.current.geometry = geometries.medium;
      } else {
        meshRef.current.geometry = geometries.low;
      }
    }
  });

  return (
    <CelestialBase
      id={star.id}
      name={star.name}
      position={[star.x, star.y, star.z]}
      radius={starSize}
      color={star.color}
      selectionRing={true}
      label={showLabel ? star.name : ""}
      type="star"
    >
      <mesh ref={meshRef}>
        <primitive object={geometries.high} />
        <meshBasicMaterial color={star.color} />
      </mesh>
      <StarGlow
        color={star.color}
        size={starSize}
        intensity={isHovered ? 0.8 : 0.6}
        scale={glowScale}
      />
    </CelestialBase>
  );
}
