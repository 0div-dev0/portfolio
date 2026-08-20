"use client"
import React from "react";
import Aurora from "./aurora";
import Stars from "./stars";
import { cn } from "@/lib/utils";

/**
 * Hero — the monochromatic landing section.
 *
 * Pure black & white design language: zinc palette, white type on near-black,
 * with the Aurora behind it that blooms into colour on hover.
 * Stars layer sits between the background and the orbs.
 * Parallax text follows cursor in opposite direction.
 */
export default function Hero({ className }) {
  const [hoveredOrbColor, setHoveredOrbColor] = React.useState(null);
  const [cursorPos, setCursorPos] = React.useState({ x: 0, y: 0 });
  // Where each orb navigates when clicked (index 0-4).
  const ORB_TARGETS = ["#work", "#contact", "#work", "#contact", "#work"];

  const handleOrbClick = React.useCallback((index) => {
    const target = document.querySelector(ORB_TARGETS[index] || "#work");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      className={cn(
        "relative flex min-h-svh flex-col overflow-hidden bg-background font-sans text-foreground selection:bg-foreground selection:text-background transition-colors duration-300",
        className
      )}
    >
      <Stars hoveredOrbColor={hoveredOrbColor} />

      <Aurora setHoveredOrbColor={setHoveredOrbColor} onOrbClick={handleOrbClick} />

      {/* Content */}
      <div
        className="hero-content-wrapper pointer-events-none relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-28 text-center sm:items-start sm:px-12 sm:text-left lg:px-24"
      >
        <div style={{ transform: `translate(-${cursorPos.x * 0.02}px, -${cursorPos.y * 0.02}px)` }}>

        <h1 className="hero-reveal hero-reveal-delay-1 mt-8 max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          Design in black & white,
          <br />
          <span className="italic text-muted">colour returns on contact.</span>
        </h1>

        <p className="hero-reveal hero-reveal-delay-2 mt-8 max-w-xl text-lg leading-8 text-muted">
          A minimal portfolio that reveals colour as you interact. Move your cursor
          over the lights above and watch contrast, brightness and hue bloom back
          into the aurora.
        </p>

        <div className="hero-reveal hero-reveal-delay-3 mt-12 flex flex-col gap-4 sm:flex-row">
          <a
            href="#work"
            className="pointer-events-auto inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-background transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]"
          >
            View project
          </a>
          <a
            href="#contact"
            className="pointer-events-auto inline-flex h-12 items-center justify-center rounded-full border border-border px-8 text-sm font-medium text-foreground transition-all duration-300 hover:border-primary hover:bg-primary/5"
          >
            Start conversation
          </a>
        </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hero-scroll-hint hero-reveal hero-reveal-delay-3 pointer-events-none relative z-10 flex flex-col items-center gap-3 pb-12 font-mono text-[10px] uppercase tracking-[0.4em] text-muted">
        <span className="scroll-line h-8 w-px" />
        View project
      </div>

    </section>
  );
}