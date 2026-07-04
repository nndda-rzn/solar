"use client";

import { CelestialBase } from "@/components/cosmic-explorer/CelestialBase";
import { StarPosition } from "@/types/celestial/star";
import { magnitudeToSize } from "@/lib/utils/coordinates";
import { StarGlow } from "./StarGlow";

interface StarProps {
  star: StarPosition;
}

export function Star({ star }: StarProps) {
  const starSize = magnitudeToSize(star.magnitude);
  const showLabel = star.magnitude < 2.0;

  return (
    <CelestialBase
      id={star.id}
      name={star.name}
      position={[star.x, star.y, star.z]}
      radius={starSize}
      color={star.color}
      selectionRing={true}
      label={showLabel ? star.name : undefined}
    >
      <mesh>
        <sphereGeometry args={[starSize, 16, 16]} />
        <meshBasicMaterial color={star.color} />
      </mesh>
      <StarGlow color={star.color} size={starSize} intensity={0.6} />
    </CelestialBase>
  );
}
