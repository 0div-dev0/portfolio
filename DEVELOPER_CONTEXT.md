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
| `STAR_COUNT` | 35 | Number of static stars |
| `SHOOTING_STAR_INTERVAL` | 6000ms | Frequency of shooting star generation |

### Stationary stars (no drift, no connecting lines)
Per the design, hero stars are **static**: `move: { enable: false }` and `links: { enable: false }` in the tsParticles options. Lines are never drawn between stars, and stars never move — only the occasional CSS-driven shooting star animates. The component is exported via `React.memo` so it only re-renders when `hoveredOrbColor` changes.

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
1. Each orb contains an invisible `.aurora-hitbox` child element (`pointer-events-auto`) that fills the **entire orb** (`inset-0`) so it is easy to hit.
2. `pointerenter`/`pointerleave` events hit-test to the topmost orb at cursor position.
3. `.aurora-container` is styled with `z-[3]`, ensuring it sits **above** the `Stars` component (`z-[2]`) so pointer events reach orb hitboxes.
4. Global CSS rule in `globals.css` sets `#stars canvas { pointer-events: none !important; }` so canvas elements never trap hit-tests.
5. On hover: `.is-hovered` added to orb, `.has-hovered-orb` added to container.
6. On leave: classes removed, color reverts to monochrome.

### Hover behaviour (simple — no stillness gating)
There is **no stationary-cursor requirement**: orbs colour **immediately** on `pointerenter` and decolour on `pointerleave`.
- No candidate/coasting thresholds, no pointermove hit-testing — the old `STATIONARY_MS`/`MOVE_PX` gate was removed to reduce complexity.
- `pointermove` is only consumed by the follow/trail physics (updates `mouseRef`).
- Touch devices keep the two-tap behaviour (first tap colours, second tap navigates).
- The component is exported via `React.memo`; its props are the stable `useState` setters and a stable `useCallback` click handler, so hero re-renders (e.g. typing in the contact box) don't re-render Aurora.

---

## Component Hierarchy & Stacking Order

```
Page (app/page.js)
│
├── ConstellationField (constellation-field.js)   z-0, fixed — page-wide animated white defense-line background
│      shown behind ALL sections EXCEPT the hero (hero's opaque bg covers it)
│
└── Hero + sections (z-10+)
    │
    ├── Hero (hero.js)          z-10, opaque bg  — stars only (no constellation)
    │   ├── Stars (stars.js)           z-[2]  — background star field & shooting stars
    │   ├── Aurora (aurora.js)         z-[3]  — colored floating orbs & interactive hitboxes
    │   │   └── AuroraOrb (aurora-orb.js)
    │   └── Hero content               z-[10] — text, Gmail contact form, scroll hint
    │
    ├── About / Play / Contact  transparent  — constellation shows through
    └── Gallery (gallery-section.js)  transparent bg  — constellation shows through
```

---

## ConstellationField Component (`components/constellation-field.js`)

### Purpose
Renders a persistent, single fixed full-viewport Canvas 2D "defense lines" animation behind every page section **except** the hero. It is derived from the ThreeUI "Defense Lines" (`defense-lines`) variant, but recolored from crimson to **white** per the design. The hero keeps its opaque `bg-background` (and its own stars/aurora) on top, so the constellation is hidden in the hero and revealed in About / Gallery / Play / Contact.

### How it works
- A single `<canvas>` is rendered with `className="defense-lines-bg"` inside `app/page.js` as the first element.
- `globals.css` styles `.defense-lines-bg` as `position: fixed; inset: 0; z-index: 0; pointer-events: none`.
- In the effect, small vertical line "particles" rain upward across the canvas. Each line is a fading vertical gradient, brighter toward its midpoint and brightest near the center of the viewport (a radial proximity weighting makes the middle glow hotter). Lines are repositioned to the bottom once they exit the top.
- Hi-DPI aware: canvas backing store is sized with `devicePixelRatio` (capped at **1.5**), and a `ctx.setTransform(dpr,0,0,dpr,0,0)` handles the scaling.
- **Performance optimizations**: the animation loop is throttled to **~30fps** (every other RAF frame — the drift is slow enough that this is invisible), the loop **freezes entirely when the tab is hidden** (`document.visibilitychange`), resizes are **debounced (150ms)** since `initCanvas` rebuilds the whole particle pool, and the component is exported via `React.memo` (its props are static literals in `page.js`).

### Props
| Prop | Default | Description |
|---|---|---|
| `variant` | `"defense-lines"` | Effect variant (only defense-lines is implemented here). |
| `mode` | `"dark"` | `"dark"` → near-black bg `#050505`; `"light"` → pale bg `#f4ecec`. |
| `speed` | `1` | Animation speed multiplier (clamped 0–3). |
| `size` | `1` | Stroke width scaling (clamped 0.05–200). |
| `length` | `1` | Base line length scaling (clamped 0.35–2.5). |
| `density` | `1` | Particle count scaling (clamped 0.25–2.5). Mobile base 40, desktop base 100. |
| `strokeWidth` | `1` | Line width (clamped 0.25–8). |
| `opacity` | `1` | Canvas opacity (clamped 0.05–1; used at `0.5` for a subtle background). |
| `hue` / `saturation` / `brightness` | `0`/`1`/`1` | CSS filter applied to the canvas. |
| `className` / `style` | — | Applied to the `<canvas>`. |

