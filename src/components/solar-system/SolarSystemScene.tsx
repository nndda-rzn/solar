"use client";

import { Suspense } from "react";
import { Sun } from "./sun/Sun";
import { PlanetConfig } from "./planets/PlanetConfig";
import { OrbitLines } from "./orbits/OrbitLines";

export function SolarSystemScene() {
  return (
    <group>
      <Sun />
      <OrbitLines />
      <Suspense fallback={null}>
        <PlanetConfig />
      </Suspense>
    </group>
  );
}
