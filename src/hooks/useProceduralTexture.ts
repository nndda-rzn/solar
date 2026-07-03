import { useMemo } from "react";
import * as THREE from "three";
import { ProceduralTextureConfig } from "@/types/celestial/dwarf-planet";

import proceduralVert from "@/shaders/procedural/procedural.vert.glsl";
import proceduralFragRaw from "@/shaders/procedural/procedural.frag.glsl";
import noiseGlsl from "@/shaders/common/noise.glsl";
import utilsGlsl from "@/shaders/common/utils.glsl";

const NOISE_TYPE_MAP = { simplex: 0, fbm: 1, ridged: 2 } as const;

export function useProceduralTexture(
  config: ProceduralTextureConfig,
): THREE.ShaderMaterial {
  const baseColor = new THREE.Color(config.baseColor);
  const secondaryColor = baseColor.clone().offsetHSL(0.05, -0.1, 0.1);

  const material = useMemo(() => {
    const fragmentShader = proceduralFragRaw
      .replace("#pragma include <common/noise.glsl>", noiseGlsl)
      .replace("#pragma include <common/utils.glsl>", utilsGlsl);

    return new THREE.ShaderMaterial({
      vertexShader: proceduralVert,
      fragmentShader,
      uniforms: {
        u_baseColor: { value: baseColor },
        u_secondaryColor: { value: secondaryColor },
        u_noiseScale: { value: config.noiseScale },
        u_noiseType: { value: NOISE_TYPE_MAP[config.noiseType] },
        u_detailLevel: { value: config.detailLevel },
        u_roughness: { value: 0.7 },
        u_sunPosition: { value: new THREE.Vector3(0, 0, 0) },
      },
    });
  }, [config, baseColor, secondaryColor]);

  return material;
}
