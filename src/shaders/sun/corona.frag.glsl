#pragma include <common/noise.glsl>
#pragma include <common/utils.glsl>

uniform float u_time;
uniform float u_sunRadius;
uniform float u_coronaIntensity;
uniform vec3 u_color1;
uniform vec3 u_color2;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewDirection;

void main() {
  float fresnel = 1.0 - dot(vViewDirection, vNormal);
  fresnel = pow(fresnel, 2.0);

  vec3 noisePos = vWorldPosition * 0.5 + u_time * 0.3;
  float plasma = fbm(noisePos, 4);
  plasma = remap(plasma, -1.0, 1.0, 0.0, 1.0);

  float distFromCenter = length(vWorldPosition) / u_sunRadius;
  float density = max(0.0, 1.0 - distFromCenter);
  density = pow(density, 1.5);

  vec3 coronaColor = mix(u_color1, u_color2, plasma);
  float alpha = fresnel * u_coronaIntensity * density * (0.5 + plasma * 0.5);

  gl_FragColor = vec4(coronaColor, alpha);
}
