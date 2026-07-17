"use client";

interface CanvasStar {
  id: string;
  name: string;
  magnitude: number;
  type: string;
  color: string;
  x: number;
  y: number;
}

interface ConstellationLine {
  from: string;
  to: string;
}

interface ConstellationMapProps {
  canvasStars: CanvasStar[];
  lines: ConstellationLine[];
  width?: number;
  height?: number;
  className?: string;
}

export function ConstellationMap({
  canvasStars,
  lines,
  width = 280,
  height = 180,
  className = "",
}: ConstellationMapProps) {
  // Build lookup map
  const starMap = new Map<string, CanvasStar>(
    canvasStars.map((s) => [s.id, s]),
  );

  // Compute bounds for padding
  const xs = canvasStars.map((s) => s.x);
  const ys = canvasStars.map((s) => s.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  const pad = 24;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;

  const toSvgX = (x: number) => pad + ((x - minX) / rangeX) * innerW;
  const toSvgY = (y: number) => pad + ((y - minY) / rangeY) * innerH;

  const starRadius = (mag: number) => Math.max(1.5, 4 - mag * 0.6);

  return (
    <svg
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        {canvasStars.map((s) => (
          <radialGradient
            key={`cg-${s.id}`}
            id={`cg-${s.id}`}
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.9} />
            <stop offset="50%" stopColor={s.color} stopOpacity={1} />
            <stop offset="100%" stopColor={s.color} stopOpacity={0.6} />
          </radialGradient>
        ))}
      </defs>

      {/* Connection lines */}
      {lines.map((line, i) => {
        const from = starMap.get(line.from);
        const to = starMap.get(line.to);
        if (!from || !to) return null;
        return (
          <line
            key={i}
            x1={toSvgX(from.x)}
            y1={toSvgY(from.y)}
            x2={toSvgX(to.x)}
            y2={toSvgY(to.y)}
            stroke="rgba(180,210,255,0.25)"
            strokeWidth={1}
            strokeLinecap="round"
          />
        );
      })}

      {/* Star glows */}
      {canvasStars.map((s) => {
        const r = starRadius(s.magnitude);
        return (
          <circle
            key={`glow-${s.id}`}
            cx={toSvgX(s.x)}
            cy={toSvgY(s.y)}
            r={r * 3}
            fill={s.color}
            opacity={0.08}
          />
        );
      })}

      {/* Stars */}
      {canvasStars.map((s) => {
        const r = starRadius(s.magnitude);
        return (
          <circle
            key={s.id}
            cx={toSvgX(s.x)}
            cy={toSvgY(s.y)}
            r={r}
            fill={`url(#cg-${s.id})`}
          />
        );
      })}
    </svg>
  );
}
