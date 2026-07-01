"use client";

import { Suspense } from "react";
import { Sun } from "./sun/Sun";
import { PlanetConfig } from "./planets/PlanetConfig";

export function SolarSystemScene() {
  return (
    <group>
      <Sun />
      <Suspense fallback={null}>
        <PlanetConfig />
      </Suspense>
    </group>
  );
}