### Color derivation (white, not red)
The original crimson gradient stops (`rgba(220,38,38,0)` → `rgba(255,38+brightness,38+brightness,…)` → `rgba(220,38,38,0)`) are replaced with neutral white/gray stops so the lines read as white on the dark `#050505` background:
- `rgba(220,220,220,0)` → `rgba(255-brightness,255-brightness,255-brightness,alpha)` → `rgba(220,220,220,0)`
- The `brightness` term (center-proximity 0–180) is subtracted from 255, so lines near center are brighter (whiter) and fade to gray toward the edges.

### Usage in `app/page.js`
```jsx
<ConstellationField
  variant="defense-lines"
  mode="dark"
  speed={1}
  size={1}
  length={1}
  density={1}
  opacity={0.5}
  className="defense-lines-bg"
/>
```
Placed as the first child of the page root so it sits at z-0 behind everything. The hero's opaque `bg-background` covers it; About, Gallery, Play and Contact keep transparent backgrounds so it shows through.

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
1. User moves cursor over an orb and stops — colour is applied only after the cursor is stationary (see "Stationary-cursor hover gating")
2. `.is-hovered` class toggled on orb, `.has-hovered-orb` on container
3. `setHoveredOrbColor(ORBS[i].colors[0])` and `setHoveredOrbIndex(i)` called
4. `Stars` component receives `hoveredOrbColor`, maps accent color via `ORB_COLORS`, and updates tsParticles options
5. Hero text switches (typewriter) to the orb's `ORB_DETAILS` heading/description
6. Hovered orb transitions from monochrome to vivid color via CSS rules in `globals.css`

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
- **Ultra-Fast Speed (Max 1s)**: `maxDuration={1000}` ensures heading and description complete typing in well under a second: typing runs at `calcSpeed = Math.max(4, floor(maxDuration / length / 2))` (≈500ms for a typical heading) and deletion is fixed at `220ms` total (`calcDeleteSpeed = Math.max(2, floor(220 / length))`). A full replace therefore lands around ~700-800ms.
- **Smooth (not instant) text swap**: when the hovered orb changes, the component deletes the active text and re-types the new text rather than snapping — kept fast enough to feel snappy.
- **Auto-Hiding Cursor**: The cursor element is rendered **ONLY** while actively writing or deleting text (`isWriting = isDeleting || displayText.length < currentTarget.length`), and disappears completely when idle.

### Orb Detail Mapping (`ORB_DETAILS` in `components/hero.js`)
- **Orb 0 (Purple)**: `#a78bfa` → Heading: `"Organic Luminescence — Light Field Study"`
- **Orb 1 (Cyan)**: `#22d3ee` → Heading: `"Fluid Resonance — Subsurface Dynamics"`
- **Orb 2 (Rose)**: `#f472b6` → Heading: `"Impermanence — Forms Unfolding"`
- **Orb 3 (Amber)**: `#fbbf24` → Heading: `"Radiance Field — Energy & Heat"`
- **Orb 4 (Green)**: `#34d399` → Heading: `"Structural Growth — Canopy Dynamics"`

---

## Hero Scroll Fade Transition (`components/hero-text-block.js` + `components/scroll-animations.js` + `app/page.js`)

### Timeline & Scroll Parameters
The hero is a normal (non-sticky) section of **exactly `h-svh` (1 viewport)**; About sits directly below it. The whole hero (orbs, stars, portrait, text, carousel, hint) disappears **extremely fast — fully gone after ~200px of scrolling**:

- **Orb Shrink & Fade / Stars Fade**: `orbFade / starsFade = 1 - scrollY / 200`.
- **Hero Content Fade** (`.hero-content-wrapper`: text block + projects carousel): fades `0 → 200px`.
- **Hero Text Exit**: `HeroTextBlock` (`isFirst`) holds visible briefly (≤20px), then scrolls up + fades between `30 → 180px` (`translateY -90`, `rotateX -12`, opacity → 0).
- **Self-portrait fade**: `.hero-portrait` opacity → 0 by ~180px.
- **Scroll Hint**: fades out within 90px.

## Brand Logo (`components/navbar.js` + `public/divdev.svg`)

- The `divdev.svg` mark is **fixed, top-center** (bare `<a>` link to `/`, no circle/card wrapper), sized `w-28 → w-40` responsive, white-flattened via CSS `filter: brightness(0) invert(1) drop-shadow(...)`.
- The SVG asset originally embedded its art with `preserveAspectRatio="none"` (2160×720 PNG stretched into a 2048×1152 frame) → the logo rendered vertically distorted. The frame was corrected to `viewBox="0 0 2172 724"` with `xMidYMid meet` so the mark renders at its native ~3:1 wide ratio, undistorted.

## Hero Projects Carousel (`components/projects-carousel.js`)

