# Developer Context - Portfolio Background Systems

## Overview
This document provides a comprehensive overview of the background star field and aurora orb systems in the portfolio. It covers functionality, component interactions, and configuration details.

---

## Stars Component (`components/stars.js`)

### Purpose
Renders a field of stars in the background with optional shooting stars and dynamic color tinting based on the currently hovered aurora orb.

### Key Configuration

| Constant | Value | Description |
|---|---|---|
| `STAR_COUNT` | 25 | Number of static stars |
| `SHOOTING_STAR_INTERVAL` | 6000ms | Frequency of shooting star generation |

### Star Colors (`STAR_COLORS`)
White-based palette for subtle variation:
- `#ffffff` - pure white
- `#f0f5ff` - light blue
- `#e8f4fd` - light cyan
- `#fff5e6` - light yellow
- `#ffe4e1` - light pink
- `#e8f5e9` - light green
- `#f7fafc` - near-white

### Component Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `hoveredOrbColor` | `string \| null` | `null` | Color of currently hovered aurora orb. When provided, stars update their color palette to match the orb's accent color. |

### Initialization & tsParticles v4 Integration
The project uses `@tsparticles/react` (v4+). In v4, engine initialization is handled by wrapping the particle element inside `<ParticlesProvider init={initParticles}>`:

```jsx
const initParticles = async (engine) => {
  await loadSlim(engine);
};

export default function Stars({ hoveredOrbColor = null }) {
  // ...
  return (
    <ParticlesProvider init={initParticles}>
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        <Particles id="stars" className="pointer-events-none absolute inset-0 h-full w-full" options={options} />
        {/* Shooting stars */}
      </div>
    </ParticlesProvider>
  );
}
```

### Color Tinting & Performance (`useMemo`)
When `hoveredOrbColor` is set, `ORB_COLORS` maps the orb's primary color to its corresponding accent color:
- `#6d28d9` (violet) → `#a78bfa`
- `#0891b2` (cyan) → `#67e8f9`
- `#be185d` (pink) → `#f9a8d4`
- `#d97706` (orange) → `#fdba74`
- `#059669` (green) → `#6ee7b7`

The particles options object is memoized via `useMemo(() => ({ ... }), [starColor])`. This ensures that the particle engine only re-initializes options when the color state changes, avoiding unnecessary canvas tear-downs on unrelated component renders:

```javascript
const starColor = hoveredOrbColor
  ? ORB_COLORS[hoveredOrbColor] || hoveredOrbColor
  : STAR_COLORS;

const options = useMemo(() => ({
  fullScreen: { enable: false },
  background: { color: "transparent" },
  particles: {
    number: { value: STAR_COUNT, density: { enable: false } },
    color: { value: starColor },
    opacity: {
      value: 0.6,
      animation: { enable: true, speed: 0.5, minimumValue: 0.25, sync: false },
    },
    size: { value: { min: 1, max: 2 } },
    shape: { type: "circle" },
    move: { enable: false },
    links: { enable: false },
  },
  interactivity: { detectsOn: "canvas", events: { onHover: { enable: false }, onClick: { enable: false } } },
  detectRetina: true,
}), [starColor]);
```

### Shooting Stars
- Generated at random intervals (every 6 seconds)
- Rendered as CSS-animated `<span>` elements with absolute positioning
- White gradient tail with box shadows and diagonal keyframe trajectory
- Automatically removed after duration completes

---

## Aurora Orb System (`components/aurora.js` + `components/aurora-orb.js`)

### Purpose
Renders 5 large, colorful blurred lights (orbs) that trail the cursor and reveal color when hovered.

### Orb Configuration (`ORBS` array)
5 orbs with individual settings:

| Orb | Position | Colors | Hue Shift | Trail | Duration |
|---|---|---|---|---|---|
| 0 | `-left-40 -top-40` | `#6d28d9`, `#a78bfa`, `#312e81` | 0 | 4.5s | 18s |
| 1 | `-right-32 -top-24` | `#0891b2`, `#22d3ee`, `#155e75` | -12 | 3.6s | 21s |
| 2 | `-left-24 top-1/3` | `#be185d`, `#f472b6`, `#831843` | 14 | 2.9s | 24s |
| 3 | `right-[-6rem] top-1/2` | `#d97706`, `#fbbf24`, `#78350f` | -18 | 2.2s | 20s |
| 4 | `-bottom-48 left-1/4` | `#059669`, `#34d399`, `#064e3b` | 10 | 1.6s | 26s |

