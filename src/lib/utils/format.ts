export function formatDistance(lightYears: number): string {
  if (lightYears < 0.01) {
    return `${(lightYears * 63241.077).toFixed(0)} AU`;
  }
  if (lightYears < 1) {
    return `${(lightYears * 1000).toFixed(1)} thousand ly`;
  }
  if (lightYears < 1000) {
    return `${lightYears.toFixed(2)} ly`;
  }
  return `${(lightYears / 1000).toFixed(1)} thousand ly`;
}

export function formatMass(earthMasses: number): string {
  if (earthMasses < 0.01) {
    return `${(earthMasses * 7.346e22).toExponential(2)} kg`;
  }
  if (earthMasses < 100) {
    return `${earthMasses.toFixed(2)} Earth masses`;
  }
  return `${(earthMasses / 317.83).toFixed(2)} Jupiter masses`;
}

export function formatTemperature(celsius: number): string {
  const fahrenheit = (celsius * 9) / 5 + 32;
  return `${celsius.toFixed(0)}°C / ${fahrenheit.toFixed(0)}°F`;
}
