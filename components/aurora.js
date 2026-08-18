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
const FOLLOW_FACTOR = 0.15;

const ORBS = [
  {
    className:
      "-left-40 -top-40 h-[36rem] w-[36rem] max-[800px]:-left-8 max-[800px]:-top-8 max-[800px]:h-[20rem] max-[800px]:w-[20rem]",
    colors: ["#6d28d9", "#a78bfa", "#312e81"],
    opacity: 0.65,
    trail: 4.5,
    floatDuration: "18s",
    blinkDelay: "0s",
  },
  {
    className:
      "-right-32 -top-24 h-[32rem] w-[32rem] max-[800px]:-right-6 max-[800px]:-top-6 max-[800px]:h-[18rem] max-[800px]:w-[18rem]",
    colors: ["#0891b2", "#22d3ee", "#155e75"],
    hueShift: -12,
    opacity: 0.6,
    trail: 3.6,
    floatDuration: "21s",
    floatDelay: "-4s",
    blinkDelay: "-1s",
  },
  {
    className:
      "-left-24 top-1/3 h-[28rem] w-[28rem] max-[800px]:-left-6 max-[800px]:top-1/4 max-[800px]:h-[15rem] max-[800px]:w-[15rem]",
    colors: ["#be185d", "#f472b6", "#831843"],
    hueShift: 14,
    opacity: 0.55,
    trail: 2.9,
    floatDuration: "24s",
    floatDelay: "-8s",
    blinkDelay: "-2s",
  },
  {
    className:
      "right-[-6rem] top-1/2 h-[30rem] w-[30rem] max-[800px]:right-0 max-[800px]:top-1/2 max-[800px]:h-[16rem] max-[800px]:w-[16rem]",
    colors: ["#d97706", "#fbbf24", "#78350f"],
    hueShift: -18,
    opacity: 0.55,
    trail: 2.2,
    floatDuration: "20s",
    floatDelay: "-12s",
    blinkDelay: "-3s",
  },
  {
    className:
      "-bottom-48 left-1/4 h-[26rem] w-[26rem] max-[800px]:-bottom-12 max-[800px]:left-1/3 max-[800px]:h-[14rem] max-[800px]:w-[14rem]",
    colors: ["#059669", "#34d399", "#064e3b"],
    hueShift: 10,
    opacity: 0.5,
    trail: 1.6,
    floatDuration: "26s",
    floatDelay: "-6s",
    blinkDelay: "-4s",
  },
];

const MIN_DISTANCE = 120;
const MIN_DISTANCE_SQ = 120 * 120;
const DRIFT_SPEED = 16;
const DIRECTION_CHANGE_INTERVAL = 3000;