### Hover Mechanism & Stacking Context
1. Each orb contains an invisible `.aurora-hitbox` child element (`pointer-events-auto`)
2. `pointerenter`/`pointerleave` events hit-test to the topmost orb at cursor position
3. `.aurora-container` is styled with `z-[3]`, ensuring it sits **above** the `Stars` component (`z-[2]`) so pointer events reach orb hitboxes
4. Global CSS rule in `globals.css` sets `#stars canvas { pointer-events: none !important; }` so canvas elements never trap hit-tests
5. On hover: `.is-hovered` added to orb, `.has-hovered-orb` added to container
6. On leave: classes removed, color reverts to monochrome

---

## Component Hierarchy & Stacking Order

```
Hero (hero.js)
│
├── Stars (stars.js)           z-[2]  — background star field & shooting stars
│
├── Aurora (aurora.js)         z-[3]  — colored floating orbs & interactive hitboxes
│   └── AuroraOrb (aurora-orb.js)
│
└── Hero content               z-[10] — text, buttons, scroll hint
```

---

## Orb Functionality Summary

### Individual Orb Properties
Each orb object in `ORBS` specifies:
- `className` — Tailwind positioning classes
- `colors` — Array of 3 colors: `[primary, secondary, accent]`
- `hueShift` — Offset applied to the orb's base hue
- `opacity` — Base opacity factor (0.5-0.65)
- `floatDuration` — Ambient float animation duration
- `blinkDuration` — Breathing size animation duration
- `floatDelay` / `blinkDelay` — Staggered animation delays

### Hover Color Flow
1. User moves cursor over `.aurora-hitbox` of an orb
2. `.is-hovered` class toggled on orb, `.has-hovered-orb` on container
3. `setHoveredOrbColor(ORBS[i].colors[0])` called
4. `Stars` component receives `hoveredOrbColor`, maps accent color via `ORB_COLORS`, and updates tsParticles options
5. Hovered orb transitions from monochrome to vivid color via CSS rules in `globals.css`

### Orb Color Restoration
1. Cursor leaves orb area
2. `.is-hovered` and `.has-hovered-orb` removed
3. `setHoveredOrbColor(null)` and `setHoveredOrbIndex(null)` called
4. Stars revert to default white palette (`STAR_COLORS`)
5. Orbs return to monochrome/grayscale state

---

## Typewriter Hero Text System (`components/ui/typewriter-text.jsx` + `components/hero.js`)

### Purpose
Replaces static text blocks with dynamic, reactive typewriter text. When an orb is hovered, the hero text is deleted and replaced with a clean abstract heading, a small "Gallery" badge to the bottom-left of the heading, and concise descriptive text. When unhovered, it uses typewriter animation to delete the orb text and re-type the default hero text.

### Reactive Prop Transition & Speed Tuning
- **Ultra-Fast Speed (Max 1s)**: `maxDuration={1000}` ensures heading and description complete typing in <= 1000ms regardless of string length (`calcSpeed = Math.max(8, Math.floor(1000 / length))`).
- **Auto-Hiding Cursor**: The cursor element is rendered **ONLY** while actively writing or deleting text (`isWriting = isDeleting || displayText.length < currentTarget.length`), and disappears completely when idle.

### Orb Detail Mapping (`ORB_DETAILS` in `components/hero.js`)
- **Orb 0 (Purple)**: `#a78bfa` → Heading: `"Organic Luminescence — Light Field Study"`
- **Orb 1 (Cyan)**: `#22d3ee` → Heading: `"Fluid Resonance — Subsurface Dynamics"`
- **Orb 2 (Rose)**: `#f472b6` → Heading: `"Impermanence — Forms Unfolding"`
- **Orb 3 (Amber)**: `#fbbf24` → Heading: `"Radiance Field — Energy & Heat"`
- **Orb 4 (Green)**: `#34d399` → Heading: `"Structural Growth — Canopy Dynamics"`

---

