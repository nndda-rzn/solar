"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
  twinkleOffset: number;
  depth: number;
}

interface ShootingStar {
  x: number;
  y: number;
  angle: number;
  length: number;
  speed: number;
  life: number;
  maxLife: number;
  active: boolean;
  nextSpawn: number;
}

export function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let animationId: number;
    let stars: Star[] = [];
    const shooters: ShootingStar[] = [
      {
        x: 0,
        y: 0,
        angle: 0,
        length: 0,
        speed: 0,
        life: 0,
        maxLife: 0,
        active: false,
        nextSpawn: 3000,
      },
      {
        x: 0,
        y: 0,
        angle: 0,
        length: 0,
        speed: 0,
        life: 0,
        maxLife: 0,
        active: false,
        nextSpawn: 6500,
      },
      {
        x: 0,
        y: 0,
        angle: 0,
        length: 0,
        speed: 0,
        life: 0,
        maxLife: 0,
        active: false,
        nextSpawn: 9500,
      },
    ];

    // Parallax target and current
    const parallax = {
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0,
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      const count = Math.floor((canvas.width * canvas.height) / 6000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.2 + 0.2,
        opacity: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.015 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        // Smaller stars are further away (lower depth).
        depth: 0.2 + Math.random() * 0.8,
      }));
    };

    const spawnShooter = (s: ShootingStar) => {
      s.x = Math.random() * canvas.width * 0.6;
      s.y = Math.random() * canvas.height * 0.4;
      s.angle = Math.PI * 0.15 + Math.random() * Math.PI * 0.15; // ~27° - 54° downward right
      s.length = 70 + Math.random() * 60;
      s.speed = 12 + Math.random() * 6;
      s.life = 0;
      s.maxLife = 35 + Math.random() * 15;
      s.active = true;
      s.nextSpawn = 5000 + Math.random() * 8000;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (reduceMotion) return;
      parallax.targetX = e.clientX / window.innerWidth - 0.5;
      parallax.targetY = e.clientY / window.innerHeight - 0.5;
    };

    const handleMouseLeave = () => {
      parallax.targetX = 0;
      parallax.targetY = 0;
    };

    let t = 0;
    let lastTime = performance.now();
    const draw = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 16.67, 2); // normalize to 60fps frame
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth parallax lerp
      if (!reduceMotion) {
        parallax.currentX += (parallax.targetX - parallax.currentX) * 0.05 * dt;
        parallax.currentY += (parallax.targetY - parallax.currentY) * 0.05 * dt;
      }

      t += 0.008 * dt;

      // Draw stars with parallax
      for (const star of stars) {
        const twinkle =
          star.opacity +
          Math.sin(t * star.speed * 60 + star.twinkleOffset) * 0.15;
        const offsetX = parallax.currentX * star.depth * 40;
        const offsetY = parallax.currentY * star.depth * 25;

        ctx.beginPath();
        ctx.arc(
          star.x + offsetX,
          star.y + offsetY,
          star.radius,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = `rgba(200, 220, 255, ${Math.max(0.05, Math.min(1, twinkle))})`;
        ctx.fill();
      }

      // Update + draw shooting stars
      if (!reduceMotion) {
        for (const s of shooters) {
          if (!s.active) {
            s.nextSpawn -= 16.67 * dt;
            if (s.nextSpawn <= 0) spawnShooter(s);
            continue;
          }

          s.life += 1 * dt;
          s.x += Math.cos(s.angle) * s.speed * dt;
          s.y += Math.sin(s.angle) * s.speed * dt;

          // Fade in then out
          const lifeProgress = s.life / s.maxLife;
          let alpha: number;
          if (lifeProgress < 0.2) {
            alpha = lifeProgress / 0.2;
          } else if (lifeProgress > 0.7) {
            alpha = 1 - (lifeProgress - 0.7) / 0.3;
          } else {
            alpha = 1;
          }
          alpha = Math.max(0, Math.min(1, alpha));

          if (s.life >= s.maxLife) {
            s.active = false;
            continue;
          }

          // Streak via gradient along angle
          const tailX = s.x - Math.cos(s.angle) * s.length;
          const tailY = s.y - Math.sin(s.angle) * s.length;

          const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
          grad.addColorStop(0, `rgba(220, 235, 255, ${alpha})`);
          grad.addColorStop(0.4, `rgba(170, 200, 255, ${alpha * 0.5})`);
          grad.addColorStop(1, `rgba(124, 185, 255, 0)`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();

          // Bright head
          ctx.beginPath();
          ctx.arc(s.x, s.y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
