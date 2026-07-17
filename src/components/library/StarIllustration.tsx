"use client";

interface StarIllustrationProps {
  color: string;
  magnitude: number;
  spectralType?: string | undefined;
  size?: "sm" | "md" | "lg" | undefined;
}

// Normalize magnitude: Sirius = -1.46 (brightest), faint = 6+
// Map to 0-1 where 1 = brightest
function normalizeMagnitude(mag: number): number {
  return Math.max(0, Math.min(1, (6 - mag) / 8));
}

export function StarIllustration({
  color,
  magnitude,
  spectralType,
  size = "md",
}: StarIllustrationProps) {
  const brightness = normalizeMagnitude(magnitude);

  const dimensions = { sm: 80, md: 160, lg: 220 }[size];
  const coreRadius = dimensions * (0.08 + brightness * 0.1);
  const glowRadius = coreRadius * 3;
  const glowOpacity = 0.15 + brightness * 0.25;
  const rayCount = 8;
  const rayLength = coreRadius * 2.2;
  const rayWidth = Math.max(1, coreRadius * 0.18);
  const center = dimensions / 2;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: dimensions, height: dimensions }}
      aria-hidden="true"
    >
      {/* Background star field */}
      <svg
        width={dimensions}
        height={dimensions}
        className="absolute inset-0"
        aria-hidden="true"
      >
        {/* Outer diffuse glow */}
        <defs>
          <radialGradient
            id={`glow-${spectralType ?? "star"}`}
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop
              offset="0%"
              stopColor={color}
              stopOpacity={glowOpacity * 1.5}
            />
            <stop
              offset="40%"
              stopColor={color}
              stopOpacity={glowOpacity * 0.5}
            />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </radialGradient>
          <radialGradient
            id={`core-${spectralType ?? "star"}`}
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.9} />
            <stop offset="40%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={color} stopOpacity={0.8} />
          </radialGradient>
        </defs>

        {/* Diffuse glow */}
        <circle
          cx={center}
          cy={center}
          r={glowRadius}
          fill={`url(#glow-${spectralType ?? "star"})`}
        />

        {/* Corona rays */}
        {Array.from({ length: rayCount }, (_, i) => {
          const angle = (i * 360) / rayCount;
          const rad = (angle * Math.PI) / 180;
          const x1 = center + Math.cos(rad) * (coreRadius * 1.1);
          const y1 = center + Math.sin(rad) * (coreRadius * 1.1);
          const x2 = center + Math.cos(rad) * (coreRadius + rayLength);
          const y2 = center + Math.sin(rad) * (coreRadius + rayLength);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth={rayWidth}
              strokeOpacity={0.3 + brightness * 0.2}
              strokeLinecap="round"
            />
          );
        })}

        {/* Secondary shorter rays (45deg offset) */}
        {Array.from({ length: rayCount }, (_, i) => {
          const angle = (i * 360) / rayCount + 22.5;
          const rad = (angle * Math.PI) / 180;
          const x1 = center + Math.cos(rad) * (coreRadius * 1.1);
          const y1 = center + Math.sin(rad) * (coreRadius * 1.1);
          const x2 = center + Math.cos(rad) * (coreRadius + rayLength * 0.5);
          const y2 = center + Math.sin(rad) * (coreRadius + rayLength * 0.5);
          return (
            <line
              key={`s-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth={rayWidth * 0.6}
              strokeOpacity={0.15 + brightness * 0.1}
              strokeLinecap="round"
            />
          );
        })}

        {/* Core */}
        <circle
          cx={center}
          cy={center}
          r={coreRadius}
          fill={`url(#core-${spectralType ?? "star"})`}
        />
      </svg>
    </div>
  );
}
