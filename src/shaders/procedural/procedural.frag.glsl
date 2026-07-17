#pragma include <common/noise.glsl>
#pragma include <common/utils.glsl>

uniform vec3 u_baseColor;
uniform vec3 u_secondaryColor;
uniform float u_noiseScale;
uniform int u_noiseType;
uniform int u_detailLevel;
uniform float u_roughness;
uniform vec3 u_sunPosition;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vec3 noisePos = vWorldPosition * u_noiseScale;
  float n;

  if (u_noiseType == 0) {
    n = snoise(noisePos);
  } else if (u_noiseType == 1) {
    n = fbm(noisePos, u_detailLevel);
  } else {
    n = ridged(noisePos, u_detailLevel);
  }

  float t = remap(n, -1.0, 1.0, 0.0, 1.0);
  vec3 surfaceColor = mix(u_baseColor, u_secondaryColor, t);

  vec3 sunDir = normalize(u_sunPosition - vWorldPosition);
  float diffuse = max(dot(vNormal, sunDir), 0.0);
  float ambient = 0.15;
  float light = ambient + diffuse * 0.85;

  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
  rim = pow(rim, 3.0) * 0.3;

  vec3 finalColor = surfaceColor * light + vec3(0.4, 0.5, 0.6) * rim;
  gl_FragColor = vec4(finalColor, 1.0);
}