## Accelerated Hero Scroll Transition (`components/hero-text-block.js` + `components/scroll-animations.js` + `app/page.js`)

### Timeline & Scroll Parameters
- **Hero Text Exit**: As soon as scroll starts, the main text block translates upward (`translateY = -90px * progress`) and fades out rapidly within ~250px of vertical scroll.
- **Orb Shrink & Fade**: Background orbs shrink and fade rapidly (`orbEnd = vh * 0.5`), completely disappearing before reaching the About section.
- **Scroll Spacer**: Height reduced to `80vh` (`hero-scroll-spacer`), resulting in a tight, fast transition curve into the About section.

---

## Integrated Gallery System (`components/gallery-section.js` + `components/ui/hyper-text.jsx` + `app/page.js`)

### Main Page Section Integration & Navigation
- **Section Embed**: The interactive gallery is integrated as a full `<section id="gallery">` inside `app/page.js`, replacing standalone routes with a single-page scrolling experience.
- **Navbar Smooth Scroll**: Nav bar target updated to `#gallery`. The standalone `/gallery` route wraps `<GallerySection />` in `<Suspense>` for backward compatibility.

### Enlarged Left Category Selector & Topic Labels
- The left selector features enlarged interactive dot indicators with visible category text labels:
  1. `Programming` (`#a78bfa`)
  2. `Academic` (`#22d3ee`)
  3. `Social Work` (`#f472b6`)
  4. `Hobbies` (`#fbbf24`)
  5. `Extra skills` (`#34d399`)
- Active item displays a glowing ring (`motion.div layoutId="activeDotRing"`) and highlighted category label with text-shadow glow.

### Standardized Uniform Screen Dimensions & Clean Slick Typography
- **Uniform Increased Screen Height**: Increased all 5 screen containers to `h-[380px] sm:h-[420px] md:h-[450px]`, giving ample breathing room while keeping screens equal.
- **Hero-Style 3D Scroll Replacement (`HeroStyleScrollText`)**: Extracted the exact 3D tilt-and-slide transformation math from `HeroTextBlock` (`perspective(1000px) rotateX(15deg) translateY(40px) → rotateX(0deg) translateY(0px) → rotateX(-15deg) translateY(-50px)`) to seamlessly fade old text upward and introduce new text from below as cards scroll up and down. Applied to **all 5 screens**, including `Hobbies` (3) and `Extra skills` (4).
- **Hero-Style 3D Scroll Detail Block (`HeroStyleScrollTextBlock`)**: Same 3D formula as `HeroStyleScrollText` but for the rich detail panels — the `Hobbies` details panel (tag/title/desc, e.g. `CREATIVE CODING`) and the `Extra skills` info panel (`Specialization 01` + title/desc) — swapping the whole label/title/desc block with the same scroll-up reveal on every `activeStep` change. Items without a `tag` fall back to the `Specialization 0X` label.
- **Progressive Rise Card Stack (Extra Skills)**: Screen 4's isometric stack is no longer step-snapped. A continuous `focusFloat = (|scrollPos| % (skills.length * 250)) / 250` drives each card's `offset = i - focusFloat`, so cards translate up 1:1 with the wheel (`y: offset * 20`, `x: offset * 12`, `rotateZ: offset * -4`, smooth scale/opacity interpolation). At each 250px boundary the stack springs back (`type: "spring", stiffness: 200, damping: 26, mass: 0.9`) — the flip-back — while the discrete `activeStep` switches the `HeroStyleScrollText` and info panel to the next skill.
- **Zero-Delay Direct Wheel Scroll**: Replaced RAF decay delay in `useGalleryScroll` with direct wheel delta updates (`setScrollPos((prev) => prev + e.deltaY * 0.35)`), providing 0ms latency instantaneous scroll response.
- **DESIGN.md System**: Created `DESIGN.md` in project root incorporating `ui-ux-pro-max` guidelines, color mappings, depth hierarchy, unboxed typography rules, and pre-delivery checklist.

### Universal On-Scroll Pop-Up Effect
- **GSAP ScrollTrigger Pop-Up**: All section containers (`.scroll-reveal`) use `fromTo` pop-up animation (`opacity: 0 → 1`, `scale: 0.95 → 1`, `y: 50px → 0`) scrubbing as elements enter the viewport.