"use client";

import { useEffect, useRef } from "react";

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function scaleCount(base, density, minimum = 1) {
  return Math.max(minimum, Math.round(base * density));
}

export default function ConstellationField({
  variant = "defense-lines",
  mode = "dark",
  speed = 1,
  size = 1,
  length = 1,
  density = 1,
  strokeWidth = 1,
  opacity = 1,
  hue = 0,
  saturation = 1,
  brightness = 1,
  className = "",
  style = {},
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const safeOpacity = clamp(opacity, 0.05, 1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const safeSpeed = clamp(speed, 0, 3);
    const safeSize = clamp(size, 0.05, 200);
    const safeLength = clamp(length, 0.35, 2.5);
    const safeDensity = clamp(density, 0.25, 2.5);
    const safeStrokeWidth = clamp(strokeWidth, 0.25, 8);

    let width, height;
    let particles = [];

    function initCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
      particles = [];

      const particleCount =
        window.innerWidth < 768
          ? scaleCount(40, safeDensity, 8)
          : scaleCount(100, safeDensity, 16);

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseLength: (Math.random() * 80 + 20) * safeLength,
          speedY: Math.random() * 0.8 + 0.2,
          baseOpacity: Math.random() * 0.2 + 0.05,
        });
      }
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height / 2;
      ctx.lineCap = "butt";
      ctx.lineJoin = "miter";

      const lineWidth = Number((0.5 * safeSize).toFixed(2));
      const currentStrokeWidth = Math.max(0.25, lineWidth);

      particles.forEach((p) => {
        const distFromCenterX = Math.abs(p.x - centerX);
        const distFromCenterY = Math.abs(p.y - centerY);

        const proximityX = Math.max(0, 1 - distFromCenterX / (width / 2));
        const proximityY = Math.max(0, 1 - distFromCenterY / (height / 2));
        const centerProximity = proximityX * (0.4 + proximityY * 0.6);

        const currentLength = p.baseLength * (1 + centerProximity * 4);
        const currentOpacity = Math.min(1.0, p.baseOpacity + centerProximity * 2.0);
        const b = Math.floor(centerProximity * 180);

        ctx.beginPath();
        const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + currentLength);

        if (mode === "light") {
          grad.addColorStop(0, "rgba(153, 27, 27, 0)");
          grad.addColorStop(
            0.5,
            `rgba(185, ${20 + b * 0.55}, ${20 + b * 0.55}, ${currentOpacity})`
          );
          grad.addColorStop(1, "rgba(153, 27, 27, 0)");
        } else {
          grad.addColorStop(0, "rgba(220, 38, 38, 0)");
          grad.addColorStop(
            0.5,
            `rgba(255, ${38 + b}, ${38 + b}, ${currentOpacity})`
          );
          grad.addColorStop(1, "rgba(220, 38, 38, 0)");
        }

        ctx.strokeStyle = grad;
        ctx.lineWidth = currentStrokeWidth;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y + currentLength);
        ctx.stroke();

        p.y -= p.speedY * 1.5 * (1 + centerProximity * 0.5) * safeSpeed;

        if (p.y + currentLength < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
      });

      rafRef.current = requestAnimationFrame(animateCanvas);
    }

    initCanvas();
    rafRef.current = requestAnimationFrame(animateCanvas);

    window.addEventListener("resize", initCanvas);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", initCanvas);
    };
  }, [variant, mode, speed, size, length, density, strokeWidth, opacity, hue, saturation, brightness]);

  const filter =
    hue === 0 && saturation === 1 && brightness === 1
      ? undefined
      : `hue-rotate(${hue}deg) saturate(${saturation}) brightness(${brightness})`;

  const background = mode === "light" ? "#f4ecec" : "#120303";

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: safeOpacity,
        pointerEvents: "none",
        filter,
        background,
        ...style,
      }}
    />
  );
}
