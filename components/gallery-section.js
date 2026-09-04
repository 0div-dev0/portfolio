"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Gallery Orb Colors & Topic Labels ───────────────────────────────────────
const GALLERY_ITEMS = [
  { id: "programming", label: "Programming", color: "#a78bfa", colorDark: "#6d28d9" }, // Dot 0: Purple
  { id: "academic", label: "Academic", color: "#22d3ee", colorDark: "#0891b2" },     // Dot 1: Cyan
  { id: "social-work", label: "Social Work", color: "#f472b6", colorDark: "#be185d" }, // Dot 2: Rose
  { id: "hobbies", label: "Hobbies", color: "#fbbf24", colorDark: "#d97706" },         // Dot 3: Amber
  { id: "extra-skills", label: "Extra skills", color: "#34d399", colorDark: "#059669" },// Dot 4: Green
];

// ── Slower, Tactile Resistance Scroll Hook ──────────────────────────────────
function useGalleryScroll(containerRef) {
  const [scrollPos, setScrollPos] = useState(0);
  const velocityRef = useRef(0);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updatePhysics = () => {
      if (Math.abs(velocityRef.current) > 0.01) {
        setScrollPos((prev) => prev + velocityRef.current);
        velocityRef.current *= 0.84; // Heavy gentle friction for smooth, slow control
        animFrameRef.current = requestAnimationFrame(updatePhysics);
      } else {
        velocityRef.current = 0;
      }
    };

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Much slower, controlled scroll input delta
      velocityRef.current += e.deltaY * 0.06;
      if (!animFrameRef.current || Math.abs(velocityRef.current) > 0.02) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = requestAnimationFrame(updatePhysics);
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [containerRef]);

  return scrollPos;
}

// ── Geometric Visual Graphic Card ───────────────────────────────────────────
function VisualGraphicCard({ index, label, subtitle }) {
  return (
    <div className="absolute inset-0 p-3.5 flex flex-col justify-between overflow-hidden bg-[#0d0f14]/90 backdrop-blur-md rounded-xl border border-white/10 select-none">
      <svg
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="50%" cy="50%" r="35%" stroke="currentColor" strokeWidth="0.5" fill="none" />
      </svg>
      <div className="relative z-10 flex justify-between items-center text-[9px] font-mono text-zinc-400 tracking-widest uppercase">
        <span>0{index + 1}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
      </div>
      {(label || subtitle) && (
        <div className="relative z-10">
          {label && <p className="text-xs font-semibold font-mono text-white tracking-wide truncate">{label}</p>}
          {subtitle && <p className="text-[10px] font-mono text-zinc-400 mt-0.5 truncate">{subtitle}</p>}
        </div>
      )}
    </div>
  );
}

