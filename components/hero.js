"use client"
import React from "react";
import Aurora from "./aurora";
import Stars from "./stars";
import CursorOrb from "./cursor-orb";

/**
 * Hero — the monochromatic landing section.
 *
 * Pure black & white design language: zinc palette, white type on near-black,
 * with the Aurora behind it that blooms into colour on hover.
 * Stars layer sits between the background and the orbs.
 * Parallax text follows cursor in opposite direction.
 */
export default function Hero() {
  const [hoveredOrbColor, setHoveredOrbColor] = React.useState(null);
  const [cursorPos, setCursorPos] = React.useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = React.useState(0);

  // Where each orb navigates when clicked (index 0-4). Update these to your
  // section anchors once the portfolio sections exist.
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

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Opacity progress: 0 at top, 1 after hero passes
  // hero height is roughly min-h-svh (~100vh), so use scrollY / viewport height
  const opacityProgress = 1;
  // const opacityProgress = Math.max(Math.min(scrollY / 800, 1), 0.1);

  return (
    <section
      className="relative flex min-h-svh flex-col overflow-hidden bg-[#050505] font-sans text-white selection:bg-white selection:text-black"
    >
      <Stars hoveredOrbColor={hoveredOrbColor} />

      <Aurora setHoveredOrbColor={setHoveredOrbColor} onOrbClick={handleOrbClick} />

      {/* Cursor-following blurred transparent orb */}
      <CursorOrb size={30} blur="10px" transitionSpeed={0.08} />

      {/* Content */}
      <div
        className="pointer-events-none relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-28 text-center sm:items-start sm:px-12 sm:text-left lg:px-24"
        style={{ transform: `translate(-${cursorPos.x * 0.02}px, -${cursorPos.y * 0.02}px)` }}
      >

        <h1 className="hero-reveal hero-reveal-delay-1 mt-8 max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          Design in black & white,
          <br />
          <span className="italic text-zinc-400">colour returns on contact.</span>
        </h1>

        <p className="hero-reveal hero-reveal-delay-2 mt-8 max-w-xl text-lg leading-8 text-zinc-400">
          A minimal portfolio that reveals colour as you interact. Move your cursor
          over the lights above and watch contrast, brightness and hue bloom back
          into the aurora.
        </p>

        <div className="hero-reveal hero-reveal-delay-3 mt-12 flex flex-col gap-4 sm:flex-row">
          <a
            href="#work"
            className="pointer-events-auto inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-black transition-all duration-300 hover:bg-zinc-200 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]"
          >
            View project
          </a>
          <a
            href="#contact"
            className="pointer-events-auto inline-flex h-12 items-center justify-center rounded-full border border-zinc-700 px-8 text-sm font-medium text-white transition-all duration-300 hover:border-white hover:bg-white/5"
          >
            Start conversation
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hero-reveal hero-reveal-delay-3 pointer-events-none relative z-10 flex flex-col items-center gap-3 pb-12 font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-600">
        <span className="scroll-line h-8 w-px" />
        View project
      </div>

      {/* Sticky top-right banner - always fixed, opacity fades with scroll */}
      <div
        className="fixed top-5 right-5 flex items-center gap-2 px-4 py-2 rounded-full transition-opacity duration-500"
        style={{ opacity: opacityProgress }}
      >
        <a href="" className="hidden sm:block text-white text-sm font-medium mr-4">Contact me</a>
        <a href="" className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center text-white/50 transition-colors hover:text-white hover:border-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1-12 0"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/><path d="M20 8a4 4 0 0 1-8 0"/><line x1="" y1="16" x2="" y2="16"/><circle cx="10.5" cy="10.5" r="1.5"/></svg>
        </a>
        <a href="" className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center text-white/50 transition-colors hover:text-white hover:border-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1-12 0"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/><path d="M20 8a4 4 0 0 1-8 0"/><line x1="1" y1="1" x2="23" y2="23"/><circle cx="10.5" cy="10.5" r="1.5"/></svg>
        </a>
      </div>
    </section>
  );
}