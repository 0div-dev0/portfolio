"use client";

import { useEffect, useRef } from "react";
import AuroraOrb from "./aurora-orb";

/**
 * Aurora — the hero background.
 *
 * A set of large, heavily blurred lights that start black & white. Only the
 * light currently under the cursor is coloured: `pointerenter`/`pointerleave`
 * hit-test to a single element (the topmost one at the pointer position), and
 * we toggle `.is-hovered` on exactly that orb.
 *
 * The lights also trail the cursor: each orb moves by roughly 5% of the
 * cursor's offset from the hero centre, and every orb eases toward its target
 * at a different rate (`trail`), so they drift along the cursor's path one
 * behind the other instead of snapping.
 */

// How much of the cursor's offset from centre each orb follows.
const FOLLOW_FACTOR = 0.05;

const ORBS = [
  {
    className: "-left-40 -top-40 h-[36rem] w-[36rem]",
    colors: ["#6d28d9", "#a78bfa", "#312e81"],
    opacity: 0.65,
    trail: 4.5,
    floatDuration: "18s",
  },
  {
    className: "-right-32 -top-24 h-[32rem] w-[32rem]",
    colors: ["#0891b2", "#22d3ee", "#155e75"],
    hueShift: -12,
    opacity: 0.6,
    trail: 3.6,
    floatDuration: "21s",
    floatDelay: "-4s",
  },
  {
    className: "-left-24 top-1/3 h-[28rem] w-[28rem]",
    colors: ["#be185d", "#f472b6", "#831843"],
    hueShift: 14,
    opacity: 0.55,
    trail: 2.9,
    floatDuration: "24s",
    floatDelay: "-8s",
  },
  {
    className: "right-[-6rem] top-1/2 h-[30rem] w-[30rem]",
    colors: ["#d97706", "#fbbf24", "#78350f"],
    hueShift: -18,
    opacity: 0.55,
    trail: 2.2,
    floatDuration: "20s",
    floatDelay: "-12s",
  },
  {
    className: "-bottom-48 left-1/4 h-[26rem] w-[26rem]",
    colors: ["#059669", "#34d399", "#064e3b"],
    hueShift: 10,
    opacity: 0.5,
    trail: 1.6,
    floatDuration: "26s",
    floatDelay: "-6s",
  },
];

export default function Aurora() {
  const containerRef = useRef(null);
  const followRefs = useRef([]);
  const orbRefs = useRef([]);
  const positionsRef = useRef(ORBS.map(() => ({ x: 0, y: 0 })));
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const positions = positionsRef.current;
    const followEls = followRefs.current;
    const orbEls = orbRefs.current;

    // Hover reveal — colour only the orb currently under the pointer.
    // Because orbs overlap, :hover alone could colour several at once;
    // pointerenter/pointerleave only fire for the topmost element at the
    // pointer, so exactly one light is ever marked.
    const hoverCleanups = orbEls.map((orb) => {
      if (!orb) return () => {};
      const onEnter = () => orb.classList.add("is-hovered");
      const onLeave = () => orb.classList.remove("is-hovered");
      orb.addEventListener("pointerenter", onEnter);
      orb.addEventListener("pointerleave", onLeave);
      return () => {
        orb.classList.remove("is-hovered");
        orb.removeEventListener("pointerenter", onEnter);
        orb.removeEventListener("pointerleave", onLeave);
      };
    });

    // Keep the lights still for users who prefer reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => {
        hoverCleanups.forEach((cleanup) => cleanup());
      };
    }

    const onPointerMove = (event) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: event.clientX - (rect.left + rect.width / 2),
        y: event.clientY - (rect.top + rect.height / 2),
      };
    };

    // Pointer left the browser window — glide back to rest and make sure no
    // light keeps a stuck hover class.
    const onPointerLeaveDocument = (event) => {
      if (!event.relatedTarget) {
        mouseRef.current = { x: 0, y: 0 };
        orbEls.forEach((orb) => orb && orb.classList.remove("is-hovered"));
      }
    };

    let frame = 0;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const { x: mx, y: my } = mouseRef.current;

      followEls.forEach((follow, i) => {
        if (!follow) return;
        const position = positions[i];
        const trail = ORBS[i].trail;
        // Frame-rate independent exponential smoothing; smaller trail = laggier.
        const k = 1 - Math.exp(-trail * dt);
        position.x += (mx * FOLLOW_FACTOR - position.x) * k;
        position.y += (my * FOLLOW_FACTOR - position.y) * k;
        follow.style.transform = `translate3d(${position.x.toFixed(2)}px, ${position.y.toFixed(
          2
        )}px, 0)`;
      });

      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseout", onPointerLeaveDocument);
    frame = requestAnimationFrame(tick);

    return () => {
      hoverCleanups.forEach((cleanup) => cleanup());
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseout", onPointerLeaveDocument);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {ORBS.map((orb, i) => (
        <AuroraOrb
          key={i}
          {...orb}
          wrapperRef={(el) => {
            followRefs.current[i] = el;
          }}
          orbRef={(el) => {
            orbRefs.current[i] = el;
          }}
        />
      ))}

      {/* Film grain for texture */}
      <div className="noise-overlay absolute inset-0 opacity-[0.04]" />
    </div>
  );
}
