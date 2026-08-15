/**
 * AuroraOrb — a single "light" in the aurora background.
 *
 * Three layers, each with one job:
 * 1. `.aurora-follow` — outer wrapper whose transform is driven by JS so the
 *    light trails the cursor (parallax, ~5% of the cursor's movement).
 * 2. `.aurora-drift` — runs the slow ambient drift animation. Living on its
 *    own layer means it never fights the JS follow transform or hover scale.
 * 3. `.aurora-orb` — painted in full colour but flattened to monochrome with
 *    `grayscale(1)`; the `.is-hovered` class (toggled by Aurora for the orb
 *    under the cursor) restores contrast, brightness, hue and the colour
 *    hidden underneath.
 */

export default function AuroraOrb({
  className = "",
  colors = ["#8b5cf6", "#a78bfa", "#312e81"],
  hueShift = 0,
  opacity = 0.6,
  floatDuration = "16s",
  floatDelay = "0s",
  blinkDuration = "5s",
  blinkDelay = "0s",
  wrapperRef,
  orbRef,
}) {
  const gradient = `radial-gradient(circle at 32% 32%, ${colors.join(
    ", "
  )}, transparent 72%)`;

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className={`aurora-follow pointer-events-none absolute ${className}`}
    >
      <div
        className="aurora-drift h-full w-full"
        style={{ animationDuration: floatDuration, animationDelay: floatDelay }}
      >
        <div
          className="aurora-blink h-full w-full"
          style={{ animationDuration: blinkDuration, animationDelay: blinkDelay }}
        >
          <div
            ref={orbRef}
            className="aurora-orb pointer-events-none relative h-full w-full"
            style={{
              background: gradient,
              "--hue-shift": `${hueShift}deg`,
              "--orb-opacity": opacity,
            }}
          >
            <div className="aurora-hitbox pointer-events-auto cursor-none absolute inset-[10%] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
