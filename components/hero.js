"use client"
import React from "react";
import Aurora from "./aurora";
import Stars from "./stars";
import { cn } from "@/lib/utils";
import HeroTextBlock from "./hero-text-block";

/**
 * Hero — the monochromatic landing section.
 *
 * Three text blocks cycle through on scroll. Each block enters from below
 * (rotateX + translateY) and exits upward, all scrubbed to scroll position.
 * Block 3 holds on screen while the hero fades behind it.
 *
 * Scroll timeline (scroll-pixel values, spacer = 200vh):
 *   Block 1:  [0, 850]        — enters at load, exits scrolling up
 *   Block 2:  [1000, 1850]    — enters from below, exits scrolling up
 *   Block 3:  [2000, 2500]    — enters from below, holds while hero fades
 *   Hero fade: [2000, 2500]   — entire hero fades (auroras at ~20%)
 *   About enters: scrollY ≈ 200vh
 */
export default function Hero({ className }) {
  const [hoveredOrbColor, setHoveredOrbColor] = React.useState(null);
  const [cursorPos, setCursorPos] = React.useState({ x: 0, y: 0 });
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

      {/* Content — text blocks scroll-animate, buttons stay pinned at bottom */}
      <div
        className="hero-content-wrapper pointer-events-none relative z-10 flex flex-1 flex-col items-center justify-between px-6 pt-24 pb-12 text-center sm:items-start sm:px-12 sm:pt-28 sm:pb-16 sm:text-left lg:px-20"
      >
        {/* Scroll-animated text blocks — parallax offset applied via cursor */}
        <div
          className="relative w-full flex-1 flex items-center justify-center sm:justify-start min-h-[280px] sm:min-h-[340px]"
          style={{ transform: `translate(-${cursorPos.x * 0.005}px, -${cursorPos.y * 0.005}px)` }}
        >
          {/* Block 1 — original hero text (visible at scroll=0) */}
          <HeroTextBlock
            heading="Design in black & white, colour returns on contact."
            subtext="A minimal portfolio that reveals colour as you interact. Move your cursor over the lights above and watch contrast, brightness and hue bloom back into the aurora."
            relativeRange={[0.0, 0.38]}
            isFirst
          />

          {/* Block 2 — enters from below */}
          <HeroTextBlock
            heading="Crafting interfaces that breathe with intention."
            subtext="Every pixel carries a purpose. From subtle micro-interactions to bold compositional choices, each decision is a dialogue between form and function."
            relativeRange={[0.30, 0.72]}
          />

          {/* Block 3 — enters from below, holds while hero fades behind it */}
          <HeroTextBlock
            heading="Where precision meets creative exploration."
            subtext="This portfolio is both a playground and a showcase — an evolving space where ideas are tested, refined, and brought to life through code."
            relativeRange={[0.65, 1.00]}
            isLast
          />
        </div>

        {/* Buttons — pinned at bottom, fade with hero at the end */}
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