// ── Open, Slick 3D Scroll-Replacing Description Component (NO BOX, NO BORDER) ─
function CleanReplacingText({ activeStep, items, color }) {
  const activeItem = items[activeStep % items.length];

  return (
    <div className="relative h-9 flex items-center justify-center overflow-hidden preserve-3d pointer-events-none mt-1">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 10, rotateX: -20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -10, rotateX: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-center px-4"
        >
          <p className="text-xs sm:text-sm font-mono text-zinc-300 tracking-wide">
            {activeItem ? `${activeItem.title} — ${activeItem.desc || activeItem.subtitle || activeItem.impact}` : ""}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── 0. Programming Screen — Dead Center Title & Description, Continuous Stripes + Faint Middle Ticker ──
function ProgrammingScreen({ color = "#a78bfa", scrollPos = 0 }) {
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const cards = [
    { title: "React & Next.js", desc: "Fullstack Architecture" },
    { title: "TypeScript", desc: "Type-Safe Systems" },
    { title: "WebGL & Three.js", desc: "Interactive 3D" },
    { title: "Node.js & APIs", desc: "High-Perf Backends" },
    { title: "Tailwind CSS", desc: "Design Systems" },
    { title: "Python & AI", desc: "Machine Learning" },
  ];

  const CARD_WIDTH = 200;
  const GAP = 16;
  const LOOP_WIDTH = cards.length * (CARD_WIDTH + GAP);

  const topOffset = ((scrollPos * 0.3) % LOOP_WIDTH + LOOP_WIDTH) % LOOP_WIDTH;
  const midOffset = ((-scrollPos * 0.22) % LOOP_WIDTH + LOOP_WIDTH) % LOOP_WIDTH;
  const bottomOffset = ((-scrollPos * 0.3) % LOOP_WIDTH + LOOP_WIDTH) % LOOP_WIDTH;

  const activeStep = Math.floor((Math.abs(scrollPos) % (cards.length * 300)) / 300);

  return (
    <div className="relative w-full max-w-full h-[380px] sm:h-[420px] md:h-[450px] flex flex-col justify-between overflow-hidden select-none py-2 px-1">
      {/* ── DEAD CENTER TITLE & DESCRIPTION OVERLAY (OPEN TEXT ONLY, NO BOX, NO BORDER) ── */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center pointer-events-none px-4">
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-mono tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
          PROGRAMMING
        </h3>
        <CleanReplacingText activeStep={activeStep} items={cards} color={color} />
      </div>

      {/* Top Stripe */}
      <div className="relative w-full max-w-full overflow-hidden py-1 z-10">
        <div
          className="flex gap-4 w-max transition-transform duration-75 ease-out"
          style={{ transform: `translateX(${-topOffset}px)` }}
        >
          {Array.from({ length: cards.length * 4 }).map((_, idx) => {
            const cardKey = `top-${idx}`;
            const item = cards[idx % cards.length];
            const isHovered = hoveredCardId === cardKey;
            return (
              <div
                key={cardKey}
                onMouseEnter={() => setHoveredCardId(cardKey)}
                onMouseLeave={() => setHoveredCardId(null)}
                className="relative cursor-pointer transition-all duration-300 ease-out flex-shrink-0"
                style={{
                  width: `${CARD_WIDTH}px`,
                  transform: isHovered ? "translateY(8px) scale(1.06)" : "translateY(0) scale(1)",
                  zIndex: isHovered ? 50 : 1,
                }}
              >
                <div
                  className="w-full h-22 sm:h-26 rounded-xl bg-[#0f0f13] border border-white/10 relative overflow-hidden transition-all duration-300"
                  style={{
                    borderColor: isHovered ? color : "rgba(255,255,255,0.1)",
                  }}
                >
                  <VisualGraphicCard index={idx % 6} label={item.title} subtitle={item.desc} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Middle Faint Continuous Ticker (Pure Background Show behind Title) */}
      <div className="relative w-full max-w-full py-1 overflow-hidden flex items-center justify-center z-10 opacity-15 pointer-events-none">
        <div
          className="flex gap-4 w-max transition-transform duration-75 ease-out"
          style={{ transform: `translateX(${-midOffset}px)` }}
        >
          {Array.from({ length: cards.length * 4 }).map((_, i) => (
            <div key={i} className="w-40 h-14 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-[10px] font-mono text-zinc-400 flex-shrink-0">
              CORE SYSTEM 0{(i % cards.length) + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Stripe */}
      <div className="relative w-full max-w-full overflow-hidden py-1 z-10">
        <div
          className="flex gap-4 w-max transition-transform duration-75 ease-out"
          style={{ transform: `translateX(${-bottomOffset}px)` }}
        >
          {Array.from({ length: cards.length * 4 }).map((_, idx) => {
            const cardKey = `bot-${idx}`;
            const item = cards[(idx + 3) % cards.length];
            const isHovered = hoveredCardId === cardKey;
            return (
              <div
                key={cardKey}
                onMouseEnter={() => setHoveredCardId(cardKey)}
                onMouseLeave={() => setHoveredCardId(null)}
                className="relative cursor-pointer transition-all duration-300 ease-out flex-shrink-0"
                style={{
                  width: `${CARD_WIDTH}px`,
                  transform: isHovered ? "translateY(-8px) scale(1.06)" : "translateY(0) scale(1)",
                  zIndex: isHovered ? 50 : 1,
                }}
              >
                <div
                  className="w-full h-22 sm:h-26 rounded-xl bg-[#0f0f13] border border-white/10 relative overflow-hidden transition-all duration-300"
                  style={{
                    borderColor: isHovered ? color : "rgba(255,255,255,0.1)",
                  }}
                >
                  <VisualGraphicCard index={(idx + 3) % 6} label={item.title} subtitle={item.desc} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── 1. Academic Screen — Larger Columns + Open Centered Text (NO BOX, NO BORDER) ──
function AcademicScreen({ color = "#22d3ee", scrollPos = 0 }) {
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const items = [
    { title: "Computer Science", desc: "Data Structures & Algorithms" },
    { title: "Mathematics", desc: "Linear Algebra & Calculus" },
    { title: "AI & ML", desc: "Neural Networks & Deep Learning" },
    { title: "Software Eng", desc: "System Architecture" },
    { title: "Research", desc: "Peer-Reviewed Publications" },
  ];

  const CARD_SIZE = 135;
  const GAP = 14;
  const ITEM_HEIGHT = CARD_SIZE + GAP;
  const CARD_COUNT = items.length;
  const LOOP_HEIGHT = CARD_COUNT * ITEM_HEIGHT;

  const col1Offset = ((scrollPos * 0.3) % LOOP_HEIGHT + LOOP_HEIGHT) % LOOP_HEIGHT;
  const col3Offset = ((-scrollPos * 0.3) % LOOP_HEIGHT + LOOP_HEIGHT) % LOOP_HEIGHT;

  const activeStep = Math.floor((Math.abs(scrollPos) % (items.length * 300)) / 300);

  const renderColumn = (colId, offset) => (
    <div className="relative flex flex-col items-center overflow-hidden h-full z-10 w-32 sm:w-36">
      <div
        className="flex flex-col transition-transform duration-75 ease-out gap-3"
        style={{ transform: `translateY(${-offset}px)` }}
      >
        {Array.from({ length: CARD_COUNT * 4 }).map((_, idx) => {
          const cardIdx = idx % CARD_COUNT;
          const cardKey = `${colId}-${idx}`;
          const isHovered = hoveredCardId === cardKey;
          const cardItem = items[cardIdx];
          return (
            <div
              key={cardKey}
              onMouseEnter={() => setHoveredCardId(cardKey)}
              onMouseLeave={() => setHoveredCardId(null)}
              className="flex-shrink-0 w-32 h-32 sm:w-36 sm:h-36 rounded-xl bg-[#0d1215] border border-white/10 relative overflow-hidden transition-all duration-300 cursor-pointer"
              style={{
                borderColor: isHovered ? color : "rgba(255,255,255,0.1)",
                transform: isHovered ? "scale(1.08)" : "scale(1)",
                zIndex: isHovered ? 50 : 1,
              }}
            >
              <VisualGraphicCard index={cardIdx} label={cardItem.title} subtitle={cardItem.desc} />
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="relative w-full max-w-full h-[380px] sm:h-[420px] md:h-[450px] flex items-stretch gap-4 overflow-hidden select-none py-3 px-1">
      {renderColumn("c1", col1Offset)}

      {/* Center Section: OPEN TEXT ONLY (NO BACKGROUND BOX, NO BORDER) */}
      <div className="relative flex-1 flex flex-col items-center justify-center text-center p-4">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono tracking-tight text-white mb-2">
          ACADEMIC
        </h3>
        <CleanReplacingText activeStep={activeStep} items={items} color={color} />
      </div>

      {renderColumn("c3", col3Offset)}
    </div>
  );
}

// ── 2. Social Work Screen — Progressively Flipping 3D Card (Continuous 1:1 Scroll) ──
function SocialWorkScreen({ color = "#f472b6", scrollPos = 0 }) {
  const projects = [
    { title: "Community Tech Education", desc: "Teaching coding & computer literacy to underrepresented youth.", impact: "500+ Students Taught" },
    { title: "Open Source Accessibility", desc: "Building assistive tech tools for visually impaired developers.", impact: "10k+ Downloads" },
    { title: "Digital Literacy Workshops", desc: "Empowering seniors with online safety & digital connection tools.", impact: "20+ Workshops" },
    { title: "Environmental Tech Trackers", desc: "Developing open-hardware sensors for community air monitoring.", impact: "Local Eco Trackers" },
  ];

  // Continuous progressive Y rotation based on scrollPos (1:1 smooth tactile control)
  const rotateY = scrollPos * 0.45;
  const normalizedRotation = Math.abs(rotateY) % (projects.length * 180);
  const activeIndex = Math.floor(normalizedRotation / 180);
  const currentProject = projects[activeIndex % projects.length];

  return (
    <div className="relative w-full max-w-full h-[380px] sm:h-[420px] md:h-[450px] flex flex-col items-center justify-between select-none py-4 px-2">
      {/* Clean Open Title — NO BOX, NO BORDER */}
      <div className="text-center z-20 pointer-events-none">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono tracking-tight text-white">
          SOCIAL WORK
        </h3>
        <p className="text-xs sm:text-sm font-mono text-zinc-300 mt-1 transition-all duration-200">
          {currentProject.title} — {currentProject.impact}
        </p>
      </div>

      {/* Progressively Flipping 3D Card Container */}
      <div className="relative w-full max-w-md h-56 sm:h-64 perspective-1000 my-auto cursor-pointer">
        <div
          className="relative w-full h-full preserve-3d transition-transform duration-75 ease-out"
          style={{ transform: `rotateY(${rotateY}deg)` }}
        >
          {/* Front Face */}
          <div className="absolute inset-0 backface-hidden rounded-2xl bg-[#140c12] border border-white/15 p-6 flex flex-col justify-between shadow-2xl">
            <VisualGraphicCard
              index={activeIndex % projects.length}
              label={currentProject.title}
              subtitle={currentProject.impact}
            />
          </div>

          {/* Back Face */}
          <div
            className="absolute inset-0 backface-hidden rounded-2xl bg-[#180e16] border border-white/15 p-6 flex flex-col justify-between shadow-2xl"
            style={{ transform: "rotateY(180deg)" }}
          >
            <div className="flex justify-between items-center text-[10px] font-mono text-rose-400 uppercase tracking-widest">
              <span>Initiative 0{(activeIndex % projects.length) + 1}</span>
              <span className="w-2 h-2 rounded-full bg-rose-400" />
            </div>
            <div className="space-y-2 my-auto text-left">
              <h4 className="text-base font-bold font-mono text-white">{currentProject.title}</h4>
              <p className="text-xs font-mono text-zinc-300 leading-relaxed">{currentProject.desc}</p>
            </div>
            <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-400">Impact Metric:</span>
              <span className="font-bold text-rose-400">{currentProject.impact}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Open Description Text Below — NO BOX, NO BORDER */}
      <div className="text-center font-mono text-xs text-zinc-400 pointer-events-none">
        {currentProject.desc}
      </div>
    </div>
  );
}

// ── 3. Hobbies Screen — Split Panel + Open Title & Description (NO BOX, NO BORDER) ──
function HobbiesScreen({ color = "#fbbf24", scrollPos = 0 }) {
  const hobbies = [
    { title: "Generative Art & Shaders", desc: "Algorithmic visual animations & GLSL shader experiments.", tag: "CREATIVE CODING" },
    { title: "Sound Design & Synths", desc: "Ambient soundscapes and modular synth patches.", tag: "AUDIO & MUSIC" },
    { title: "Macro & Astrophotography", desc: "Long-exposure night photography and urban landscapes.", tag: "VISUAL MEDIA" },
    { title: "Game Physics Engines", desc: "Building retro 2D physics engines & indie game mechanics.", tag: "GAME DEV" },
  ];

  const activeStep = Math.floor((Math.abs(scrollPos) % (hobbies.length * 350)) / 350);
  const currentHobby = hobbies[activeStep % hobbies.length];

  return (
    <div className="relative w-full max-w-full h-[380px] sm:h-[420px] md:h-[450px] flex flex-col items-center justify-between select-none py-4 px-2">
      {/* Clean Open Title — NO BOX, NO BORDER */}
      <div className="text-center">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono tracking-tight text-white">
          HOBBIES
        </h3>
        <CleanReplacingText activeStep={activeStep} items={hobbies} color={color} />
      </div>

      <div className="relative w-full max-w-3xl h-56 sm:h-64 rounded-xl border border-white/15 overflow-hidden flex flex-col md:flex-row bg-[#0e0d0a] my-auto">
        {/* Visual Graphic Panel */}
        <div className="relative w-full md:w-[60%] h-36 md:h-full bg-[#14120c] border-b md:border-b-0 md:border-r border-white/10 overflow-hidden p-4 flex flex-col justify-between">
          <VisualGraphicCard
            index={activeStep % hobbies.length}
            label={currentHobby.title}
            subtitle={currentHobby.tag}
          />
        </div>

        {/* Details Panel — OPEN TEXT, NO SEPARATE CONTAINER BOX WITH BORDERS */}
        <div className="relative w-full md:w-[40%] h-full p-5 flex flex-col justify-center space-y-2 z-10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">{currentHobby.tag}</span>
          <h4 className="text-base font-bold font-mono text-white">{currentHobby.title}</h4>
          <p className="text-xs font-mono text-zinc-300 leading-relaxed">{currentHobby.desc}</p>
        </div>
      </div>
    </div>
  );
}

// ── 4. Extra Skills Screen — 3D Isometric Stack + Open Title & Description ────
function ExtraSkillsScreen({ color = "#34d399", scrollPos = 0 }) {
  const skills = [
    { title: "UI/UX & Prototyping", desc: "Figma design systems, micro-interactions & accessibility." },
    { title: "DevOps & Cloud", desc: "Docker, Kubernetes, AWS & CI/CD deployment pipelines." },
    { title: "Security & Auditing", desc: "Web vulnerability assessment, OAuth 2.0 & encryption." },
    { title: "Performance Tuning", desc: "Lighthouse 100/100, bundle optimization & SSR." },
  ];

  const activeStep = Math.floor((Math.abs(scrollPos) % (skills.length * 350)) / 350);
  const currentSkill = skills[activeStep % skills.length];

  return (
    <div className="relative w-full max-w-full h-[380px] sm:h-[420px] md:h-[450px] flex flex-col items-center justify-between select-none py-4 px-2">
      {/* Clean Open Title — NO BOX, NO BORDER */}
      <div className="text-center">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono tracking-tight text-white">
          EXTRA SKILLS
        </h3>
        <CleanReplacingText activeStep={activeStep} items={skills} color={color} />
      </div>

      <div className="relative w-full max-w-3xl flex flex-col md:flex-row items-center justify-center gap-6 my-auto px-2">
        {/* Isometric Card Stack */}
        <div className="relative w-full md:w-1/2 h-52 sm:h-60 flex items-center justify-center">
          {skills.map((skill, i) => {
            const isFocused = i === (activeStep % skills.length);
            const offset = i - (activeStep % skills.length);

            return (
              <motion.div
                key={i}
                className="absolute w-56 sm:w-60 h-32 sm:h-36 rounded-xl p-3 border border-white/15 bg-[#0a120e] overflow-hidden shadow-2xl cursor-pointer"
                animate={{
                  scale: isFocused ? 1 : 0.88 - Math.abs(offset) * 0.05,
                  y: offset * 20,
                  x: offset * 12,
                  rotateZ: offset * -4,
                  zIndex: isFocused ? 30 : 20 - Math.abs(offset),
                  opacity: isFocused ? 1 : 0.4,
                }}
                style={{
                  borderColor: isFocused ? color : "rgba(255,255,255,0.1)",
                }}
              >
                <VisualGraphicCard index={i} label={skill.title} />
              </motion.div>
            );
          })}
        </div>

        {/* Info Text — OPEN TEXT ONLY (NO SEPARATE CONTAINER BOX WITH BORDER) */}
        <div className="relative w-full md:w-1/2 p-4 flex flex-col justify-center space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">Specialization 0{(activeStep % skills.length) + 1}</span>
          <h4 className="text-base font-bold font-mono text-white">{currentSkill.title}</h4>
          <p className="text-xs font-mono text-zinc-300 leading-relaxed">{currentSkill.desc}</p>
        </div>
      </div>
    </div>
  );
}

// ── Main Gallery Section Component ──────────────────────────────────────────
export default function GallerySection() {
  const [selectedOrb, setSelectedOrb] = useState(0);
  const screenBoxRef = useRef(null);
  const scrollPos = useGalleryScroll(screenBoxRef);
  const currentItem = GALLERY_ITEMS[selectedOrb];

  const handleSelectorClick = (index) => {
    setSelectedOrb(index);
  };

  return (
    <section id="gallery" className="relative w-full min-h-screen bg-[#08080a] text-foreground overflow-hidden py-16 px-4 sm:px-6 lg:px-10 flex flex-col items-center justify-center scroll-reveal">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 transition-colors duration-1000"
          style={{
            background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${currentItem.color}08 0%, transparent 70%)`,
          }}
        />
        <div className="noise-overlay absolute inset-0 opacity-[0.03]" />
      </div>

      {/* Main Section Layout */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center gap-8 lg:gap-10">
        {/* Left Side: Enlarged Category Selector with Labels */}
        <div className="w-full lg:w-60 flex lg:flex-col items-center lg:items-start justify-center gap-3 lg:gap-5 py-2 px-2 border-b lg:border-b-0 lg:border-r border-white/10">
          {GALLERY_ITEMS.map((g, i) => {
            const isActive = i === selectedOrb;
            return (
              <button
                key={g.id}
                onClick={() => handleSelectorClick(i)}
                className="group flex items-center gap-3 py-2 px-3 rounded-xl transition-all duration-300 text-left cursor-pointer w-full"
                style={{
                  backgroundColor: isActive ? `${g.color}15` : "transparent",
                  border: isActive ? `1px solid ${g.color}40` : "1px solid transparent",
                }}
              >
                {/* Dot Indicator */}
                <div className="relative flex items-center justify-center w-6 h-6 flex-shrink-0">
                  {isActive && (
                    <motion.div
                      layoutId="activeDotRing"
                      className="absolute inset-0 rounded-full"
                      style={{
                        boxShadow: `0 0 12px ${g.color}`,
                        backgroundColor: `${g.color}30`,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  <div
                    className="w-3 h-3 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: isActive ? g.color : `${g.color}50`,
                      scale: isActive ? 1.25 : 1,
                    }}
                  />
                </div>

                {/* Category Label */}
                <span
                  className="text-xs sm:text-sm font-mono font-semibold tracking-wide transition-colors duration-300 whitespace-nowrap"
                  style={{
                    color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.45)",
                  }}
                >
                  {g.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Center/Right: Screen Display Container */}
        <div className="flex-1 w-full max-w-full relative overflow-hidden" ref={screenBoxRef}>
          <motion.div
            key={selectedOrb}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-2xl bg-zinc-950/85 backdrop-blur-xl border border-white/15 p-4 sm:p-5 shadow-2xl max-w-full"
            style={{
              borderColor: `${currentItem.color}30`,
              boxShadow: `0 20px 50px rgba(0,0,0,0.9), 0 0 25px ${currentItem.color}15`,
            }}
          >
            {/* Screen Content Render */}
            {selectedOrb === 0 && <ProgrammingScreen color={currentItem.color} scrollPos={scrollPos} />}
            {selectedOrb === 1 && <AcademicScreen color={currentItem.color} scrollPos={scrollPos} />}
            {selectedOrb === 2 && <SocialWorkScreen color={currentItem.color} scrollPos={scrollPos} />}
            {selectedOrb === 3 && <HobbiesScreen color={currentItem.color} scrollPos={scrollPos} />}
            {selectedOrb === 4 && <ExtraSkillsScreen color={currentItem.color} scrollPos={scrollPos} />}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
