"use client";

import { CelestialBase } from "@/components/cosmic-explorer/CelestialBase";
import { ProceduralSurface } from "./ProceduralSurface";
import { useDwarfPlanetData } from "@/hooks/data/useDwarfPlanetData";
import { DwarfPlanetData } from "@/types/celestial/dwarf-planet";

function DwarfPlanet({ data }: { data: DwarfPlanetData }) {
  const dwarfRadius = Math.max(data.radius * 2, 0.3);

  return (
    <CelestialBase
      id={data.id}
      name={data.name}
      radius={data.radius}
      color={data.color}
      orbitConfig={{
        distance: data.distanceScaled * 10,
        period: data.orbitalPeriod,
      }}
      selectionRing={true}
      label={data.name.toUpperCase()}
    >
      <ProceduralSurface
        radius={dwarfRadius}
        proceduralTexture={data.proceduralTexture}
        rotationSpeed={data.rotationSpeed}
        tilt={data.tilt}
      />
    </CelestialBase>
  );
}

export function DwarfPlanetConfig() {
  const { dwarfPlanets } = useDwarfPlanetData();

  return (
    <group>
      {dwarfPlanets.map((dp) => (
        <DwarfPlanet key={dp.id} data={dp} />
      ))}
    </group>
  );
}
