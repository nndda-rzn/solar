import { useMemo } from "react";

export function useCelestialLabel(
  name: string,
  radius: number,
  color?: string,
) {
  const position = useMemo(
    () => [0, radius * 2 + 1.5, 0] as [number, number, number],
    [radius],
  );

  const style = useMemo(
    () => ({
      color: color || "#ffffffcc",
      fontSize: "10px",
      fontWeight: "600",
      letterSpacing: "0.1em",
      textTransform: "uppercase" as const,
      pointerEvents: "none" as const,
      userSelect: "none" as const,
      whiteSpace: "nowrap" as const,
      textAlign: "center" as const,
      dropShadow: "0 2px 4px rgba(0,0,0,0.5)",
    }),
    [color],
  );

  return { position, style, text: name.toUpperCase() };
}
