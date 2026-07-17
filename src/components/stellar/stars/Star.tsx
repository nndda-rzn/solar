"use client";

import { CelestialBase } from "@/components/cosmic-explorer/CelestialBase";
import { StarPosition } from "@/types/celestial/star";
import { magnitudeToSize, magnitudeToGlowScale } from "@/lib/utils/coordinates";
import { StarGlow } from "./StarGlow";
import { useCelestialSelection } from "@/hooks/useCelestialSelection";

interface StarProps {
  star: StarPosition;
}

export function Star({ star }: StarProps) {
  const starSize = magnitudeToSize(star.magnitude);
  const glowScale = magnitudeToGlowScale(star.magnitude);
  const showLabel = star.magnitude < 2.0;

  // Star-specific selection hook (fixes hover state bug with CelestialBase)
  const { isHovered } = useCelestialSelection("star", star.id);

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
      <mesh>
        <sphereGeometry args={[starSize, 16, 16]} />
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
