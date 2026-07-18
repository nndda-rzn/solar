"use client";

export function SunPointLight() {
  return (
    <pointLight
      position={[0, 0, 0]}
      intensity={500}
      distance={2000}
      decay={1}
      color="#fff5e6"
    />
  );
}
