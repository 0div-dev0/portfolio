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
export default function HeroTextBlock({
  heading,
  subtext,
  relativeRange = [0, 1],
  isFirst = false,
  isLast = false,
}) {
  const blockRef = useRef(null);

  useEffect(() => {
    const block = blockRef.current;
    if (!block) return;

    const update = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const spacer = document.querySelector(".hero-scroll-spacer");
      const totalHeroScroll = spacer
        ? spacer.offsetHeight
        : window.innerHeight * 2.0;

      const [rStart, rEnd] = relativeRange;
      const startPx = rStart * totalHeroScroll;
      const endPx = rEnd * totalHeroScroll;
      const durationPx = endPx - startPx;

      let opacity = 0;
      let translateY = 0;
      let rotateX = 0;

      if (isFirst) {
        // Block 1:
        // Active at scroll=0. Holds opacity=1, Y=0, rotateX=0 until exit phase starts.
        const exitStartPx = startPx + durationPx * 0.5;
        const exitEndPx = endPx;

        if (scrollY <= exitStartPx) {
          opacity = 1;
          translateY = 0;
          rotateX = 0;
        } else if (scrollY < exitEndPx) {
          const p = (scrollY - exitStartPx) / (exitEndPx - exitStartPx);
          opacity = 1 - p;
          translateY = -60 * p; // Exits upward
          rotateX = -8 * p;     // Rotates upward
        } else {
          opacity = 0;
        }
      } else if (isLast) {
        // Block 3 (Last):
        // Enters from below in first half of range, then holds steady.
        const enterStartPx = startPx;
        const enterEndPx = startPx + durationPx * 0.5;

        if (scrollY < enterStartPx) {
          opacity = 0;
        } else if (scrollY < enterEndPx) {
          const p = (scrollY - enterStartPx) / (enterEndPx - enterStartPx);
          opacity = p;
          translateY = 60 * (1 - p); // Comes from below up
          rotateX = 8 * (1 - p);      // Rotates up into place
        } else {
          opacity = 1;
          translateY = 0;
          rotateX = 0;
        }
      } else {
        // Block 2 (Middle):
        // Enters in first ~35% of range, holds active in middle ~30%, exits in final ~35%.
        const enterStartPx = startPx;
        const enterEndPx = startPx + durationPx * 0.35;
        const exitStartPx = startPx + durationPx * 0.65;
        const exitEndPx = endPx;

        if (scrollY < enterStartPx) {
          opacity = 0;
        } else if (scrollY < enterEndPx) {
          const p = (scrollY - enterStartPx) / (enterEndPx - enterStartPx);
          opacity = p;
          translateY = 60 * (1 - p);
          rotateX = 8 * (1 - p);
        } else if (scrollY <= exitStartPx) {
          opacity = 1;
          translateY = 0;
          rotateX = 0;
        } else if (scrollY < exitEndPx) {
          const p = (scrollY - exitStartPx) / (exitEndPx - exitStartPx);
          opacity = 1 - p;
          translateY = -60 * p;
          rotateX = -8 * p;
        } else {
          opacity = 0;
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
      className="absolute inset-0 w-full h-full flex flex-col justify-center items-center text-center sm:items-start sm:text-left pointer-events-none"
      style={{
        visibility: isFirst ? "visible" : "hidden",
        willChange: "opacity, transform",
      }}
    >
      <div className="w-full pointer-events-auto flex flex-col items-center sm:items-start">
        <h1
          className="text-balance text-3xl sm:text-5xl lg:text-6xl font-semibold leading-[1.15] tracking-tight text-foreground w-full max-w-3xl sm:max-w-4xl lg:max-w-5xl"
          aria-label={heading}
        >
          {heading}
        </h1>

        <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg leading-relaxed text-muted max-w-md sm:max-w-lg lg:max-w-xl">
          {subtext}
        </p>
      </div>
    </div>
  );
}


