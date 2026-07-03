float remap(float value, float low1, float high1, float low2, float high2) {
  return low2 + (value - low1) * (high2 - low2) / (high1 - low1);
}

vec3 remap(vec3 value, float low1, float high1, float low2, float high2) {
  return vec3(
    remap(value.x, low1, high1, low2, high2),
    remap(value.y, low1, high1, low2, high2),
    remap(value.z, low1, high1, low2, high2)
  );
}

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

mat2 rotation2d(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}
