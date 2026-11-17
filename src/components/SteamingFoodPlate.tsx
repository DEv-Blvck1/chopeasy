"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface SteamingFoodPlateProps {
  className?: string;
  interactive?: boolean;
  showBadges?: boolean;
}

export default function SteamingFoodPlate({
  className = "",
  interactive = true,
  showBadges = true,
}: SteamingFoodPlateProps) {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const container = canvasContainerRef.current;
    if (!container) return;

    let animId: number;
    let renderer: THREE.WebGLRenderer | null = null;
    let smokeTexture: THREE.CanvasTexture | null = null;
    let smokeGeo: THREE.PlaneGeometry | null = null;
    let smokeMatBase: THREE.MeshBasicMaterial | null = null;

    interface SmokeParticle {
      mesh: THREE.Mesh;
      vx: number;
      vy: number;
      vz: number;
      rotSpeed: number;
      baseScale: number;
      maxScale: number;
      age: number;
      life: number;
    }

    const particles: SmokeParticle[] = [];

    try {
      const width = container.clientWidth || 400;
      const height = container.clientHeight || 300;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0.6, 4.2);

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);

      // Create soft smoke puff texture
      const texCanvas = document.createElement("canvas");
      texCanvas.width = 128;
      texCanvas.height = 128;
      const ctx = texCanvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 60);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.7)");
        grad.addColorStop(0.2, "rgba(245, 245, 250, 0.45)");
        grad.addColorStop(0.5, "rgba(230, 235, 245, 0.18)");
        grad.addColorStop(0.8, "rgba(220, 225, 235, 0.04)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(64, 64, 64, 0, Math.PI * 2);
        ctx.fill();
      }
      smokeTexture = new THREE.CanvasTexture(texCanvas);

      const smokeCount = 130;
      const smokeGroup = new THREE.Group();
      scene.add(smokeGroup);

      smokeGeo = new THREE.PlaneGeometry(1, 1);
      smokeMatBase = new THREE.MeshBasicMaterial({
        map: smokeTexture,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });

      const initParticle = (p: SmokeParticle, resetToBottom = false) => {
        const startX = (Math.random() - 0.5) * 1.6;
        const startY = resetToBottom ? -0.45 + Math.random() * 0.15 : -0.45 + Math.random() * 2.2;
        const startZ = (Math.random() - 0.5) * 0.8;

        p.mesh.position.set(startX, startY, startZ);
        p.vx = (Math.random() - 0.5) * 0.003;
        p.vy = 0.007 + Math.random() * 0.008;
        p.vz = (Math.random() - 0.5) * 0.002;
        p.rotSpeed = (Math.random() - 0.5) * 0.015;
        p.baseScale = 0.45 + Math.random() * 0.35;
        p.maxScale = 1.3 + Math.random() * 0.8;
        p.life = 200 + Math.random() * 140;
        p.age = resetToBottom ? 0 : Math.random() * p.life;
      };

      for (let i = 0; i < smokeCount; i++) {
        const mat = smokeMatBase.clone();
        const mesh = new THREE.Mesh(smokeGeo, mat);
        smokeGroup.add(mesh);

        const p: SmokeParticle = {
          mesh,
          vx: 0,
          vy: 0,
          vz: 0,
          rotSpeed: 0,
          baseScale: 0.5,
          maxScale: 1.5,
          age: 0,
          life: 250,
        };

        initParticle(p, false);
        particles.push(p);
      }

      let mouseX = 0;
      let targetX = 0;

      const onMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        targetX = x * 0.004;
      };

      if (interactive) {
        window.addEventListener("mousemove", onMouseMove);
      }

      const onResize = () => {
        if (!container || !renderer) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w && h) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      };
      window.addEventListener("resize", onResize);

      const animate = () => {
        animId = requestAnimationFrame(animate);

        mouseX += (targetX - mouseX) * 0.05;

        for (let i = 0; i < smokeCount; i++) {
          const p = particles[i];
          p.age++;

          const progress = p.age / p.life;

          p.mesh.position.y += p.vy;
          p.mesh.position.x += p.vx + mouseX + Math.sin(p.age * 0.03 + i) * 0.0015;
          p.mesh.position.z += p.vz;
          p.mesh.rotation.z += p.rotSpeed;

          const currentScale = p.baseScale + progress * (p.maxScale - p.baseScale);
          p.mesh.scale.set(currentScale, currentScale, 1);

          let opacity = 0;
          if (progress < 0.2) {
            opacity = (progress / 0.2) * 0.42;
          } else {
            opacity = (1 - progress) * 0.42;
          }

          const mat = p.mesh.material as THREE.MeshBasicMaterial;
          mat.opacity = Math.max(0, opacity);

          if (p.age >= p.life || p.mesh.position.y > 2.3) {
            initParticle(p, true);
          }
        }

        if (renderer) {
          renderer.render(scene, camera);
        }
      };

      animate();

      return () => {
        cancelAnimationFrame(animId);
        if (interactive) window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);

        smokeTexture?.dispose();
        smokeGeo?.dispose();
        smokeMatBase?.dispose();
        particles.forEach((p) => {
          (p.mesh.material as THREE.Material).dispose();
        });
        if (renderer) {
          renderer.dispose();
          if (container && renderer.domElement && container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        }
      };
    } catch (err) {
      console.warn("Three.js smoke animation fallback:", err);
    }
  }, [mounted, interactive]);

  const safeClassName = className || "";
  const hasDimensions = safeClassName.includes("aspect-") || safeClassName.includes("h-");

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl shadow-2xl border border-white/40 ${
        hasDimensions ? safeClassName : `aspect-[580/370] ${safeClassName}`
      }`}
    >
      {/* 1. Static authentic gourmet food dish photo from screenshot */}
      <img
        src="/hot-food.png"
        alt="Sizzling Hot Culinary Dish"
        className="w-full h-full object-cover select-none pointer-events-none"
      />

      {/* 2. Three.js animated rising smoke plumes overlaid directly above the hot food */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 z-10 pointer-events-auto"
      />

      {/* 3. Subtle vignette shadow for seamless visual integration */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none z-20" />

      {/* Optional decorative tags */}
      {showBadges && (
        <div className="absolute bottom-4 left-4 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/75 backdrop-blur-md text-[11px] text-amber-300 font-bold border border-white/10 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sizzling Hot Kitchen View</span>
        </div>
      )}
    </div>
  );
}
