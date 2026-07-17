"use client";

import { Suspense } from "react";
import { CelestialBase } from "@/components/cosmic-explorer/CelestialBase";
import { PlanetSurface } from "./PlanetSurface";
import { PlanetAtmosphere } from "./PlanetAtmosphere";
import { PlanetClouds } from "./PlanetClouds";
import { PlanetRing } from "./PlanetRing";
import { PlanetMoon } from "./PlanetMoon";
import { PlanetData } from "@/types/celestial/planet";

interface PlanetProps {
  planet: PlanetData;
}

export function Planet({ planet }: PlanetProps) {
  const planetRadius = Math.max(planet.radius * 2, 0.5);

  return (
    <CelestialBase
      id={planet.id}
      name={planet.name}
      radius={planet.radius}
      color={planet.color ?? "#ffffff"}
      orbitConfig={{
        distance: planet.distanceScaled * 10,
        period: planet.orbitalPeriod,
      }}
      selectionRing={true}
      label={planet.name.toUpperCase()}
    >
      <Suspense fallback={null}>
        <PlanetSurface
          textures={planet.textures}
          radius={planetRadius}
          rotationSpeed={planet.rotationSpeed}
          tilt={planet.tilt}
          color={planet.color ?? "#ffffff"}
        />
      </Suspense>

      {planet.hasAtmosphere && (
        <PlanetAtmosphere
          radius={planetRadius}
          color={planet.atmosphereColor || "#4a9eff"}
        />
      )}

      {planet.textures.clouds && (
        <PlanetClouds
          texturePath={planet.textures.clouds}
          radius={planetRadius}
          rotationSpeed={planet.rotationSpeed}
        />
      )}

      {planet.textures.ring && (
        <PlanetRing texturePath={planet.textures.ring} radius={planetRadius} />
      )}

      {planet.moons?.map((moon) => (
        <PlanetMoon key={moon.id} moonData={moon} />
      ))}
    </CelestialBase>
  );
}
