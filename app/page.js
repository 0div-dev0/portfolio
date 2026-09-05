"use client";

import Hero from "@/components/hero";
import GallerySection from "@/components/gallery-section";
import ConstellationField from "@/components/constellation-field";

const OTHER_SECTIONS = [
  { id: "play", title: "Play", desc: "Interactive demos and playful experiments." },
  { id: "contact", title: "Contact", desc: "Get in touch — I'd love to hear from you." },
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* ── Permanent Background Animated Stripes (Defense Lines) ──
          Persistent background for all sections after Hero (About, Gallery, Play, Contact) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ConstellationField opacity={0.65} />
      </div>

      {/* ── Hero Section (Contains its own Stars + Aurora Orbs) ─────── */}
      <div className="relative z-10">
        <Hero className="min-h-screen" />
      </div>

      {/* ── About Section (Transparent background reveals animated stripes) ── */}
      <section
        id="about"
        className="relative z-10 min-h-svh flex flex-col items-center justify-center px-6 py-24 text-center bg-transparent scroll-reveal"
        style={{ scrollMarginTop: "5rem" }}
      >
        <h2 className="scroll-reveal scroll-reveal-title text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
          About
        </h2>

        <div className="scroll-reveal scroll-reveal-divider mt-8 h-px w-24 bg-gradient-to-r from-transparent via-foreground/40 to-transparent origin-center" />

        <p className="scroll-reveal scroll-reveal-text mt-8 max-w-lg text-lg leading-relaxed text-muted">
          Passionate software developer and creator exploring the intersections of full-stack engineering, interactive graphic design, and artificial intelligence.
        </p>
      </section>

      {/* ── Gallery Section ─────────────────────────────────────────── */}
      <div className="relative z-10 bg-transparent">
        <GallerySection />
      </div>

      {/* ── Remaining sections (Play & Contact) ────────────────────── */}
      <div className="relative z-10 bg-transparent">
        {OTHER_SECTIONS.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="relative flex min-h-svh flex-col items-center justify-center px-6 py-24 text-center bg-transparent scroll-reveal"
            style={{ scrollMarginTop: "5rem" }}
          >
            <h2 className="scroll-reveal text-4xl font-semibold tracking-tight sm:text-5xl">
              {section.title}
            </h2>
            <p className="scroll-reveal mt-4 max-w-md text-lg text-muted">
              {section.desc}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
