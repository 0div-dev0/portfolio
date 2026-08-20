"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScrollProvider — wraps the app with Lenis for buttery smooth
 * scrolling and syncs it with GSAP ScrollTrigger so scroll-driven
 * animations stay perfectly in sync with Lenis's virtual scroll.
 *
 * Also intercepts clicks on hash-link anchors (#about, #contact, etc.)
 * so they smooth-scroll via Lenis instead of jumping.
 */
export default function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Keep GSAP ScrollTrigger in sync with Lenis's virtual scroll position
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Intercept anchor-link clicks so they smooth-scroll via Lenis
    const handleClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, {
          offset: -80, // Account for the fixed navbar
          duration: 1.8,
        });
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      lenis.destroy();
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return <>{children}</>;
}
