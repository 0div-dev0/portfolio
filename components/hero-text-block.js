"use client";

import { useEffect, useRef } from "react";

/**
 * HeroTextBlock — a single text block with scroll-scrubbed 3D rotation & fade.
 *
 * Text enters from below (+translateY, +rotateX) and exits upward
 * (-translateY, -rotateX), all driven directly by scroll position.
 * The text container is constrained to ~50-60% width of the container.
 *
 * Props:
 *  - heading, subtext: text content
 *  - relativeRange: [startFactor, endFactor] relative to hero scroll distance
 *  - isFirst: if true, starts fully visible at scroll=0 without entrance animation
 *  - isLast: if true, holds steady after entering until hero fade out
 */
import { Typewriter } from "./ui/typewriter-text";

/**
 * HeroTextBlock — a single text block with scroll-scrubbed 3D rotation & fade.
 *
 * Text enters from below (+translateY, +rotateX) and exits upward
 * (-translateY, -rotateX), all driven directly by scroll position.
 *
 * Props:
 *  - heading, subtext: text content
 *  - galleryBadge: JSX element to display at the bottom-left of heading
 *  - relativeRange: [startFactor, endFactor] relative to hero scroll distance
 *  - isFirst: if true, starts fully visible at scroll=0 without entrance animation
 *  - isLast: if true, holds steady after entering until hero fade out
 *  - useTypewriter: whether to render heading and subtext via Typewriter component
 */
export default function HeroTextBlock({
  heading,
  subtext,
  galleryBadge = null,
  relativeRange = [0, 0.4],
  isFirst = false,
  isLast = false,
  useTypewriter = true,
}) {
  const blockRef = useRef(null);

  useEffect(() => {
    const block = blockRef.current;
    if (!block) return;

    const update = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      // Fast exit distance — text disappears rapidly within 250px of scroll
      const exitDistancePx = 250;

      let opacity = 1;
      let translateY = 0;
      let rotateX = 0;

      if (isFirst) {
        if (scrollY <= 20) {
          opacity = 1;
          translateY = 0;
          rotateX = 0;
        } else if (scrollY < exitDistancePx) {
          const p = (scrollY - 20) / (exitDistancePx - 20);
          opacity = 1 - p;
          translateY = -90 * p; // Exits upward faster
          rotateX = -12 * p;    // Rotates upward faster
        } else {
          opacity = 0;
        }
      } else {
        const spacer = document.querySelector(".hero-scroll-spacer");
        const totalHeroScroll = spacer
          ? spacer.offsetHeight
          : window.innerHeight;
        const [rStart, rEnd] = relativeRange;
        const startPx = rStart * totalHeroScroll;
        const endPx = rEnd * totalHeroScroll;

        if (scrollY < startPx) {
          opacity = 0;
        } else if (scrollY < endPx) {
          const p = (scrollY - startPx) / (endPx - startPx);
          opacity = p;
          translateY = 60 * (1 - p);
          rotateX = 8 * (1 - p);
        } else {
          opacity = 1;
        }
      }

      block.style.opacity = opacity;
      block.style.transform = `perspective(1000px) rotateX(${rotateX}deg) translateY(${translateY}px)`;
      block.style.visibility = opacity > 0.005 ? "visible" : "hidden";
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [relativeRange, isFirst, isLast]);

  return (
    <div
      ref={blockRef}
      className="absolute inset-0 w-full h-full flex flex-col justify-center items-center text-center sm:items-start sm:text-left pointer-events-none z-10"
      style={{
        visibility: isFirst ? "visible" : "hidden",
        willChange: "opacity, transform",
      }}
    >
      <div className="w-full pointer-events-auto flex flex-col items-center sm:items-start">
        <h1
          className="text-balance text-3xl sm:text-5xl lg:text-6xl font-semibold leading-[1.15] tracking-tight text-foreground w-full max-w-3xl sm:max-w-4xl lg:max-w-5xl min-h-[2.4em] sm:min-h-[2.3em]"
          aria-label={typeof heading === "string" ? heading : undefined}
        >
          {useTypewriter && typeof heading === "string" ? (
            <Typewriter text={heading} maxDuration={1000} />
          ) : (
            heading
          )}
        </h1>

        {/* Gallery badge — positioned to the bottom-left of heading */}
        {galleryBadge && (
          <div className="mt-3 sm:mt-4 self-center sm:self-start">
            {galleryBadge}
          </div>
        )}

        <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg leading-relaxed text-muted max-w-md sm:max-w-lg lg:max-w-xl min-h-[4em]">
          {useTypewriter && typeof subtext === "string" ? (
            <Typewriter text={subtext} maxDuration={1000} />
          ) : (
            subtext
          )}
        </p>
      </div>
    </div>
  );
}



