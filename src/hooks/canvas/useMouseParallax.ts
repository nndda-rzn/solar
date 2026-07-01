"use client";

import { useState, useEffect, useCallback } from "react";

export function useMouseParallax(sensitivity: number = 0.3) {
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * sensitivity * 100;
      const y = (e.clientY / window.innerHeight - 0.5) * sensitivity * 100;
      setParallax({ x, y });
    },
    [sensitivity],
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return parallax;
}
