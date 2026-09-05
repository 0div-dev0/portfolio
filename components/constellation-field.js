"use client";

import { memo, useEffect, useRef, useState } from "react";

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function scaleCount(base, density, minimum = 1) {
  return Math.max(minimum, Math.round(base * density));
}

function ConstellationField({
  variant = "defense-lines",
  speed = 1,
  size = 1,
  length = 1,
  density = 1,
  strokeWidth = 1,
  opacity = 0.7,
  hue = 0,
  saturation = 1,
  brightness = 1,
  className = "",
  style = {},
}) {
  const canvasRef = useRef(null);
  const [isLight, setIsLight] = useState(false);

  // Monitor DOM root for light/dark theme class changes
  useEffect(() => {
    const checkTheme = () => {
      setIsLight(document.documentElement.classList.contains("light"));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

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

    let width, height;
    let particles = [];
    let frameId = null;
    let frameCount = 0;

    function initCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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
          : scaleCount(90, safeDensity, 16);

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
      // Throttle to ~30fps — the drift is slow, so skipping every other frame
      // halves the CPU cost with no visible difference.
      frameCount++;
      if (frameCount % 2 === 1) {
        frameId = requestAnimationFrame(animateCanvas);
        return;
      }

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

        if (isLight) {
          // Deep black & dark charcoal lines in light mode
          grad.addColorStop(0, "rgba(24, 24, 27, 0)");
          grad.addColorStop(
            0.5,
            `rgba(${20 + b * 0.2}, ${20 + b * 0.2}, ${20 + b * 0.2}, ${currentOpacity * 0.85})`
          );
          grad.addColorStop(1, "rgba(24, 24, 27, 0)");
        } else {
          // Bright white & silver lines in dark mode
          grad.addColorStop(0, "rgba(220, 220, 220, 0)");
          grad.addColorStop(
            0.5,
            `rgba(${255 - b}, ${255 - b}, ${255 - b}, ${currentOpacity})`
          );
          grad.addColorStop(1, "rgba(220, 220, 220, 0)");
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

      frameId = requestAnimationFrame(animateCanvas);
    }

    const stop = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    const start = () => {
      if (!frameId) startLoop();
    };

    function startLoop() {
      frameId = requestAnimationFrame(animateCanvas);
    }

    // Freeze the canvas entirely when the tab is hidden.
    const onVisibilityChange = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    // Debounce resizes — initCanvas rebuilds all particles, so only run it
    // once the user settles on the new viewport size.
    let resizeTimer = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initCanvas();
        frameCount = 0;
      }, 150);
    };

    initCanvas();
    startLoop();

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stop();
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [variant, isLight, speed, size, length, density, strokeWidth, opacity, hue, saturation, brightness]);

  const filter =
    hue === 0 && saturation === 1 && brightness === 1
      ? undefined
      : `hue-rotate(${hue}deg) saturate(${saturation}) brightness(${brightness})`;

  const background = isLight ? "#ffffff" : "#050505";

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
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

export default memo(ConstellationField);
