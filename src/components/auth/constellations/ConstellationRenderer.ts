"use client";

import { ConstellationData } from "@/types/celestial/constellation";

export function renderConstellations(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  parallaxX: number,
  parallaxY: number,
  hoveredConstellation: string | null,
  constellations: ConstellationData[],
) {
  ctx.clearRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;

  constellations.forEach((constellation) => {
    const isHovered = hoveredConstellation === constellation.id;
    const baseOpacity = isHovered ? 0.7 : 0.2;
    const lineWidth = isHovered ? 1.5 : 0.8;

    ctx.strokeStyle = isHovered ? "#00ffff" : "#4a9eff";
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = baseOpacity;

    constellation.lines.forEach((line) => {
      const fromStar = constellation.canvasStars.find(
        (s) => s.id === line.from,
      );
      const toStar = constellation.canvasStars.find((s) => s.id === line.to);

      if (fromStar && toStar) {
        const fromX =
          centerX + (fromStar.x * width - centerX) + parallaxX * 0.15;
        const fromY =
          centerY + (fromStar.y * height - centerY) + parallaxY * 0.15;
        const toX = centerX + (toStar.x * width - centerX) + parallaxX * 0.15;
        const toY = centerY + (toStar.y * height - centerY) + parallaxY * 0.15;

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
      }
    });

    constellation.canvasStars.forEach((star) => {
      const x = centerX + (star.x * width - centerX) + parallaxX * 0.15;
      const y = centerY + (star.y * height - centerY) + parallaxY * 0.15;

      ctx.beginPath();
      ctx.arc(x, y, isHovered ? 2.5 : 1.8, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? "#00ffff" : "#ffffff";
      ctx.globalAlpha = isHovered ? 0.9 : 0.5;
      ctx.fill();

      if (isHovered && star.magnitude < 2) {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 4);
        gradient.addColorStop(0, star.color);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.4;
        ctx.fill();
      }
    });

    if (isHovered) {
      const labelX =
        centerX + (constellation.center.x * width - centerX) + parallaxX * 0.15;
      const labelY =
        centerY +
        (constellation.center.y * height - centerY) +
        parallaxY * 0.15;

      ctx.font = "12px Poppins, sans-serif";
      ctx.fillStyle = "#00ffff";
      ctx.globalAlpha = 0.9;
      ctx.textAlign = "center";
      ctx.fillText(constellation.name, labelX, labelY - 15);
      ctx.font = "10px Poppins, sans-serif";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(constellation.indonesianName, labelX, labelY - 2);
    }
  });

  ctx.globalAlpha = 1;
}

export function detectConstellationClick(
  x: number,
  y: number,
  width: number,
  height: number,
  constellations: ConstellationData[],
): string | null {
  const centerX = width / 2;
  const centerY = height / 2;

  for (const constellation of constellations) {
    const cx = centerX + (constellation.center.x * width - centerX);
    const cy = centerY + (constellation.center.y * height - centerY);

    const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    if (dist < Math.min(width, height) * 0.08) {
      return constellation.id;
    }
  }

  return null;
}
