"use client"
import React, { useState, useCallback, useEffect } from "react";
import Aurora from "./aurora";
import Stars from "./stars";
import ConstellationField from "./constellation-field";
import { cn } from "@/lib/utils";
import HeroTextBlock from "./hero-text-block";

const ORB_DETAILS = [
  {
    name: "Spectrum 01",
    color: "#a78bfa",
    heading: "Organic Luminescence — Light Field Study",
    desc: "A study in spatial depth. Organic lights drift through shadow, revealing rich spectrum fields on interaction.",
  },
  {
    name: "Currents 02",
    color: "#22d3ee",
    heading: "Fluid Resonance — Subsurface Dynamics",
    desc: "Exploring currents pulsing beneath a calm surface. Fluid paths spread across the background matrix.",
  },
  {
    name: "Motion 03",
    color: "#f472b6",
    heading: "Impermanence — Forms Unfolding",
    desc: "Quiet warmth emerging from deep shadow, unfolding like memory returning to a minimal canvas.",
  },
  {
    name: "Combustion 04",
    color: "#fbbf24",
    heading: "Radiance Field — Energy & Heat",
    desc: "Controlled warmth as a creative force. Radiance emitting across high-contrast dark interface elements.",
  },
  {
    name: "Structure 05",
    color: "#34d399",
    heading: "Structural Growth — Canopy Dynamics",
    desc: "Resilient canopy structures building upward with patience, balance and architectural intention.",
  },
];

const DEFAULT_HEADING = "Design in black & white, colour returns on contact.";
const DEFAULT_SUBTEXT = "A minimal portfolio that reveals colour as you interact. Move your cursor over the lights above and watch contrast, brightness and hue bloom back into the aurora.";

export default function Hero({ className }) {
  const [hoveredOrbColor, setHoveredOrbColor] = useState(null);
  const [hoveredOrbIndex, setHoveredOrbIndex] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const ORB_TARGETS = [
    "/gallery?orb=0",
    "/gallery?orb=1",
    "/gallery?orb=2",
    "/gallery?orb=3",
    "/gallery?orb=4",
  ];

  const handleOrbClick = useCallback((index) => {
    const target = ORB_TARGETS[index];
    if (target) window.location.href = target;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const activeOrb = hoveredOrbIndex !== null && hoveredOrbIndex >= 0 ? ORB_DETAILS[hoveredOrbIndex] : null;

  const currentHeading = activeOrb ? activeOrb.heading : DEFAULT_HEADING;
  const currentSubtext = activeOrb ? activeOrb.desc : DEFAULT_SUBTEXT;

  const galleryBadge = activeOrb ? (
    <a
      href={`/gallery?orb=${hoveredOrbIndex}`}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded-full border transition-all duration-300 pointer-events-auto hover:scale-105"
      style={{
        borderColor: `${activeOrb.color}60`,
        color: activeOrb.color,
        backgroundColor: `${activeOrb.color}18`,
        boxShadow: `0 0 20px ${activeOrb.color}30`,
      }}
    >
      <span
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ backgroundColor: activeOrb.color, boxShadow: `0 0 8px ${activeOrb.color}` }}
      />
      Gallery &rarr;
    </a>
  ) : null;

  return (
    <section
      className={cn(
        "relative flex min-h-svh flex-col overflow-hidden bg-background font-sans text-foreground selection:bg-foreground selection:text-background transition-colors duration-300",
        className
      )}
    >
      {/* Defense-lines constellation background — deepest layer */}
      <ConstellationField
        variant="defense-lines"
        mode="dark"
        speed={1}
        size={1}
        length={1}
        density={1}
        opacity={0.5}
        className="absolute inset-0 z-[1]"
      />

      <Stars hoveredOrbColor={hoveredOrbColor} />

      <Aurora
        setHoveredOrbColor={setHoveredOrbColor}
        setHoveredOrbIndex={setHoveredOrbIndex}
        onOrbClick={handleOrbClick}
      />

      {/* Content — text block scroll-animates & typewriter updates on hover */}
      <div
        className="hero-content-wrapper pointer-events-none relative z-10 flex flex-1 flex-col items-center justify-between px-6 pt-24 pb-12 text-center sm:items-start sm:px-12 sm:pt-28 sm:pb-16 sm:text-left lg:px-20"
      >
        {/* Text block container with subtle cursor parallax */}
        <div
          className="relative w-full flex-1 flex items-center justify-center sm:justify-start min-h-[280px] sm:min-h-[340px]"
          style={{ transform: `translate(-${cursorPos.x * 0.005}px, -${cursorPos.y * 0.005}px)` }}
        >
          {/* Main Hero Text Block with Typewriter and dynamic Orb hover text */}
          <HeroTextBlock
            heading={currentHeading}
            subtext={currentSubtext}
            galleryBadge={galleryBadge}
            relativeRange={[0.0, 0.4]}
            isFirst
            useTypewriter
          />
        </div>

        {/* Buttons — pinned at bottom */}
        <div className="pointer-events-auto mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto items-stretch sm:items-center">
          <a
            href="#work"
            className="inline-flex h-11 sm:h-12 items-center justify-center rounded-full bg-primary px-6 sm:px-8 text-sm font-medium text-background transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]"
          >
            View project
          </a>
          <a
            href="#contact"
            className="inline-flex h-11 sm:h-12 items-center justify-center rounded-full border border-border px-6 sm:px-8 text-sm font-medium text-foreground transition-all duration-300 hover:border-primary hover:bg-primary/5"
          >
            Start conversation
          </a>
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

