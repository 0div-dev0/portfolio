import Hero from "@/components/hero";

const REMAINING_SECTIONS = [
  { id: "gallery", title: "Gallery", desc: "A collection of my projects and experiments." },
  { id: "play", title: "Play", desc: "Interactive demos and playful experiments." },
  { id: "contact", title: "Contact", desc: "Get in touch — I'd love to hear from you." },
];

export default function Home() {
  return (
    <>
      {/* ── Hero + About scroll-overlay container ────────────────────── */}
      <div className="relative">
        {/* Hero — sticks at viewport top while user scrolls */}
        <div className="sticky top-0 z-10 h-screen">
          <Hero className="h-full" />
        </div>

        {/* Transparent spacer — provides scroll distance for hero exit animation */}
        <div className="hero-scroll-spacer h-[80vh] relative z-20" />

        {/* About section — slides OVER the hero with a solid background.
            Z-index 20 sits above the sticky hero (z-10). */}
        <section
          id="about"
          className="relative z-20 bg-[#080808] min-h-svh flex flex-col items-center justify-center px-6 py-24 text-center"
          style={{ scrollMarginTop: "5rem" }}
        >
          <h2 className="scroll-reveal scroll-reveal-title text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            About
          </h2>

          <div className="scroll-reveal scroll-reveal-divider mt-8 h-px w-24 bg-gradient-to-r from-transparent via-muted to-transparent origin-center" />

          <p className="scroll-reveal scroll-reveal-text mt-8 max-w-lg text-lg leading-relaxed text-muted">
            Learn more about me and my work.
          </p>
        </section>
      </div>

      {/* ── Remaining sections ──────────────────────────────────────── */}
      {REMAINING_SECTIONS.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="relative flex min-h-svh flex-col items-center justify-center px-6 py-24 text-center"
          style={{ backgroundColor: "#080808", scrollMarginTop: "5rem" }}
        >
          <h2 className="scroll-reveal text-4xl font-semibold tracking-tight sm:text-5xl">
            {section.title}
          </h2>
          <p className="scroll-reveal mt-4 max-w-md text-lg text-muted">
            {section.desc}
          </p>
        </section>
      ))}
    </>
  );
}
