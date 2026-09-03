"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// ── Gallery data ────────────────────────────────────────────────────────────
const GALLERY_ITEMS = [
  {
    title: "Aurora",
    subtitle: "Where light dances with intention",
    description:
      "A study in chromatic depth — five organic lights drift through a monochrome void, each carrying a hidden spectrum that reveals itself on contact.",
    color: "#a78bfa",
    colorDark: "#6d28d9",
  },
  {
    title: "Cyan Tide",
    subtitle: "Depth beyond the surface",
    description:
      "Exploring bioluminescent currents pulsing beneath a calm exterior — fluid vertical motion and interactive scroll-scrubbed text replacement.",
    color: "#22d3ee",
    colorDark: "#0891b2",
  },
  {
    title: "Rosebud",
    subtitle: "Fragile power in bloom",
    description:
      "A meditation on impermanence — tap or click to flip through 3D interactive page cards, unfurling emotion and shadow across light fields.",
    color: "#f472b6",
    colorDark: "#be185d",
  },
  {
    title: "Ember",
    subtitle: "Heat that shapes and destroys",
    description:
      "Fire as a creative force — image card fully visible on the left, seamlessly dissolving into dark gradient masks on the right with integrated text specs.",
    color: "#fbbf24",
    colorDark: "#d97706",
  },
  {
    title: "Verdant",
    subtitle: "Life persists in the quiet",
    description:
      "The resilience of growth — interactive 3D isometric stacked cards fanning out into perspective views on tap and hover.",
    color: "#34d399",
    colorDark: "#059669",
  },
];

