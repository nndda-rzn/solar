"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Star } from "@/types/canvas/star";
import { useMouseParallax } from "@/hooks/canvas/useMouseParallax";
import { useWindowSize } from "@/hooks/canvas/useWindowSize";
import { CONSTELLATIONS } from "./constellations/ConstellationData";
import {
  renderConstellations,
  detectConstellationClick,
} from "./constellations/ConstellationRenderer";
import { ConstellationInfo } from "./info-panel/ConstellationInfo";

function generateStars(width: number, height: number): Star[] {
  const stars: Star[] = [];
  const layers = [
    {
      count: 40,
      sizeMin: 0.5,
      sizeMax: 1,
      opacityMin: 0.2,
      opacityMax: 0.5,
      depth: 0,
    },
    {
      count: 25,
      sizeMin: 1,
      sizeMax: 1.5,
      opacityMin: 0.4,
      opacityMax: 0.7,
      depth: 0.5,
    },
    {
      count: 15,
      sizeMin: 1.5,
      sizeMax: 2.5,
      opacityMin: 0.6,
      opacityMax: 1,
      depth: 1,
    },
  ];

  const starColors = ["#ffffff", "#fff5e6", "#e6f0ff", "#ffe6e6", "#e6ffe6"];

  layers.forEach((layer) => {
    for (let i = 0; i < layer.count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: layer.sizeMin + Math.random() * (layer.sizeMax - layer.sizeMin),
        opacity:
          layer.opacityMin +
          Math.random() * (layer.opacityMax - layer.opacityMin),
        twinkleSpeed: 0.5 + Math.random() * 2,
        twinkleOffset: Math.random() * Math.PI * 2,
        depth: layer.depth,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }
  });

  return stars;
}

interface ShootingStar {
  x: number;
  y: number;
  angle: number;
  speed: number;
  life: number;
  maxLife: number;
  length: number;
}

export function StarBackground() {
  const { width, height } = useWindowSize();
  const parallax = useMouseParallax(0.3);
  const starsCanvasRef = useRef<HTMLCanvasElement>(null);
  const constellationCanvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const lastShootingStarTime = useRef(0);
  const [selectedConstellation, setSelectedConstellation] = useState<
    string | null
  >(null);

  const drawStars = useCallback(
    (ctx: CanvasRenderingContext2D, time: number) => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      starsRef.current.forEach((star) => {
        const parallaxFactor = star.depth * 0.3;
        const baseX = star.x + parallax.x * parallaxFactor;
        const baseY = star.y + parallax.y * parallaxFactor;

        const x = centerX + (baseX - centerX);
        const y = centerY + (baseY - centerY);

        const twinkle =
          Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
        const opacity = star.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = opacity;
        ctx.fill();

        if (star.size > 1.5) {
          ctx.beginPath();
          ctx.arc(x, y, star.size * 3, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            star.size * 3,
          );
          gradient.addColorStop(0, star.color);
          gradient.addColorStop(1, "transparent");
          ctx.fillStyle = gradient;
          ctx.globalAlpha = opacity * 0.2;
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1;
    },
    [width, height, parallax.x, parallax.y],
  );

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

  const drawNebula = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, width, height);

      const nebula1 = ctx.createRadialGradient(
        width * 0.2,
        height * 0.3,
        0,
        width * 0.2,
        height * 0.3,
        width * 0.4,
      );
      nebula1.addColorStop(0, "rgba(139, 92, 246, 0.04)");
      nebula1.addColorStop(0.5, "rgba(99, 102, 241, 0.02)");
      nebula1.addColorStop(1, "transparent");
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, width, height);

      const nebula2 = ctx.createRadialGradient(
        width * 0.8,
        height * 0.7,
        0,
        width * 0.8,
        height * 0.7,
        width * 0.3,
      );
      nebula2.addColorStop(0, "rgba(59, 130, 246, 0.03)");
      nebula2.addColorStop(0.5, "rgba(6, 182, 212, 0.02)");
      nebula2.addColorStop(1, "transparent");
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, width, height);
    },
    [width, height],
  );

  useEffect(() => {
    if (width === 0 || height === 0) return;
    starsRef.current = generateStars(width, height);
  }, [width, height]);

  useEffect(() => {
    const starsCanvas = starsCanvasRef.current;
    const constellationCanvas = constellationCanvasRef.current;
    if (!starsCanvas || !constellationCanvas || width === 0 || height === 0)
      return;

    const starsCtx = starsCanvas.getContext("2d");
    const constellationCtx = constellationCanvas.getContext("2d");
    if (!starsCtx || !constellationCtx) return;

    let animationId: number;
    const startTime = Date.now();

    const animate = () => {
      const time = (Date.now() - startTime) / 1000;
      drawStars(starsCtx, time);
      drawShootingStars(starsCtx, time);
      renderConstellations(
        constellationCtx,
        width,
        height,
        parallax.x,
        parallax.y,
        selectedConstellation,
        CONSTELLATIONS,
      );
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [
    width,
    height,
    parallax.x,
    parallax.y,
    selectedConstellation,
    drawStars,
    drawShootingStars,
  ]);

  useEffect(() => {
    const constellationCanvas = constellationCanvasRef.current;
    if (!constellationCanvas || width === 0 || height === 0) return;

    const ctx = constellationCanvas.getContext("2d");
    if (!ctx) return;

    drawNebula(ctx);
  }, [width, height, drawNebula]);

  const handleConstellationClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const constellationId = detectConstellationClick(
        x,
        y,
        width,
        height,
        CONSTELLATIONS,
      );
      setSelectedConstellation(constellationId);
    },
    [width, height],
  );

  const selectedConstellationData =
    CONSTELLATIONS.find((c) => c.id === selectedConstellation) || null;

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: "#0a0a0f" }}
    >
      <canvas
        ref={starsCanvasRef}
        width={width}
        height={height}
        className="absolute inset-0"
      />
      <canvas
        ref={constellationCanvasRef}
        width={width}
        height={height}
        className="absolute inset-0 cursor-crosshair"
        onClick={handleConstellationClick}
      />

      <ConstellationInfo
        constellation={selectedConstellationData}
        onClose={() => setSelectedConstellation(null)}
      />
    </div>
  );
}
