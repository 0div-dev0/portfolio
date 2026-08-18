"use client";

import { useEffect, useRef, useState } from "react";

const pulseKeyframes = `
  @keyframes pulse-orbs {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
  }
`;

export function useKeyframes(keyframes) {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = keyframes;
    style.type = "text/css";
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [keyframes]);
}

function CursorOrb({
  size = 30,
  blur = "10px",
  brightness = "1.5",
  contrast = "2.5",
  transitionSpeed = 0.03,
} = {}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const orbRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useKeyframes(pulseKeyframes);

  const handleMouseMove = (e) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
    setPosition({
      x: e.clientX - size / 2,
      y: e.clientY - size / 2,
    });
  };

  useEffect(() => {
    const orb = orbRef.current;
    if (!orb) return;

    const updatePosition = () => {
      const targetX = mouseRef.current.x - size / 2;
      const targetY = mouseRef.current.y - size / 2;

      const currentX = parseFloat(orb.style.left) || 0;
      const currentY = parseFloat(orb.style.top) || 0;

      const easedX = currentX + (targetX - currentX) * transitionSpeed;
      const easedY = currentY + (targetY - currentY) * transitionSpeed;

      orb.style.left = `${easedX}px`;
      orb.style.top = `${easedY}px`;

      rafRef.current = requestAnimationFrame(updatePosition);
    };

    const loop = () => {
      updatePosition();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    window.addEventListener("pointermove", handleMouseMove, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", handleMouseMove);
    };
  }, [transitionSpeed]);

  return (
    <div
      ref={orbRef}
      className="cursor-orb absolute pointer-events-none rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: "transparent",
        border: "1px solid currentColor",
        backdropFilter: `blur(${blur})`,
        WebkitBackdropFilter: `blur(${blur})`,
        filter: `brightness(${brightness}) contrast(${contrast})`,
        opacity: 0.9,
        boxShadow: `0 0 20px rgba(255,255,255,0.3)`,
        animation: "pulse-orbs 4s ease-in-out infinite",
      }}
    />
  );
}

export default CursorOrb;