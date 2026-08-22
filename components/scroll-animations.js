"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollAnimations — drives the hero → about scroll transition.
 *
 * • Individual aurora orbs shrink + fade via a direct scroll listener.
 * • Hero content fades out on scroll.
 * • All `.scroll-reveal` elements get a rise-up + fade-in driven by
 *   GSAP ScrollTrigger (scrubbed to scroll progress).
 *
 * Thresholds are tuned so orbs and hero text are ~95% gone well before
 * the about section's solid background begins sliding over the hero.
 */
export default function ScrollAnimations() {
  const rafRef = useRef(null);

  useEffect(() => {
    // ── 1. Orb shrinking + hero fade via direct scroll listener ────
    const orbs = document.querySelectorAll(".aurora-orb");
    const heroContent = document.querySelector(".hero-content-wrapper");
    const scrollHint = document.querySelector(".hero-scroll-hint");
    const starsCanvas = document.querySelector("#stars");

    // The hero is 100vh, the spacer is 70vh. The about section starts
    // entering the viewport bottom after scrolling ~100vh (the hero height).
    // We want orbs at ~15% opacity at that point, hero text mostly gone,
    // so the page is very dark but not pitch black as the about slides in.
    const getThresholds = () => {
      const vh = window.innerHeight;
      return {
        orbStart: 0,
        orbEnd: vh * 1.18,     // orbs at ~15% when about enters (~100vh scroll)
        contentStart: 0,
        contentEnd: vh * 0.85,  // hero text mostly gone by ~85vh
        hintEnd: vh * 0.4,
        starsEnd: vh * 1.1,
      };
    };

    const updateScrollAnimations = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const t = getThresholds();

      // Individual orbs: each shrinks and fades, staggered slightly. We write
      // the scroll values into CSS custom properties instead of `opacity` /
      // `transform` directly so the class-based hover rules in globals.css
      // (`.is-hovered` / `.has-hovered-orb`) can still take precedence and
      // fade the non-hovered orbs into the background.
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

      // Stars canvas: fade out
      if (starsCanvas) {
        const starsProgress = clamp(
          (scrollY - t.orbStart) / (t.starsEnd - t.orbStart)
        );
        starsCanvas.style.opacity = 1 - starsProgress;
      }

      // Hero content: opacity 1 → 0, translateY 0 → -40px
      if (heroContent) {
        const contentProgress = clamp(
          (scrollY - t.contentStart) / (t.contentEnd - t.contentStart)
        );
        heroContent.style.opacity = 1 - contentProgress;
        heroContent.style.transform = `translateY(${-contentProgress * 40}px)`;
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
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              end: "top 40%",
              scrub: 1.5,
            },
          });
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
      if (heroContent) {
        heroContent.style.opacity = "";
        heroContent.style.transform = "";
      }
      if (scrollHint) scrollHint.style.opacity = "";
    };
  }, []);

  return null;
}

function clamp(value) {
  return Math.min(Math.max(value, 0), 1);
}
