"use client";

import { Star } from "./Star";
import { StarPosition } from "@/types/celestial/star";

interface StarFieldProps {
  stars: StarPosition[];
}

export function StarField({ stars }: StarFieldProps) {
  return (
    <group>
      {stars.map((star) => (
        <Star key={star.id} star={star} />
      ))}
    </group>
  );
}
