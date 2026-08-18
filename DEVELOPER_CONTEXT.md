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
3. `setHoveredOrbColor(null)` called
4. Stars revert to default white palette (`STAR_COLORS`)
5. Orbs return to monochrome/grayscale state