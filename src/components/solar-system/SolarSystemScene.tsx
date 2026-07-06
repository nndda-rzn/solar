"use client";

import { Suspense } from "react";
import { Html } from "@react-three/drei";
import { Sun } from "./sun/Sun";
import { PlanetConfig } from "./planets/PlanetConfig";
import { DwarfPlanetConfig } from "./dwarf-planets/DwarfPlanetConfig";
import { OrbitLines } from "./orbits/OrbitLines";
import { AsteroidBelt } from "./small-bodies/AsteroidBelt";
import { KuiperBelt } from "./small-bodies/KuiperBelt";
import { CosmicLoader } from "@/components/ui/CosmicLoader";

export function SolarSystemScene() {
  return (
    <group>
      <Sun />
      <OrbitLines />
      <Suspense
        fallback={
          <Html center>
            <CosmicLoader label="Loading planets..." />
          </Html>
        }
      >
        <PlanetConfig />
        <DwarfPlanetConfig />
        <AsteroidBelt />
        <KuiperBelt />
      </Suspense>
    </group>
  );
}
