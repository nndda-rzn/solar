import { clsx } from "clsx";
import type { CSSProperties } from "react";

export interface SkeletonProps {
  variant?: "text" | "circle" | "rect";
  width?: string | number;
  height?: string | number;
  className?: string;
  lines?: number;
}

export function Skeleton({
  variant = "text",
  width,
  height,
  className,
  lines = 1,
}: SkeletonProps) {
  const baseClass = "animate-pulse bg-cosmic-nebula/60 rounded";
  const sizeStyle: CSSProperties = {
    width: typeof width === "number" ? `${width}px` : (width ?? "100%"),
    height: typeof height === "number" ? `${height}px` : (height ?? "1rem"),
  };

  if (variant === "text") {
    if (lines > 1) {
      return (
        <div className={clsx("space-y-2", className)} style={sizeStyle}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={clsx(
                baseClass,
                i === lines - 1 ? "w-3/4" : "w-full",
                "h-3",
              )}
            />
          ))}
        </div>
      );
    }
    return (
      <div className={clsx(baseClass, "h-3", className)} style={sizeStyle} />
    );
  }

  return <div className={clsx(baseClass, className)} style={sizeStyle} />;
}
