import { Star } from "@/types/canvas/star";

/**
 * Generates a randomized field of background stars across three depth
 * layers (near/mid/far), each with its own size and opacity range to
 * create a parallax-friendly starfield.
 *
 * @param width - Canvas width in pixels used to bound star x positions.
 * @param height - Canvas height in pixels used to bound star y positions.
 * @returns An array of `Star` objects with randomized position, size,
 * opacity, twinkle animation params, depth, and color.
 */
export function generateStars(width: number, height: number): Star[] {
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
        color:
          starColors[Math.floor(Math.random() * starColors.length)] ??
          "#ffffff",
      });
    }
  });

  return stars;
}