// ── Cinematic Letter Reveal ─────────────────────────────────────────────────
function CinematicText({ text, color, delay = 0, className = "" }) {
  return (
    <span className={cn("inline-block", className)} aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span
          key={`${text}-${i}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.25,
            delay: delay + i * 0.03,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
          style={{
            textShadow: char !== " " ? `0 0 20px ${color}40` : undefined,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

// ── Staggered Assembly Entrance Wrapper ──────────────────────────────────────
function AssemblyEntrance({ children, cutsceneKey }) {
  return (
    <motion.div
      key={`assembly-${cutsceneKey}`}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.15,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// ── Dot 0: Purple Orb (Aurora) - 3 Horizontal Stripes Carousel ───────────────
function PurpleStripeCarousel({ color = "#a78bfa" }) {
  const [hoveredCardId, setHoveredCardId] = useState(null);

  const topCards = [
    { id: "top-1", title: "SPECTRUM STUDY 01", bg: "linear-gradient(135deg, #1e0038, #5b21b6, #a78bfa)" },
    { id: "top-2", title: "OPTICAL MATRIX 02", bg: "linear-gradient(135deg, #110026, #4c1d95, #c084fc)" },
    { id: "top-3", title: "LIGHT DYNAMICS 03", bg: "linear-gradient(135deg, #2e1065, #7e22ce, #e879f9)" },
    { id: "top-4", title: "CHROMATIC SHIFT 04", bg: "linear-gradient(135deg, #090314, #581c87, #818cf8)" },
    { id: "top-5", title: "AURORA VECTOR 05", bg: "linear-gradient(135deg, #3b0764, #6d28d9, #ddd6fe)" },
    { id: "top-6", title: "NEON GRADIENT 06", bg: "linear-gradient(135deg, #1e1035, #9333ea, #f472b6)" },
  ];

  const bottomCards = [
    { id: "bot-1", title: "QUANTUM WAVE 01", bg: "linear-gradient(225deg, #4c1d95, #7c3aed, #e0e7ff)" },
    { id: "bot-2", title: "SHADOW HARMONY 02", bg: "linear-gradient(225deg, #111827, #581c87, #a78bfa)" },
    { id: "bot-3", title: "PRISM FIELD 03", bg: "linear-gradient(225deg, #2e1065, #9333ea, #38bdf8)" },
    { id: "bot-4", title: "SYNTH WAVE 04", bg: "linear-gradient(225deg, #3b0764, #a855f7, #f472b6)" },
    { id: "bot-5", title: "VOID RADIANCE 05", bg: "linear-gradient(225deg, #09090b, #6d28d9, #c084fc)" },
    { id: "bot-6", title: "LUMEN BLOOM 06", bg: "linear-gradient(225deg, #1e1b4b, #7e22ce, #f43f5e)" },
  ];

  const isAnyHovered = hoveredCardId !== null;

  return (
    <div className="relative w-full py-2 flex flex-col gap-5 overflow-hidden select-none">
      {/* Top Carousel (Moving Left) */}
      <div className="relative w-full overflow-hidden py-4 z-20">
        <div
          className="flex gap-5 w-max animate-marquee-left"
          style={{
            animationPlayState: isAnyHovered ? "paused" : "running",
          }}
        >
          {[...topCards, ...topCards].map((card, idx) => {
            const cardKey = `${card.id}-${idx}`;
            const isHovered = hoveredCardId === cardKey;
            return (
              <div
                key={cardKey}
                onMouseEnter={() => setHoveredCardId(cardKey)}
                onMouseLeave={() => setHoveredCardId(null)}
                className="relative cursor-pointer transition-all duration-300 ease-out"
                style={{
                  transform: isHovered
                    ? "translateY(32px) scale(1.22)"
                    : "translateY(0) scale(1)",
                  zIndex: isHovered ? 50 : 1,
                  boxShadow: isHovered
                    ? `0 20px 40px rgba(0,0,0,0.9), 0 0 35px ${color}90`
                    : `0 0 12px ${color}20`,
                }}
              >
                <div
                  className="w-48 sm:w-56 h-28 sm:h-32 rounded-lg p-3.5 flex flex-col justify-between border border-white/15 overflow-hidden relative group"
                  style={{ background: card.bg }}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 backdrop-blur-[1px]" />
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-white/60">
                      AURORA STRIPE TOP
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-300 shadow-[0_0_8px_#a78bfa]" />
                  </div>
                  <div className="relative z-10">
                    <span className="text-xs font-semibold font-mono text-white tracking-wider uppercase block">
                      {card.title}
                    </span>
                  </div>
                  <div
                    className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300"
                    style={{
                      border: `1px solid ${color}${isHovered ? "90" : "30"}`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Middle Stripe (Faint background ticker with centered DEVELOPING PORTFOLIO) */}
      <div className="relative w-full py-4 overflow-hidden flex items-center justify-center z-10 my-1">
        <div className="absolute inset-0 opacity-20 flex gap-8 items-center whitespace-nowrap overflow-hidden pointer-events-none">
          <div className="flex gap-8 w-max animate-marquee-right">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="text-lg sm:text-xl font-mono uppercase tracking-[0.3em] text-purple-300"
              >
                • DEVELOPING PORTFOLIO • EXPERIMENTAL UI • REVISION 2.0 • CHROMATIC DEPTH
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-20 text-center py-2.5 px-8 sm:px-12 rounded-full bg-black/80 backdrop-blur-md border border-purple-500/40 shadow-[0_0_30px_rgba(167,139,250,0.35)]">
          <h3
            className="text-xl sm:text-3xl md:text-4xl font-black tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-purple-300 to-indigo-200"
            style={{
              textShadow: `0 0 30px ${color}90`,
            }}
          >
            DEVELOPING PORTFOLIO
          </h3>
        </div>
      </div>

      {/* Bottom Carousel (Moving Right) */}
      <div className="relative w-full overflow-hidden py-4 z-20">
        <div
          className="flex gap-5 w-max animate-marquee-right"
          style={{
            animationPlayState: isAnyHovered ? "paused" : "running",
          }}
        >
          {[...bottomCards, ...bottomCards].map((card, idx) => {
            const cardKey = `${card.id}-${idx}`;
            const isHovered = hoveredCardId === cardKey;
            return (
              <div
                key={cardKey}
                onMouseEnter={() => setHoveredCardId(cardKey)}
                onMouseLeave={() => setHoveredCardId(null)}
                className="relative cursor-pointer transition-all duration-300 ease-out"
                style={{
                  transform: isHovered
                    ? "translateY(-32px) scale(1.22)"
                    : "translateY(0) scale(1)",
                  zIndex: isHovered ? 50 : 1,
                  boxShadow: isHovered
                    ? `0 -20px 40px rgba(0,0,0,0.9), 0 0 35px ${color}90`
                    : `0 0 12px ${color}20`,
                }}
              >
                <div
                  className="w-48 sm:w-56 h-28 sm:h-32 rounded-lg p-3.5 flex flex-col justify-between border border-white/15 overflow-hidden relative group"
                  style={{ background: card.bg }}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 backdrop-blur-[1px]" />
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-white/60">
                      AURORA STRIPE BOTTOM
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-300 shadow-[0_0_8px_#a78bfa]" />
                  </div>
                  <div className="relative z-10">
                    <span className="text-xs font-semibold font-mono text-white tracking-wider uppercase block">
                      {card.title}
                    </span>
                  </div>
                  <div
                    className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300"
                    style={{
                      border: `1px solid ${color}${isHovered ? "90" : "30"}`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Dot 1: Cyan Orb (Cyan Tide) - 3 Vertical Columns Carousel with Scroll Replace ─
function CyanVerticalCarousel({ color = "#22d3ee" }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const studies = [
    { title: "Bioluminescent Flow 01", desc: "Currents pulsing beneath a calm surface." },
    { title: "Cyan Subsurface 02", desc: "Electric cyan waves diffusing through darkness." },
    { title: "Tidal Resonance 03", desc: "Deep water optical reflections on contact." },
    { title: "Hydro Dynamics 04", desc: "Bioluminescence activated by user interaction." },
  ];

  const handleWheel = (e) => {
    if (e.deltaY > 0) {
      setActiveIndex((prev) => (prev + 1) % studies.length);
    } else if (e.deltaY < 0) {
      setActiveIndex((prev) => (prev - 1 + studies.length) % studies.length);
    }
  };

  return (
    <div
      onWheel={handleWheel}
      className="relative w-full h-[340px] sm:h-[380px] grid grid-cols-1 md:grid-cols-3 gap-4 items-center overflow-hidden p-2 rounded-lg bg-black/40 border border-cyan-500/20"
    >
      {/* Left Column (Scrolling Down) */}
      <div className="hidden md:flex flex-col gap-3 overflow-hidden h-full py-2">
        <div className="animate-marquee-down flex flex-col gap-3">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="h-24 rounded-md p-3 border border-cyan-500/30 flex flex-col justify-end text-[10px] font-mono text-cyan-300/80 uppercase"
              style={{
                background: "linear-gradient(180deg, #061e29 0%, #0891b2 100%)",
              }}
            >
              Cyan Flow Layer {idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Middle Column (Scrolling Up & Active Focused Card) */}
      <div className="relative h-full flex flex-col items-center justify-between p-4 rounded-lg bg-cyan-950/40 border border-cyan-400/40 shadow-[0_0_30px_rgba(34,211,238,0.2)] overflow-hidden">
        <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
          Scroll / Swipe to Cycle • Study {activeIndex + 1} / {studies.length}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="text-center my-auto flex flex-col items-center gap-3"
          >
            <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-cyan-200">
              {studies[activeIndex].title}
            </h4>
            <p className="text-xs sm:text-sm text-cyan-300/70 max-w-xs leading-relaxed font-mono">
              {studies[activeIndex].desc}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-2">
          {studies.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                i === activeIndex ? "w-6 bg-cyan-400 shadow-[0_0_10px_#22d3ee]" : "bg-cyan-900/60"
              )}
            />
          ))}
        </div>
      </div>

      {/* Right Column (Scrolling Down) */}
      <div className="hidden md:flex flex-col gap-3 overflow-hidden h-full py-2">
        <div className="animate-marquee-down flex flex-col gap-3">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="h-24 rounded-md p-3 border border-cyan-500/30 flex flex-col justify-end text-[10px] font-mono text-cyan-300/80 uppercase"
              style={{
                background: "linear-gradient(180deg, #0e7490 0%, #06b6d4 100%)",
              }}
            >
              Cyan Depth Stream {idx + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Dot 2: Rose Orb (Rosebud) - 3D Page Flip Book Carousel ────────────────────
function RosePageFlipCarousel({ color = "#f472b6" }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const pages = [
    { title: "ROSEBUD COVER 01", text: "A meditation on the power of impermanence.", accent: "#f472b6" },
    { title: "PETAL UNFURLED 02", text: "Colour rising from shadow like returning memory.", accent: "#be185d" },
    { title: "MAGENTA PULSE 03", text: "Fragile weight of emotion reflected in dark space.", accent: "#ec4899" },
    { title: "SHADOW BLOOM 04", text: "Depth and luminescence interacting in harmony.", accent: "#db2777" },
  ];

  const handleNextPage = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage((prev) => (prev + 1) % pages.length);
      setIsFlipping(false);
    }, 250);
  };

  return (
    <div className="relative w-full h-[340px] sm:h-[380px] flex items-center justify-center perspective-1000">
      <motion.div
        onClick={handleNextPage}
        className="relative w-full max-w-lg h-72 sm:h-80 rounded-xl p-6 cursor-pointer preserve-3d transition-transform duration-500 border border-rose-500/30 shadow-[0_0_35px_rgba(244,114,182,0.25)] flex flex-col justify-between overflow-hidden"
        animate={{ rotateY: isFlipping ? -90 : 0 }}
        transition={{ duration: 0.25 }}
        style={{
          background: `linear-gradient(135deg, #2d0a1a 0%, #831843 60%, ${pages[currentPage].accent} 100%)`,
        }}
      >
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-rose-300/80">
          <span>3D Page Flip Deck • Tap to Flip</span>
          <span>Page 0{currentPage + 1} / 0{pages.length}</span>
        </div>

        <div className="my-auto text-center flex flex-col items-center gap-3">
          <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {pages[currentPage].title}
          </h4>
          <p className="text-sm text-rose-100/80 max-w-xs font-mono leading-relaxed">
            {pages[currentPage].text}
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-rose-300/60 uppercase">
          <span>Click Anywhere → Next Card</span>
          <span className="animate-pulse">FLIP 3D</span>
        </div>
      </motion.div>
    </div>
  );
}

