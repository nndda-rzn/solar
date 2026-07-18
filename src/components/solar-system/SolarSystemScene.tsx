"use client";

import { Suspense } from "react";
import { Sun } from "./sun/Sun";
import { PlanetConfig } from "./planets/PlanetConfig";
import { DwarfPlanetConfig } from "./dwarf-planets/DwarfPlanetConfig";
import { OrbitLines } from "./orbits/OrbitLines";
import { AsteroidBelt } from "./small-bodies/AsteroidBelt";
import { KuiperBelt } from "./small-bodies/KuiperBelt";

export function SolarSystemScene() {
  return (
    <group>
      <Sun />
      <OrbitLines />
      <Suspense fallback={null}>
        <PlanetConfig />
        <DwarfPlanetConfig />
        <AsteroidBelt />
        <KuiperBelt />
      </Suspense>
    </group>
  );
}
