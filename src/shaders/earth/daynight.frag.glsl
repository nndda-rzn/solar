uniform sampler2D u_dayTexture;
uniform sampler2D u_nightTexture;
uniform vec3 u_sunPosition;
uniform float u_ambientIntensity;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vec3 sunDir = normalize(u_sunPosition - vWorldPosition);
  float lightFacing = dot(vNormal, sunDir);

  float dayNightFactor = smoothstep(-0.1, 0.2, lightFacing);

  vec4 dayColor = texture2D(u_dayTexture, vUv);
  vec4 nightColor = texture2D(u_nightTexture, vUv);

  vec3 finalColor = mix(nightColor.rgb * 1.5, dayColor.rgb, dayNightFactor);

  float ambient = u_ambientIntensity;
  float diffuse = max(lightFacing, 0.0) * 0.85;
  float light = ambient + diffuse;

  finalColor *= light;

  float specular = pow(max(dot(reflect(-sunDir, vNormal), normalize(cameraPosition - vWorldPosition)), 0.0), 20.0);
  finalColor += vec3(0.3) * specular * dayNightFactor;

  gl_FragColor = vec4(finalColor, 1.0);
}