// ── Dot 3: Amber Orb (Ember) - Fading Image & Integrated Text Carousel ────────
function EmberFadingCarousel({ color = "#fbbf24" }) {
  const [activeStudy, setActiveStudy] = useState(0);

  const studies = [
    { title: "Molten Core 01", temp: "1450°C", desc: "Fire as a creative force — molten warmth radiating from deep amber gradients." },
    { title: "Gold Combustion 02", temp: "1820°C", desc: "Controlled golden heat blooming across dark high-contrast interface fields." },
    { title: "Ember Spark 03", temp: "1200°C", desc: "Radiant particles dissolving into seamless dark gradient masks." },
  ];

  return (
    <div className="relative w-full h-[340px] sm:h-[380px] rounded-xl border border-amber-500/30 overflow-hidden flex flex-col md:flex-row bg-[#0c0800]">
      {/* Left side: 65% image card fading out smoothly to the right */}
      <div className="relative w-full md:w-[65%] h-48 md:h-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStudy}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, #451a03 0%, #78350f 40%, #d97706 70%, #fbbf24 100%)`,
            }}
          />
        </AnimatePresence>

        {/* Gradient Mask fading out to black/dark on the right side */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0c0800]/60 to-[#0c0800]" />
      </div>

      {/* Right side: Integrated Text Specs */}
      <div className="relative w-full md:w-[35%] h-full p-6 flex flex-col justify-between z-10 border-t md:border-t-0 md:border-l border-amber-500/20">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/80 block mb-2">
            Ember Fading Spectrum
          </span>
          <h4 className="text-xl font-bold text-amber-200 mb-2">
            {studies[activeStudy].title}
          </h4>
          <p className="text-xs text-amber-300/70 font-mono leading-relaxed mb-4">
            {studies[activeStudy].desc}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="text-[10px] font-mono text-amber-500 uppercase">
            Thermal Index: <span className="text-amber-300 font-bold">{studies[activeStudy].temp}</span>
          </div>
          <div className="flex gap-2">
            {studies.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStudy(i)}
                className={cn(
                  "px-3 py-1 text-[10px] font-mono uppercase rounded border transition-all duration-300",
                  i === activeStudy
                    ? "border-amber-400 text-amber-200 bg-amber-500/20 shadow-[0_0_10px_#fbbf24]"
                    : "border-amber-900/60 text-amber-600 hover:text-amber-400"
                )}
              >
                0{i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Dot 4: Green Orb (Verdant) - 3D Isometric Stack & Expansion Grid ──────────
function VerdantStackCarousel({ color = "#34d399" }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const cards = [
    { title: "Canopy Growth 01", desc: "Resilience of nature building patience and defiance." },
    { title: "Verdant Structure 02", desc: "Emerald light structures unfolding in slow motion." },
    { title: "Emerald Radiance 03", desc: "Luminous forest undergrowth revealed on contact." },
  ];

  return (
    <div className="relative w-full h-[340px] sm:h-[380px] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md h-64 sm:h-72 flex items-center justify-center">
        {cards.map((card, i) => {
          const isFocused = i === activeIndex;
          const offset = i - activeIndex;

          return (
            <motion.div
              key={i}
              onClick={() => setActiveIndex(i)}
              className="absolute w-64 sm:w-80 h-44 sm:h-52 rounded-xl p-5 border border-emerald-500/40 cursor-pointer flex flex-col justify-between transition-all duration-500 overflow-hidden shadow-2xl"
              animate={{
                scale: isFocused ? 1 : 0.88 - Math.abs(offset) * 0.05,
                y: offset * 30,
                x: offset * 20,
                rotateZ: offset * -6,
                zIndex: isFocused ? 30 : 20 - Math.abs(offset),
                opacity: isFocused ? 1 : 0.6,
              }}
              style={{
                background: i === 0
                  ? "linear-gradient(135deg, #061f17, #059669, #34d399)"
                  : i === 1
                  ? "linear-gradient(135deg, #064e3b, #047857, #6ee7b7)"
                  : "linear-gradient(135deg, #022c22, #065f46, #a7f3d0)",
                boxShadow: isFocused ? `0 20px 40px rgba(0,0,0,0.8), 0 0 30px ${color}80` : "none",
              }}
            >
              <div className="flex items-center justify-between text-[9px] font-mono uppercase text-emerald-100/80">
                <span>3D Isometric Stack</span>
                <span>Layer 0{i + 1}</span>
              </div>

              <div className="my-auto">
                <h4 className="text-lg sm:text-xl font-bold text-white mb-1">
                  {card.title}
                </h4>
                <p className="text-xs text-emerald-100/70 font-mono">
                  {card.desc}
                </p>
              </div>

              <div className="text-[9px] font-mono text-emerald-200/60 uppercase">
                {isFocused ? "• Active Card Focus" : "Click to Bring to Front"}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Gallery Content ────────────────────────────────────────────────────
function GalleryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialOrb = parseInt(searchParams.get("orb"), 10);
  const [selectedOrb, setSelectedOrb] = useState(
    isNaN(initialOrb) || initialOrb < 0 || initialOrb > 4 ? 0 : initialOrb
  );
  const [cutsceneKey, setCutsceneKey] = useState(0);

  const item = GALLERY_ITEMS[selectedOrb];

  const handleDotClick = useCallback(
    (index) => {
      if (index === selectedOrb) return;
      setSelectedOrb(index);
      setCutsceneKey((k) => k + 1);
      router.replace(`/gallery?orb=${index}`, { scroll: false });
    },
    [selectedOrb, router]
  );

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden flex items-center justify-center">
      {/* Textured background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 transition-colors duration-1000"
          style={{
            background: `radial-gradient(ellipse 70% 60% at 55% 50%, ${item.color}08 0%, transparent 70%)`,
          }}
        />
        <div className="noise-overlay absolute inset-0 opacity-[0.045]" />
      </div>

      {/* Left: Dot Selector Menu */}
      <div className="fixed left-0 top-0 bottom-0 z-30 flex flex-col items-center justify-center gap-5 sm:gap-6 lg:gap-8 lg:pl-8 xl:pl-10 pl-3 sm:pl-4">
        {GALLERY_ITEMS.map((g, i) => {
          const isActive = i === selectedOrb;
          return (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className="relative group flex items-center justify-center"
              aria-label={`Select ${g.title}`}
              aria-current={isActive ? "true" : undefined}
            >
              <motion.div
                className="absolute rounded-full"
                animate={{
                  width: isActive ? 44 : 0,
                  height: isActive ? 44 : 0,
                  opacity: isActive ? 1 : 0,
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: `radial-gradient(circle, ${g.color}25 0%, transparent 70%)`,
                }}
              />
              <motion.div
                className="absolute rounded-full"
                animate={{
                  width: isActive ? 34 : 0,
                  height: isActive ? 34 : 0,
                  opacity: isActive ? 0.6 : 0,
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  border: `1.5px solid ${g.color}50`,
                  boxShadow: isActive
                    ? `0 0 15px ${g.color}40, inset 0 0 10px ${g.color}20`
                    : "none",
                }}
              />
              <motion.div
                className="relative rounded-full cursor-pointer z-10"
                animate={{
                  width: isActive ? 14 : 8,
                  height: isActive ? 14 : 8,
                  boxShadow: isActive
                    ? `0 0 18px ${g.color}80, 0 0 36px ${g.color}30`
                    : `0 0 6px ${g.color}40`,
                }}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: isActive
                    ? `radial-gradient(circle at 35% 35%, ${g.color}, ${g.colorDark})`
                    : g.colorDark,
                  opacity: isActive ? 1 : 0.5,
                }}
              />
            </button>
          );
        })}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-px opacity-[0.15]"
          style={{
            top: "calc(50% - 120px)",
            bottom: "calc(50% - 120px)",
            background: `linear-gradient(to bottom, transparent, ${item.color}50, transparent)`,
          }}
        />
      </div>

      {/* Center: Constrained Height Gallery Screen Box */}
      <div className="relative z-10 flex items-center justify-center w-full min-h-screen pl-14 sm:pl-16 lg:pl-20 pr-4 sm:pr-6 lg:pr-8 py-6 sm:py-8">
        <div className="relative w-full max-w-[94vw] xl:max-w-[92vw] max-h-[86vh] my-auto overflow-hidden">
          <motion.div
            key={`tv-${cutsceneKey}`}
            className="relative overflow-hidden rounded-xl border border-white/10"
            style={{
              boxShadow: `
                0 0 30px ${item.color}20,
                0 0 60px ${item.color}10,
                inset 0 0 30px ${item.color}05
              `,
            }}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Glowing border */}
            <div
              className="absolute inset-0 rounded-xl z-20 pointer-events-none transition-all duration-700"
              style={{
                border: `1px solid ${item.color}40`,
                boxShadow: `
                  0 0 15px ${item.color}25,
                  inset 0 0 15px ${item.color}08
                `,
              }}
            />

            {/* Corner accents */}
            {["top-left", "top-right", "bottom-left", "bottom-right"].map(
              (corner) => (
                <div
                  key={corner}
                  className={cn(
                    "absolute z-20 pointer-events-none transition-all duration-700",
                    corner === "top-left" && "top-0 left-0 w-8 h-8 border-t border-l",
                    corner === "top-right" && "top-0 right-0 w-8 h-8 border-t border-r",
                    corner === "bottom-left" && "bottom-0 left-0 w-8 h-8 border-b border-l",
                    corner === "bottom-right" && "bottom-0 right-0 w-8 h-8 border-b border-r"
                  )}
                  style={{
                    borderColor: `${item.color}60`,
                    boxShadow: `0 0 8px ${item.color}30`,
                  }}
                />
              )
            )}

            {/* Main Content Assembly Container */}
            <div className="relative z-5 bg-[#0a0a0a]/95 backdrop-blur-md p-4 sm:p-6 md:p-8">
              <AssemblyEntrance cutsceneKey={cutsceneKey}>
                {/* 1. Header Bar Assembly */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: -15 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.08]"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: item.color,
                      boxShadow: `0 0 8px ${item.color}`,
                    }}
                  />
                  <div className="flex-1 h-px bg-white/[0.06]" />
                  <span
                    className="text-[10px] font-mono uppercase tracking-[0.25em]"
                    style={{ color: `${item.color}90` }}
                  >
                    {item.title} — Interactive Monitor
                  </span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </motion.div>

                {/* 2. Title & Description Assembly */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  className="mb-4"
                >
                  <CinematicText
                    text={item.title}
                    color={item.color}
                    delay={0.2}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
                  />
                  <CinematicText
                    text={item.subtitle}
                    color={item.color}
                    delay={0.4}
                    className="block mt-1 text-xs sm:text-sm font-mono tracking-wide opacity-60"
                  />
                </motion.div>

                {/* 3. Main Carousel Assembly (Dot-Specific Component) */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.96 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  className="my-2"
                >
                  {selectedOrb === 0 && <PurpleStripeCarousel color={item.color} />}
                  {selectedOrb === 1 && <CyanVerticalCarousel color={item.color} />}
                  {selectedOrb === 2 && <RosePageFlipCarousel color={item.color} />}
                  {selectedOrb === 3 && <EmberFadingCarousel color={item.color} />}
                  {selectedOrb === 4 && <VerdantStackCarousel color={item.color} />}
                </motion.div>

                {/* 4. Footer Metadata Assembly */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between"
                >
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted">
                    Gallery — Monitor 0{selectedOrb + 1} / 0{GALLERY_ITEMS.length}
                  </span>
                  <div className="flex items-center gap-2">
                    {GALLERY_ITEMS.map((_, dotIdx) => (
                      <div
                        key={dotIdx}
                        className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
                        style={{
                          background:
                            dotIdx === selectedOrb ? item.color : `${item.color}30`,
                          boxShadow:
                            dotIdx === selectedOrb ? `0 0 6px ${item.color}` : "none",
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </AssemblyEntrance>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ── Page Wrapper ────────────────────────────────────────────────────────────
export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-muted text-sm font-mono animate-pulse">
            Loading gallery…
          </div>
        </div>
      }
    >
      <GalleryContent />
    </Suspense>
  );
}
