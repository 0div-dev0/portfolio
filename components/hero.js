"use client"
import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import Aurora from "./aurora";
import Stars from "./stars";
import { cn } from "@/lib/utils";
import HeroTextBlock from "./hero-text-block";
import ProjectsCarousel from "./projects-carousel";

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

const DEFAULT_HEADING = "Hi, I'm Divit Jain- A passionate designer and startup founder";
const DEFAULT_SUBTEXT =
  "Scroll or click the orbs to take a peek at my work.";

// Stable reference so HeroTextBlock's scroll effect isn't re-created per render.
const TEXT_RANGE = [0.0, 0.4];

export default function Hero({ className }) {
  const [hoveredOrbColor, setHoveredOrbColor] = useState(null);
  const [hoveredOrbIndex, setHoveredOrbIndex] = useState(null);
  const textContainerRef = useRef(null);
  const portraitRef = useRef(null);

  const ORB_TARGETS = useMemo(
    () => [
      "/gallery?orb=0",
      "/gallery?orb=1",
      "/gallery?orb=2",
      "/gallery?orb=3",
      "/gallery?orb=4",
    ],
    []
  );

  const handleOrbClick = useCallback(
    (index) => {
      const target = ORB_TARGETS[index];
      if (target) window.location.href = target;
    },
    [ORB_TARGETS]
  );

  // Self-portrait parallax: the portrait lags the page as you scroll
  // (translateY up slower than the scroll), applied via ref so no re-render.
  useEffect(() => {
    const el = portraitRef.current;
    if (!el) return;
    let ticking = false;
    const update = () => {
      el.style.transform = `translateX(-50%) translateY(${
        window.scrollY * 0.35
      }px)`;
    };
    update();
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Apply the subtle cursor parallax to the text container directly via a ref,
  // so mousemove never triggers a React re-render of the whole hero.
  useEffect(() => {
    const handleMouseMove = (e) => {
      const el = textContainerRef.current;
      if (!el) return;
      el.style.transform = `translate(${e.clientX * 0.005}px, ${
        e.clientY * 0.005
      }px)`;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () =>
      window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const activeOrb =
    hoveredOrbIndex !== null && hoveredOrbIndex >= 0
      ? ORB_DETAILS[hoveredOrbIndex]
      : null;

  const currentHeading = activeOrb ? activeOrb.heading : DEFAULT_HEADING;
  const currentSubtext = activeOrb ? activeOrb.desc : DEFAULT_SUBTEXT;

  const galleryBadge = useMemo(
    () =>
      activeOrb ? (
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
      ) : null,
    [activeOrb, hoveredOrbIndex]
  );

  return (
    <section
      className={cn(
        "relative flex h-svh flex-col overflow-hidden bg-background font-sans text-foreground selection:bg-foreground selection:text-background transition-colors duration-300",
        className
      )}
    >
      <Stars hoveredOrbColor={hoveredOrbColor} />

      {/* Self-portrait — bottom-center, behind Aurora orbs and text (z-2 vs z-10) */}
      <div
        ref={portraitRef}
        className="hero-portrait pointer-events-none"
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 3,
          width: "clamp(260px, 36vw, 520px)",
          height: "65vh",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 25%, black 50%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 25%, black 50%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/selfportrait.png"
          alt="Divit Jain"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "bottom center",
            display: "block",
            userSelect: "none",
            draggable: "false",
          }}
        />
      </div>

      <Aurora
        setHoveredOrbColor={setHoveredOrbColor}
        setHoveredOrbIndex={setHoveredOrbIndex}
        onOrbClick={handleOrbClick}
      />

      {/* Content — text block scroll-animates & typewriter updates on hover */}
      <div
        className="hero-content-wrapper pointer-events-none relative z-10 flex flex-col items-center justify-start gap-5 px-6 pt-16 pb-12 text-center sm:items-start sm:px-12 sm:pt-20 sm:text-left lg:px-20"
      >
        {/* Text block container with subtle cursor parallax */}
        <div
          ref={textContainerRef}
          className="relative w-full min-h-[220px] sm:min-h-[280px] will-change-transform flex items-center justify-center sm:justify-start"
        >
          {/* Main Hero Text Block with Typewriter and dynamic Orb hover text */}
          <HeroTextBlock
            heading={currentHeading}
            subtext={currentSubtext}
            galleryBadge={galleryBadge}
            relativeRange={TEXT_RANGE}
            isFirst
            useTypewriter
          />
        </div>

        {/* Recent projects — carousel with live-embedded iframe cards */}
        <ProjectsCarousel className="mt-2" />
      </div>

      {/* Scroll hint */}
      <div className="hero-scroll-hint hero-reveal hero-reveal-delay-3 pointer-events-none relative z-10 flex flex-col items-center gap-3 pb-12 font-mono text-[10px] uppercase tracking-[0.4em] text-muted">
        <span className="scroll-line h-8 w-px" />
        View project
      </div>

    </section>
  );
}
