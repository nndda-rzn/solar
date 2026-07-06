"use client";

import { useCallback, useRef } from "react";

export interface ShootingStar {
  x: number;
  y: number;
  angle: number;
  speed: number;
  life: number;
  maxLife: number;
  length: number;
}

/**
 * Manages shooting-star spawn/physics/draw state for a canvas-based
 * starfield. Shooting stars are stored in a ref (not React state) since
 * they're driven by the caller's `requestAnimationFrame` loop rather than
 * React re-renders.
 *
 * @param width - Canvas width in pixels, used to bound spawn x position.
 * @param height - Canvas height in pixels, used to bound spawn y position.
 * @returns An object exposing `drawShootingStars`, to be called once per
 * animation frame with the target 2D context and the current elapsed time
 * (in seconds, matching the convention used by `useAnimationFrame`).
 */
export function useShootingStars(width: number, height: number) {
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const lastShootingStarTime = useRef(0);

  const drawShootingStars = useCallback(
    (ctx: CanvasRenderingContext2D, time: number) => {
      if (time - lastShootingStarTime.current > 5 + Math.random() * 10) {
        lastShootingStarTime.current = time;
        const startX = Math.random() * width;
        const startY = Math.random() * height * 0.5;
        shootingStarsRef.current.push({
          x: startX,
          y: startY,
          angle: Math.PI / 4 + (Math.random() * Math.PI) / 4,
          speed: 300 + Math.random() * 200,
          life: 0,
          maxLife: 0.5 + Math.random() * 0.5,
          length: 80 + Math.random() * 60,
        });
      }

      shootingStarsRef.current = shootingStarsRef.current.filter((star) => {
        star.life += 1 / 60;
        if (star.life >= star.maxLife) return false;

        const progress = star.life / star.maxLife;
        const fadeOut = progress < 0.5 ? 1 : 1 - (progress - 0.5) * 2;

        star.x += Math.cos(star.angle) * star.speed * (1 / 60);
        star.y += Math.sin(star.angle) * star.speed * (1 / 60);

        const tailX = star.x - Math.cos(star.angle) * star.length;
        const tailY = star.y - Math.sin(star.angle) * star.length;

        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = `rgba(255, 255, 255, ${fadeOut * 0.8})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        const headGradient = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          5,
        );
        headGradient.addColorStop(0, `rgba(200, 220, 255, ${fadeOut})`);
        headGradient.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(star.x, star.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = headGradient;
        ctx.fill();

        return true;
      });
    },
    [width, height],
  );

  return { drawShootingStars };
}
