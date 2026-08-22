"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollAnimations — drives the hero → about scroll transition.
 *
 * Layout: Hero (100vh sticky) + Spacer (200vh) + About (100vh).
 * About section enters viewport when scrollY ≈ 200vh.
 *
 * Timeline (scroll-pixel values):
 *  • 0 → vh*2.5 : aurora orbs shrink + fade (to ~20% at about entry)
 *  • 0 → vh*2.2 : stars fade gradually
 *  • 0 → vh*2.0 : hero content stays opaque (text blocks animate themselves)
 *  • vh*2.0 → vh*2.5 : hero content fades to 0
 *  • vh*2.0 : about section enters viewport bottom (hero ~80% faded)
 *  • 0 → vh*0.4 : scroll hint fades out
 */
export default function ScrollAnimations() {
  const rafRef = useRef(null);

  useEffect(() => {
    const orbs = document.querySelectorAll(".aurora-orb");
    const heroContent = document.querySelector(".hero-content-wrapper");
    const scrollHint = document.querySelector(".hero-scroll-hint");
    const starsCanvas = document.querySelector("#stars");

    const getThresholds = () => {
      const vh = window.innerHeight;
      return {
        // Orbs fade gradually — ~20% when about enters (scroll ≈ 200vh)
        // At scroll 200vh with orbEnd=250vh: opacity = 1 - 200/250 = 0.2
        orbStart: 0,
        orbEnd: vh * 2.5,
        // Stars fade slightly faster
        starsEnd: vh * 2.2,
        // Hero content stays opaque during text cycling, then fades at end
        // About enters at scroll 200vh; hero fades 200vh → 250vh
        contentStart: vh * 2.0,
        contentEnd: vh * 2.5,
        // Scroll hint
        hintEnd: vh * 0.4,
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

      // Stars: fade out
      if (starsCanvas) {
        const starsProgress = clamp(
          (scrollY - t.orbStart) / (t.starsEnd - t.orbStart)
        );
        starsCanvas.style.opacity = 1 - starsProgress;
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
      }
      if (scrollHint) scrollHint.style.opacity = "";
    };
  }, []);

  return null;
}

function clamp(value) {
  return Math.min(Math.max(value, 0), 1);
}