- Replaces the old hero contact box ("Send via Gmail" textarea). It renders directly below the hero text block (wrapper `gap-5`, left-aligned on desktop).
- The whole carousel sits inside a **thick outlined box** (`border-[3px]` + inset `outline-[3px]`) with a **"PROJECTS" pill label sitting on the top border** (centered).
- Cards: iframes of recent projects (`https://reppel.netlify.app`, `https://storifyjournal.ercel.app`) + styled "Coming soon" placeholders. Each iframe card keeps a **persistent overlay** (gradient + title + "open live site" link) so it looks intentional even when the embedded site blocks iframing (X-Frame-Options/CSP), and always links out.
- Sizing: cards `w-64 → sm:w-80`, `aspect-[16/10]`; box `max-w-[17.5rem] → sm:max-w-[22rem]`.
- **Infinite loop**: cards are rendered twice (2×). Arrow navigation wraps at the ends (`scrollTo` with modulo-style wrap: right past the last card jumps back to the first seamless duplicate, left from the first jumps to the last). Native swipe also works (`snap-x`).
- Carousel fades out with the rest of the hero content on scroll (0 → 200px).

## Hero Self-Portrait Parallax (`components/hero.js` + `public/selfportrait.png`)

- `<img>` portrait absolutely positioned bottom-center (masked fade-top), `z-3`.
- **Parallax**: a ref-based scroll handler translates it `translateX(-50%) translateY(scrollY * 0.35)` — the portrait "lags" the page while scrolling — via rAF throttle, no React re-renders. Its opacity still fades with the hero (see above).
- Mouse parallax on the text container is separate (ref + direct style on `mousemove`).

## Hero Content & Orb Default Copy (`components/hero.js`)

### Default copy
- Heading: `Hi, I'm Divit Jain- A passionate designer and startup founder`
- Description: `Scroll or click the orbs to take a peek at my work.`
- (These two defaults are shown whenever no orb is hovered; hovering an orb swaps to that orb's `heading`/`desc` from `ORB_DETAILS`.)

### Notes
- The former "Send via Gmail" contact box (Gmail compose `view=cm` draft + textarea) has been **removed from the hero** and replaced by the Projects Carousel (see above). A dedicated contact/footer section was scoped but **reverted per request** — `#contact` still falls back to the generic placeholder section in `app/page.js`. If a contact section returns, reuse the Gmail-compose approach (`https://mail.google.com/mail/?view=cm&fs=1&to=jaindivit001@gmail.com&su=<subject>&body=<message>`).

### Performance
- `Hero`, `Aurora`, `Stars`, `HeroTextBlock` and `ConstellationField` are all exported through `React.memo`.
- The cursor parallax on the text block is applied via a **ref + direct style write on `mousemove`** — no React state is touched, so moving the mouse never re-renders the hero. (Previously a `cursorPos` state caused a full hero re-render on every move.)
- `relativeRange={TEXT_RANGE}` and the `galleryBadge` are stable references (`useMemo`/module const) so the memoized children don't re-render.

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

### Background Architecture Separation & Light/Dark Theme Adaptation
- **Hero Background**: The particle star field (`<Stars />`) and interactive colored floating lights (`<Aurora />`) live **exclusively** inside the Hero section (`components/hero.js`).
- **Post-Hero Background (About, Gallery, Play, Contact)**: All sections after the Hero feature the persistent **animated stripes background** (`<ConstellationField />` defense lines).
- **Light & Dark Mode Adaptation**:
  - In Light Mode, the animated stripes canvas background turns **pure white** (`#ffffff`), and defense lines turn **dark charcoal/black** (`rgba(20, 20, 20, 0.85)`). Hero stars turn black (`#18181b`, `#09090b`).
  - In Dark Mode, the background is dark (`#050505`), defense lines turn silver/white, and hero stars turn white.
- **Progressive Rise Card Stack (Extra Skills)**: Screen 4's isometric stack is no longer step-snapped. A continuous `focusFloat = (|scrollPos| % (skills.length * 250)) / 250` drives each card's `offset = i - focusFloat`, so cards translate up 1:1 with the wheel (`y: offset * 20`, `x: offset * 12`, `rotateZ: offset * -4`, smooth scale/opacity interpolation). At each 250px boundary the stack springs back (`type: "spring", stiffness: 200, damping: 26, mass: 0.9`) — the flip-back — while the discrete `activeStep` switches the `HeroStyleScrollTextBlock` info panel to the next skill.
- **Zero-Delay Direct Wheel Scroll**: Replaced RAF decay delay in `useGalleryScroll` with direct wheel delta updates (`setScrollPos((prev) => prev + e.deltaY * 0.35)`), providing 0ms latency instantaneous scroll response.
- **DESIGN.md System**: Created `DESIGN.md` in project root incorporating `ui-ux-pro-max` guidelines, color mappings, depth hierarchy, unboxed typography rules, and pre-delivery checklist.

### Universal On-Scroll Pop-Up Effect
- **GSAP ScrollTrigger Pop-Up**: All section containers (`.scroll-reveal`) use `fromTo` pop-up animation (`opacity: 0 → 1`, `scale: 0.95 → 1`, `y: 50px → 0`) scrubbing as elements enter the viewport.