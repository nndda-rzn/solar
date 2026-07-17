varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewDirection;

uniform float u_time;

#pragma include <common/noise.glsl>

void main() {
  vUv = uv;
  vec3 displacedPosition = position + normal * snoise(position * 0.3 + u_time * 0.1) * 0.5;
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(displacedPosition, 1.0);
  vWorldPosition = worldPos.xyz;
  vViewDirection = normalize(cameraPosition - worldPos.xyz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}
