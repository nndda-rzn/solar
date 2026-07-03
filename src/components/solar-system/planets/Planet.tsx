"use client";

import { useRef, useState, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Html } from "@react-three/drei";
import * as THREE from "three";
import { PlanetData } from "@/types/celestial/planet";
import { calculateOrbitalPosition } from "@/lib/utils/astronomy";
import { useSimulationStore } from "@/lib/store/simulation-store";
import { useExplorerStore } from "@/lib/store/explorer-store";

interface PlanetProps {
  planet: PlanetData;
}

function CloudLayer({
  path,
  radius,
  rotationSpeed,
}: {
  path: string;
  radius: number;
  rotationSpeed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const tex = useTexture(path);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += rotationSpeed * 0.012;
    }
  });

  return (
    <mesh ref={ref} scale={1.02}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial
        map={tex}
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </mesh>
  );
}

function RingLayer({ path, radius }: { path: string; radius: number }) {
  const tex = useTexture(path);

  return (
    <mesh rotation={[THREE.MathUtils.degToRad(90), 0, 0]}>
      <ringGeometry args={[radius * 1.5, radius * 2.5, 64]} />
      <meshStandardMaterial
        map={tex}
        transparent
        opacity={0.8}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export function Planet({ planet }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const { isPlaying, speed, setDayOffset } = useSimulationStore();
  const { selectPlanet, selectedPlanet, setCameraTarget, setIsTransitioning } =
    useExplorerStore();

  const textureMap: Record<string, string> = {};
  if (planet.textures.diffuse) textureMap.map = planet.textures.diffuse;
  if (planet.textures.normal) textureMap.normalMap = planet.textures.normal;
  if (planet.textures.specular)
    textureMap.roughnessMap = planet.textures.specular;
  if (planet.textures.emissive)
    textureMap.emissiveMap = planet.textures.emissive;

  const textures = useTexture(textureMap);

  const planetRadius = Math.max(planet.radius * 2, 0.5);
  const isSelected = selectedPlanet === planet.id;

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) return;

    const { selectedPlanet: currentSelected } = useExplorerStore.getState();
    const currentIsSelected = currentSelected === planet.id;

    if (isPlaying) {
      const dayOffset = state.clock.getElapsedTime() * speed;
      setDayOffset(dayOffset);
      const position = calculateOrbitalPosition(
        planet.distanceScaled * 10,
        planet.orbitalPeriod,
        dayOffset,
        0,
      );
      groupRef.current.position.set(position.x, position.y, position.z);

      if (currentIsSelected) {
        const pos = new THREE.Vector3();
        groupRef.current.getWorldPosition(pos);
        setCameraTarget(pos);
      }
    }

    meshRef.current.rotation.y += planet.rotationSpeed * 0.01;

    const targetScale = hovered || isSelected ? 1.15 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1,
    );
  });

  const handleClick = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      if (isSelected) {
        selectPlanet(null);
        setCameraTarget(null);
      } else {
        selectPlanet(planet.id);
        if (groupRef.current) {
          const pos = new THREE.Vector3();
          groupRef.current.getWorldPosition(pos);
          setCameraTarget(pos);
          setIsTransitioning(true);
        }
      }
    },
    [isSelected, planet.id, selectPlanet, setCameraTarget, setIsTransitioning],
  );

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        rotation={[THREE.MathUtils.degToRad(planet.tilt), 0, 0]}
      >
        <sphereGeometry args={[planetRadius, 64, 64]} />
        <meshStandardMaterial
          map={textures.map as THREE.Texture | undefined}
          normalMap={textures.normalMap as THREE.Texture | undefined}
          roughnessMap={textures.roughnessMap as THREE.Texture | undefined}
          emissiveMap={textures.emissiveMap as THREE.Texture | undefined}
          emissive={
            textures.emissiveMap
              ? new THREE.Color(planet.color || "#ffffff")
              : new THREE.Color(0x000000)
          }
          emissiveIntensity={textures.emissiveMap ? 0.4 : 0}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {planet.textures.clouds && (
        <CloudLayer
          path={planet.textures.clouds}
          radius={planetRadius}
          rotationSpeed={planet.rotationSpeed}
        />
      )}

      {planet.hasAtmosphere && (
        <mesh scale={1.08}>
          <sphereGeometry args={[planetRadius, 32, 32]} />
          <meshBasicMaterial
            color={planet.atmosphereColor || "#4a9eff"}
            transparent
            opacity={0.2}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {planet.textures.ring && (
        <RingLayer path={planet.textures.ring} radius={planetRadius} />
      )}

      <Html
        position={[0, planetRadius + 1.5, 0]}
        center
        distanceFactor={50}
        occlude={false}
        style={{ pointerEvents: "none" }}
      >
        <div className="select-none text-center whitespace-nowrap">
          <div
            className="text-xs font-semibold tracking-wider drop-shadow-lg"
            style={{ color: planet.color || "#ffffffcc" }}
          >
            {planet.name.toUpperCase()}
          </div>
        </div>
      </Html>

      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[planetRadius + 0.5, planetRadius + 0.8, 64]} />
          <meshBasicMaterial
            color="#4a9eff"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
