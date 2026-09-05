"use client";

import { useRef } from "react";
import { FaArrowLeft, FaArrowRight, FaExternalLinkAlt } from "react-icons/fa";

/**
 * ProjectsCarousel — a recent-projects carousel rendered inside a labelled
 * outline box.
 *
 * The box is a thick outlined container with a "PROJECTS" tag sitting on the
 * top border. Inside, cards scroll horizontally (scroll-snap + arrow buttons).
 * The first cards live-embed iframes of recent projects; the rest are styled
 * placeholder items. Each iframe card keeps a persistent overlay (gradient +
 * title + "open live site") so the card still looks intentional even if the
 * target site forbids embedding (X-Frame-Options / CSP), and always offers a
 * real link out to the project.
 */

const PROJECTS = [
  {
    title: "Reppel",
    url: "https://reppel.netlify.app",
    tag: "Live site",
  },
  {
    title: "Storify Journal",
    url: "https://storifyjournal.ercel.app",
    tag: "Live site",
  },
];

const PLACEHOLDER_PROJECTS = [
  { title: "Imminent Project", tag: "Coming soon", accent: "#a78bfa" },
  { title: "Side Quest", tag: "Coming soon", accent: "#22d3ee" },
  { title: "Late Night Build", tag: "Coming soon", accent: "#fbbf24" },
];

export default function ProjectsCarousel({ className = "" }) {
  const trackRef = useRef(null);

  // Cards are duplicated (2×) so scrolling has a seam-free infinite loop:
  // advancing past the last card wraps back to the first, going backwards
  // from the first wraps to the last.
  const ALL_ITEMS = [...PROJECTS, ...PLACEHOLDER_PROJECTS];
  const DATA = [...ALL_ITEMS, ...ALL_ITEMS];

  const scrollByCard = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-project-card]");
    const step = card ? card.offsetWidth + 12 : 400;
    const wrap = ALL_ITEMS.length * step;
    const maxScroll = el.scrollWidth - el.clientWidth;
    let to = el.scrollLeft + direction * step;
    if (direction > 0 && el.scrollLeft >= wrap - step / 2) to = 0;
    if (direction < 0 && el.scrollLeft < step / 2) to = wrap - step;
    to = Math.max(0, Math.min(maxScroll, to));
    el.scrollTo({ left: to, behavior: "smooth" });
  };

  return (
    <div
      className={`projects-box pointer-events-auto relative w-full max-w-[17.5rem] sm:max-w-[22rem] ${className}`}
    >
      {/* Thick outlined border with the label sitting on the top edge */}
      <div className="relative rounded-2xl border-[3px] border-foreground/25 outline outline-[3px] outline-offset-[-9px] outline-foreground/10 bg-background/30 backdrop-blur-sm shadow-[0_0_40px_rgba(0,0,0,0.35)]">
        <span className="absolute -top-[15px] left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-2 rounded-full border border-foreground/25 bg-background px-4 py-1 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-foreground/80">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground/60" />
          Projects
        </span>

        {/* Carousel track */}
        <div className="flex items-stretch gap-3 p-3 sm:p-4">
          <div
            ref={trackRef}
            className="flex flex-1 snap-x snap-proximity gap-3 overflow-x-auto overflow-y-hidden no-scrollbar scroll-smooth pb-1"
          >
            {DATA.map((project, i) => (
              project.url ? (
                <ProjectCard
                  key={i}
                  project={project}
                />
              ) : (
                <PlaceholderCard
                  key={i}
                  project={project}
                />
              )
            ))}
          </div>
        </div>

        {/* Arrow controls */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          <CarouselArrow direction="left" onClick={() => scrollByCard(-1)} />
          <CarouselArrow direction="right" onClick={() => scrollByCard(1)} />
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <article
      data-project-card
      className="group relative min-w-[252px] w-64 sm:min-w-[316px] sm:w-80 snap-start shrink-0 overflow-hidden rounded-xl border border-foreground/15 bg-background"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <iframe
          src={project.url}
          title={project.title}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {/* Persistent overlay — keeps cards legible even when the embedded
            site refuses to load in an iframe, and links out to the live site */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2 rounded-lg bg-background/80 px-3 py-2 backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-0.5"
        >
          <span className="text-sm font-medium text-foreground">
            {project.title}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-foreground/60">
            {project.tag} <FaExternalLinkAlt className="h-2.5 w-2.5" />
          </span>
        </a>
      </div>
    </article>
  );
}

function PlaceholderCard({ project }) {
  return (
    <article
      data-project-card
      className="group relative min-w-[252px] w-64 sm:min-w-[316px] sm:w-80 snap-start shrink-0 overflow-hidden rounded-xl border border-foreground/15 bg-background"
    >
      <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-60"
          style={{
            background: `radial-gradient(120% 120% at 50% 0%, ${project.accent}, transparent 70%)`,
          }}
        />
        <div className="relative flex flex-col items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/50">
            {project.tag}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-foreground">
            {project.title}
          </span>
        </div>
      </div>
    </article>
  );
}

function CarouselArrow({ direction, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Previous projects" : "Next projects"}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/25 bg-background/70 text-foreground/70 backdrop-blur-md transition-all duration-200 hover:border-foreground/50 hover:text-foreground hover:shadow-[0_0_16px_rgba(255,255,255,0.15)]"
    >
      {direction === "left" ? (
        <FaArrowLeft className="h-3 w-3" />
      ) : (
        <FaArrowRight className="h-3 w-3" />
      )}
    </button>
  );
}