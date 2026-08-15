import Aurora from "./aurora";

/**
 * Hero — the monochromatic landing section.
 *
 * Pure black & white design language: zinc palette, white type on near-black,
 * with the Aurora behind it that blooms into colour on hover.
 */
export default function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden bg-[#050505] font-sans text-white selection:bg-white selection:text-black">
      <Aurora />

      {/* Content */}
      <div className="pointer-events-none relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-28 text-center sm:items-start sm:px-12 sm:text-left lg:px-24">
        <p className="hero-reveal font-mono text-xs uppercase tracking-[0.35em] text-zinc-500">
          Portfolio <span className="text-zinc-600">—</span> 2026
        </p>

        <h1 className="hero-reveal hero-reveal-delay-1 mt-8 max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          Design in black &amp; white,
          <br />
          <span className="italic text-zinc-400">colour on contact.</span>
        </h1>

        <p className="hero-reveal hero-reveal-delay-2 mt-8 max-w-xl text-lg leading-8 text-zinc-400">
          A portfolio kept deliberately colourless. Move your cursor over the
          lights above and watch contrast, brightness and hue bloom back into
          the aurora.
        </p>

        <div className="hero-reveal hero-reveal-delay-3 mt-12 flex flex-col gap-4 sm:flex-row">
          <a
            href="#work"
            className="pointer-events-auto inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-black transition-all duration-300 hover:bg-zinc-200 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]"
          >
            View work
          </a>
          <a
            href="#contact"
            className="pointer-events-auto inline-flex h-12 items-center justify-center rounded-full border border-zinc-700 px-8 text-sm font-medium text-white transition-all duration-300 hover:border-white hover:bg-white/5"
          >
            Get in touch
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hero-reveal hero-reveal-delay-3 pointer-events-none relative z-10 flex flex-col items-center gap-3 pb-12 font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-600">
        <span className="scroll-line h-8 w-px" />
        Scroll
      </div>
    </section>
  );
}
