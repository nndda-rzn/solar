uniform vec3 u_atmosphereColor;
uniform float u_intensity;
uniform float u_falloff;

varying vec3 vNormal;
varying vec3 vViewDirection;

void main() {
  float fresnel = 1.0 - dot(vViewDirection, vNormal);
  float glow = pow(fresnel, u_falloff) * u_intensity;
  gl_FragColor = vec4(u_atmosphereColor, glow);
}
