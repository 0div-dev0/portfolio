"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollAnimations — drives the hero → about scroll transition.
 *
 * The whole hero (orbs, stars, portrait, text, hint) now vanishes extremely
 * fast: everything is fully gone after just ~200px of scrolling, matching the
 * requested "disappear in 200 pixels" behavior. The hero is a normal 100svh
 * section (not sticky) so scrollY is 1:1 with pixels scrolled.
 *
 * Timeline (scroll-pixel values):
 *  • 0 → 200      : aurora orbs shrink + fade to 0
 *  • 0 → 200      : stars fade to 0
 *  • 0 → 200      : hero content (text + carousel) fades to 0
 *  • 0 → 180      : hero text block scrolls up + fades (hero-text-block)
 *  • 0 → 90       : scroll hint fades out
 */
export default function ScrollAnimations() {
  const rafRef = useRef(null);

  useEffect(() => {
    const orbs = document.querySelectorAll(".aurora-orb");
    const heroContent = document.querySelector(".hero-content-wrapper");
    const scrollHint = document.querySelector(".hero-scroll-hint");
    const starsCanvas = document.querySelector("#stars");
    const heroPortrait = document.querySelector(".hero-portrait");

    const getThresholds = () => {
      // Extremely fast exit: the entire hero is gone after ~200px.
      return {
        orbStart: 0,
        orbEnd: 200,
        starsEnd: 200,
        // Hero text + carousel fade out as soon as scrolling starts
        contentStart: 0,
        contentEnd: 200,
        // Scroll hint fades immediately
        hintEnd: 90,
      };
    };

    const updateScrollAnimations = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const t = getThresholds();

      // Orbs: shrink + fade, staggered per orb
      orbs.forEach((orb, i) => {
        const staggerOffset = i * 0.06;
        const orbProgress = clamp(
          (scrollY - t.orbStart) / (t.orbEnd - t.orbStart) - staggerOffset
        );
        const scale = 1 - orbProgress * 0.95;
        const opacity = 1 - orbProgress;
        orb.style.setProperty("--scroll-scale", scale);
        orb.style.setProperty("--scroll-fade", opacity);
      });

      // Stars: fade out with orbs
      if (starsCanvas) {
        const starsProgress = clamp(scrollY / t.starsEnd);
        starsCanvas.style.opacity = 1 - starsProgress;
      }

      // Portrait: fades in sync with orbs (slightly faster)
      if (heroPortrait) {
        const portraitProgress = clamp(scrollY / (t.orbEnd * 0.9));
        heroPortrait.style.opacity = 1 - portraitProgress;
      }

      // Hero content: stays opaque during text cycling, then fades at end
      if (heroContent) {
        const contentProgress = clamp(
          (scrollY - t.contentStart) / (t.contentEnd - t.contentStart)
        );
        heroContent.style.opacity = 1 - contentProgress;
      }

      // Scroll hint
      if (scrollHint) {
        scrollHint.style.opacity = 1 - clamp(scrollY / t.hintEnd);
      }
    };

    updateScrollAnimations();

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafRef.current = requestAnimationFrame(() => {
          updateScrollAnimations();
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── 2. Scroll-reveal elements via GSAP ScrollTrigger ───────────
    let gsapCtx = null;
    const setupTimeout = setTimeout(() => {
      gsapCtx = gsap.context(() => {
        const reveals = document.querySelectorAll(".scroll-reveal");
        reveals.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 50, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                end: "top 45%",
                scrub: 1.2,
              },
            }
          );
        });
      });

      ScrollTrigger.refresh();
    }, 150);

    // ── Cleanup ────────────────────────────────────────────────────
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(setupTimeout);
      if (gsapCtx) gsapCtx.revert();

      orbs.forEach((orb) => {
        orb.style.removeProperty("--scroll-scale");
        orb.style.removeProperty("--scroll-fade");
      });
      if (starsCanvas) starsCanvas.style.opacity = "";
      if (heroPortrait) heroPortrait.style.opacity = "";
      if (heroContent) {
        heroContent.style.opacity = "";
      }
      if (scrollHint) scrollHint.style.opacity = "";
    };
  }, []);

  return null;
}

function clamp(value) {
  return Math.min(Math.max(value, 0), 1);
}