export default function Aurora({
  setHoveredOrbColor,
  onOrbClick,
}) {
  const containerRef = useRef(null);
  const followRefs = useRef([]);
  const orbRefs = useRef([]);
  const positionsRef = useRef(ORBS.map(() => ({ x: 0, y: 0 })));
  const targetAnglesRef = useRef(ORBS.map(() => 0));
  const lastDirectionChangeRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initialize random drift directions and last direction change time
    targetAnglesRef.current = ORBS.map(() => Math.random() * Math.PI * 2);
    lastDirectionChangeRef.current = Date.now();

    const positions = positionsRef.current;
    const followEls = followRefs.current;
    const orbEls = orbRefs.current;

    // Detect coarse pointer (touch) — drives the tap-to-hover, tap-to-activate
    // interaction below.
    const isCoarse = () => window.matchMedia("(pointer: coarse)").matches;

    // Track hovered orb index and color for stars integration
    let hoveredOrbIndex = -1;
    let hoveredOrbColor = null;
    // On touch devices, the first tap "hovers" an orb (colours it, keeps it
    // coloured); only the second tap on the same orb performs the real click.
    let touchActivatedIndex = -1;

    const colourOrb = (orb, i) => {
      orb.classList.add("is-hovered");
      container.classList.add("has-hovered-orb");
      hoveredOrbIndex = i;
      hoveredOrbColor = ORBS[i].colors[0];
      setHoveredOrbColor(hoveredOrbColor);
    };

    const decolourOrb = (orb) => {
      orb.classList.remove("is-hovered");
      const anyHovered = orbEls.some(
        (el) => el && el.classList.contains("is-hovered")
      );
      if (!anyHovered) {
        container.classList.remove("has-hovered-orb");
        hoveredOrbIndex = -1;
        hoveredOrbColor = null;
        setHoveredOrbColor(null);
      }
    };

    // Hover reveal — colour only the orb currently under the pointer.
    // Because orbs overlap, :hover alone could colour several at once;
    // pointerenter/pointerleave only fire for the topmost element at the
    // pointer, so exactly one light is ever marked.
    const hoverCleanups = orbEls.map((orb, i) => {
      if (!orb) return () => {};
      const hitbox = orb.querySelector(".aurora-hitbox") || orb;

      const onEnter = () => {
        // On touch, a re-tap of the already-activated orb is ignored here —
        // the click handler decides whether it's the activating or real click.
        if (isCoarse() && touchActivatedIndex !== -1) return;
        colourOrb(orb, i);
      };
      const onLeave = () => {
        // On touch, the activated orb stays coloured between taps.
        if (isCoarse() && touchActivatedIndex === i) return;
        decolourOrb(orb);
      };
      const onClick = () => {
        if (!isCoarse()) {
          // Desktop — hover already coloured it; click acts immediately.
          onOrbClick?.(i);
          return;
        }
        if (touchActivatedIndex === i) {
          // Second tap — the real click.
          touchActivatedIndex = -1;
          onOrbClick?.(i);
        } else {
          // First tap — behave like a hover: keep it coloured.
          if (touchActivatedIndex !== -1) {
            decolourOrb(orbEls[touchActivatedIndex]);
          }
          touchActivatedIndex = i;
          colourOrb(orb, i);
        }
      };

      hitbox.addEventListener("pointerenter", onEnter);
      hitbox.addEventListener("pointerleave", onLeave);
      hitbox.addEventListener("click", onClick);
      return () => {
        orb.classList.remove("is-hovered");
        hitbox.removeEventListener("pointerenter", onEnter);
        hitbox.removeEventListener("pointerleave", onLeave);
        hitbox.removeEventListener("click", onClick);
      };
    });

    // Tap empty space on touch to release the activated orb.
    const onDocumentPointerDown = (e) => {
      if (!isCoarse() || touchActivatedIndex === -1) return;
      const inHitbox = orbEls.some((orb) => {
        if (!orb) return false;
        const hitbox = orb.querySelector(".aurora-hitbox") || orb;
        return hitbox.contains(e.target);
      });
      if (!inHitbox) {
        decolourOrb(orbEls[touchActivatedIndex]);
        touchActivatedIndex = -1;
      }
    };
    document.addEventListener("pointerdown", onDocumentPointerDown);

    // Keep the lights still for users who prefer reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => {
        hoverCleanups.forEach((cleanup) => cleanup());
        document.removeEventListener("pointerdown", onDocumentPointerDown);
        container.classList.remove("has-hovered-orb");
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
        container.classList.remove("has-hovered-orb");
      }
    };

    let frame = 0;
    let last = performance.now();
    let physicsFrame = 0;

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const { x: mx, y: my } = mouseRef.current;

      // Throttle physics updates to every 2 frames to reduce CPU load
      physicsFrame++;
      if (physicsFrame % 2 !== 0) {
        frame = requestAnimationFrame(tick);
        return;
      }
      physicsFrame = 0;

      // Randomly change direction every so often
      if (now - lastDirectionChangeRef.current > DIRECTION_CHANGE_INTERVAL) {
        targetAnglesRef.current = ORBS.map(() => Math.random() * Math.PI * 2);
        lastDirectionChangeRef.current = now;
      }

      followEls.forEach((follow, i) => {
        if (!follow) return;
        const position = positionsRef.current[i];
        const trail = ORBS[i].trail;
        const k = 1 - Math.exp(-trail * dt);

        // Cursor-following base movement
        position.x += (mx * FOLLOW_FACTOR - position.x) * k;
        position.y += (my * FOLLOW_FACTOR - position.y) * k;

        // Random drift in the target direction
        const targetAngle = targetAnglesRef.current[i];
        position.x += Math.cos(targetAngle) * DRIFT_SPEED * dt;
        position.y += Math.sin(targetAngle) * DRIFT_SPEED * dt;

        // Collision avoidance with other orbs (using squared distance)
        const others = positionsRef.current.filter((_, idx) => idx !== i);
        let steerX = 0;
        let steerY = 0;
        others.forEach((other) => {
          const dx = position.x - other.x;
          const dy = position.y - other.y;
          const distSQ = dx * dx + dy * dy;
          if (distSQ < MIN_DISTANCE_SQ) {
            const dist = Math.sqrt(distSQ);
            // Push apart - normalize and scale by remaining distance
            const force = (MIN_DISTANCE - dist) / MIN_DISTANCE;
            steerX += (dx / dist) * force * 16;
            steerY += (dy / dist) * force * 16;
          }
        });
        position.x += steerX * dt;
        position.y += steerY * dt;

        // Keep orbs in bounds (with some padding)
        const padding = 40;
        const rect = container.getBoundingClientRect();
        position.x = Math.max(-rect.width / 2 + padding, Math.min(rect.width / 2 - padding, position.x));
        position.y = Math.max(-rect.height / 2 + padding, Math.min(rect.height / 2 - padding, position.y));

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
      document.removeEventListener("pointerdown", onDocumentPointerDown);
      container.classList.remove("has-hovered-orb");
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseout", onPointerLeaveDocument);
      cancelAnimationFrame(frame);
    };
  }, [setHoveredOrbColor, onOrbClick]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="aurora-container p-20 pointer-events-none absolute inset-0 z-[3] overflow-hidden"
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
