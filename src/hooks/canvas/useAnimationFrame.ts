"use client";

import { useEffect, useRef } from "react";

export function useAnimationFrame(callback: (time: number) => void) {
  const animationId = useRef<number>(0);
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    const animate = () => {
      const time = (Date.now() - startTime.current) / 1000;
      callback(time);
      animationId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId.current);
    };
  }, [callback]);
}
