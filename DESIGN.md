# Design System & Guidelines — Developer Portfolio

This document outlines the UI/UX design architecture, typography, color palettes, visual effects, and component interaction standards for the developer portfolio application. Generated in accordance with the `ui-ux-pro-max` design intelligence framework.

---

## 1. Visual Pattern & Design Aesthetic

### **Pattern: Interactive Portfolio Grid with Ambient Lighting**
- **Aesthetic**: Modern Dark Mode, Cyberpunk Luminescence, Glassmorphism & WebGL Particulate System.
- **Visual Priority**: Visual elements and interactive 3D components take center stage while neutral dark backgrounds (`#08080a`, `#050505`) let projects and ambient auroras shine.
- **Depth Hierarchy**:
  1. `z-0`: Deep space noise overlay + radial color glow gradients.
  2. `z-[2]`: `Stars` particle canvas (`@tsparticles/react`).
  3. `z-[3]`: `Aurora` blurred light orbs (`filter: blur(56px)`, mix-blend-mode screen).
  4. `z-10`: Interactive main page sections & hero content.
  5. `z-30`: Floating category selectors & unboxed overlay titles.
  6. `z-50`: Floating top navbar & upper right social icon cluster.

---

## 2. Color Palette & Orb Color Mappings

| Role | Color Hex | Accent Glow Hex | Target Section / Orb |
|---|---|---|---|
| **Background** | `#08080a` | — | Deep Void Base |
| **Foreground / Text** | `#fafafa` | — | Primary Typography |
| **Muted Text** | `#71717a` / `#a1a1aa` | — | Secondary Details |
| **Dot 0: Purple** | `#a78bfa` | `#6d28d9` | **Programming** Screen |
| **Dot 1: Cyan** | `#22d3ee` | `#0891b2` | **Academic** Screen |
| **Dot 2: Rose** | `#f472b6` | `#be185d` | **Social Work** Screen |
| **Dot 3: Amber** | `#fbbf24` | `#d97706` | **Hobbies** Screen |
| **Dot 4: Green** | `#34d399` | `#059669` | **Extra skills** Screen |

---

## 3. Typography & 3D Text Replacement

### **Font Stack**
- **Primary Body & Headings**: `Geist Sans` / `Inter` (`--font-sans`).
- **Technical & Matrix Titles**: `Geist Mono` / `Space Grotesk` (`--font-mono`).

### **Unboxed Typography Principle**
- **No Border Containers Around Text**: Titles and description texts float cleanly and openly over the canvas without artificial container boxes, heavy borders, or glowing LED shadows.
- **3D Text Replacement (`HeroStyleScrollText`)**: Uses the exact `HeroTextBlock` 3D tilt-and-slide formula (`perspective(1000px) rotateX(15deg) translateY(40px) → rotateX(0deg) translateY(0px) → rotateX(-15deg) translateY(-50px)`) to reveal new text by scrolling up from below and exit old text upward, in 1-to-1 sync with card scroll momentum across all 5 screens (including `Hobbies` and `Extra skills`).
- **3D Detail Text Block (`HeroStyleScrollTextBlock`)**: The same 3D formula applied to the rich detail panels — the `Hobbies` details (tag/title/desc, e.g. `CREATIVE CODING`) and the `Extra skills` info (`Specialization 0X` + title/desc) — so the entire block scrolls up and reveals on each step change.

---

## 4. Layout & Card Carousels

- **Uniform Screen Container**: Standardized to `h-[380px] sm:h-[420px] md:h-[450px]` across all 5 screens (`Programming`, `Academic`, `Social Work`, `Hobbies`, `Extra skills`).
- **Continuous Seamless Infinite Looping**: Modulo arithmetic offset calculation (`((scrollPos * factor) % LOOP_WIDTH + LOOP_WIDTH) % LOOP_WIDTH`) and quadrupled element arrays eliminate visual jumps or cutoffs.
- **Zero-Delay Scroll Hook (`useGalleryScroll`)**: Direct wheel input handling (`e.deltaY * 0.35`) provides instantaneous 1-to-1 responsiveness without artificial latency.
- **Progressive 1:1 3D Card Flip**: Screen 2 (Social Work) features continuous 3D card rotation (`rotateY: scrollPos * 0.45` deg) driven directly by user scroll velocity.
- **Progressive Rise Card Stack**: Screen 4 (Extra Skills) offsets each card by a continuous scroll-driven float (`offset = i - focusFloat`, `focusFloat = (|scrollPos| % 1000) / 250`) so the stack rises 1:1 with the wheel, then springs back (`stiffness: 200`, `damping: 26`) at each 250px boundary — a smooth flip-back while the step text switches to the next skill.

---

## 5. UI/UX Pro-Max Rules & Best Practices

- **Icons & SVGs**: All icons are rendered via crisp inline vector SVGs or standard icon sets (`lucide-react`, `react-icons`). Zero emojis used for UI controls.
- **Interactive Feedback**: All interactive buttons, cards, and selector pills specify explicit `cursor-pointer`, smooth transition durations (`150ms–300ms`), and visual feedback on hover (`scale(1.06)`, border highlight, color shift).
- **Reduced Motion**: Respects `prefers-reduced-motion` settings in `globals.css` by disabling marquee floats and heavy transitions.
