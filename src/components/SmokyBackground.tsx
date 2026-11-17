"use client";

import React, { useEffect, useRef } from "react";

interface SmokyBackgroundProps {
  intensity?: "light" | "medium" | "deep";
  showEmbers?: boolean;
  className?: string;
}

export default function SmokyBackground({
  intensity = "medium",
  showEmbers = true,
  className = "",
}: SmokyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Smoke particle definition
    interface SmokeParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      maxAlpha: number;
      life: number;
      maxLife: number;
      color: string;
      rotation: number;
      rotSpeed: number;
    }

    interface EmberParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      life: number;
      maxLife: number;
      color: string;
    }

    const smokeCount = intensity === "deep" ? 45 : intensity === "medium" ? 30 : 18;
    const emberCount = showEmbers ? 25 : 0;

    const smokeParticles: SmokeParticle[] = [];
    const emberParticles: EmberParticle[] = [];

    const smokeColors = [
      "245, 245, 250",
      "255, 248, 240",
      "250, 240, 230",
      "240, 242, 248",
    ];

    const emberColors = [
      "245, 158, 11",  // Saffron Amber
      "225, 29, 72",   // Chili Rose
      "251, 191, 36",  // Golden
      "239, 68, 68",   // Warm Ember
    ];

    function createSmokeParticle(initialY?: number): SmokeParticle {
      const maxLife = 220 + Math.random() * 260;
      const life = initialY !== undefined ? Math.random() * maxLife : 0;
      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : height + Math.random() * 60,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(0.5 + Math.random() * 0.9),
        radius: 40 + Math.random() * 60,
        maxRadius: 130 + Math.random() * 140,
        alpha: 0,
        maxAlpha: intensity === "deep" ? 0.16 : intensity === "medium" ? 0.11 : 0.07,
        life,
        maxLife,
        color: smokeColors[Math.floor(Math.random() * smokeColors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.006,
      };
    }

    function createEmberParticle(initialY?: number): EmberParticle {
      const maxLife = 140 + Math.random() * 180;
      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : height + Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(0.8 + Math.random() * 1.4),
        size: 1.5 + Math.random() * 2.5,
        alpha: 0.1 + Math.random() * 0.7,
        life: initialY !== undefined ? Math.random() * maxLife : 0,
        maxLife,
        color: emberColors[Math.floor(Math.random() * emberColors.length)],
      };
    }

    // Initialize particles spread out vertically
    for (let i = 0; i < smokeCount; i++) {
      smokeParticles.push(createSmokeParticle(Math.random() * height));
    }
    for (let i = 0; i < emberCount; i++) {
      emberParticles.push(createEmberParticle(Math.random() * height));
    }

    // Animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render drifting smoke plumes
      for (let i = 0; i < smokeParticles.length; i++) {
        const p = smokeParticles[i];
        p.life++;
        p.x += p.vx + Math.sin(p.life * 0.015) * 0.4;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        const progress = p.life / p.maxLife;
        const currentRadius = p.radius + (p.maxRadius - p.radius) * progress;

        // Smooth fade-in and fade-out
        let currentAlpha = 0;
        if (progress < 0.25) {
          currentAlpha = (progress / 0.25) * p.maxAlpha;
        } else {
          currentAlpha = (1 - (progress - 0.25) / 0.75) * p.maxAlpha;
        }

        if (currentAlpha > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);

          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, currentRadius);
          grad.addColorStop(0, `rgba(${p.color}, ${currentAlpha})`);
          grad.addColorStop(0.4, `rgba(${p.color}, ${currentAlpha * 0.6})`);
          grad.addColorStop(0.8, `rgba(${p.color}, ${currentAlpha * 0.15})`);
          grad.addColorStop(1, `rgba(${p.color}, 0)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Reset dead particle
        if (p.life >= p.maxLife || p.y < -currentRadius) {
          smokeParticles[i] = createSmokeParticle();
        }
      }

      // Render glowing rising embers
      for (let i = 0; i < emberParticles.length; i++) {
        const e = emberParticles[i];
        e.life++;
        e.x += e.vx + Math.sin(e.life * 0.03) * 0.5;
        e.y += e.vy;

        const progress = e.life / e.maxLife;
        let alpha = e.alpha * (1 - progress);

        if (alpha > 0) {
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${e.color}, ${alpha})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgba(${e.color}, 0.8)`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        if (e.life >= e.maxLife || e.y < -10) {
          emberParticles[i] = createEmberParticle();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [intensity, showEmbers]);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ filter: "blur(4px)" }}
      />
    </div>
  );
}

