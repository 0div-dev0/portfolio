"use client";

import { memo, useEffect, useState, useMemo } from "react";
import { Particles, ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const STAR_COUNT = 35;
const SHOOTING_STAR_INTERVAL = 6000;

const DARK_STAR_COLORS = [
  "#ffffff",
  "#f0f5ff",
  "#e8f4fd",
  "#fff5e6",
  "#ffe4e1",
  "#e8f5e9",
  "#f7fafc",
];

const LIGHT_STAR_COLORS = [
  "#18181b",
  "#09090b",
  "#27272a",
  "#3f3f46",
  "#52525b",
  "#1e293b",
];

const ORB_COLORS = {
  "#6d28d9": "#a78bfa", // violet
  "#0891b2": "#67e8f9", // cyan
  "#be185d": "#f9a8d4", // pink
  "#d97706": "#fdba74", // orange
  "#059669": "#6ee7b7", // green
};

function createShootingStar() {
  const startX = Math.random() * 100;
  const startY = Math.random() * 20;
  const distance = 20 + Math.random() * 25;

  return {
    id: `shooting-${Date.now()}-${Math.random()}`,
    x: startX,
    y: startY,
    length: 80 + Math.random() * 100,
    duration: 0.8 + Math.random() * 0.7,
    angle: 35 + Math.random() * 20,
    distance,
  };
}

const initParticles = async (engine) => {
  await loadSlim(engine);
};

function Stars({ hoveredOrbColor = null }) {
  const [shootingStars, setShootingStars] = useState([]);
  const [isLight, setIsLight] = useState(false);

  // Monitor DOM root class for theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsLight(document.documentElement.classList.contains("light"));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Create shooting stars periodically
  useEffect(() => {
    const create = () => {
      const star = createShootingStar();
      setShootingStars((current) => [...current, star]);
      setTimeout(() => {
        setShootingStars((current) =>
          current.filter((item) => item.id !== star.id)
        );
      }, (star.duration + 0.3) * 1000);
    };

    const firstTimeout = setTimeout(create, 2000);
    const interval = setInterval(create, SHOOTING_STAR_INTERVAL);

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, []);

  const starColor = useMemo(() => {
    if (hoveredOrbColor) {
      return ORB_COLORS[hoveredOrbColor] || hoveredOrbColor;
    }
    return isLight ? LIGHT_STAR_COLORS : DARK_STAR_COLORS;
  }, [hoveredOrbColor, isLight]);

  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: "transparent" },
      particles: {
        number: {
          value: STAR_COUNT,
          density: { enable: false },
        },
        color: { value: starColor },
        opacity: {
          value: isLight ? 0.8 : 0.65,
          animation: {
            enable: true,
            speed: 0.5,
            minimumValue: 0.25,
            sync: false,
          },
        },
        size: {
          value: { min: 1.5, max: 3 },
        },
        shape: { type: "circle" },
        move: {
          enable: false,
        },
        links: {
          enable: false,
        },
      },
      interactivity: {
        detectsOn: "canvas",
        events: {
          onHover: { enable: false },
          onClick: { enable: false },
        },
      },
      detectRetina: true,
    }),
    [starColor, isLight]
  );

  return (
    <ParticlesProvider init={initParticles}>
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        <Particles
          id="stars"
          className="pointer-events-none absolute inset-0 h-full w-full"
          options={options}
        />

        {/* Shooting stars */}
        {shootingStars.map((star) => (
          <span
            key={star.id}
            className="shooting-star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.length}px`,
              "--duration": `${star.duration}s`,
              "--angle": `${star.angle}deg`,
              "--distance": `${star.distance}vw`,
            }}
          />
        ))}

        <style jsx>{`
          .shooting-star {
            position: absolute;
            height: 1px;
            border-radius: 999px;
            background: ${isLight
              ? "linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,0.2) 20%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,1))"
              : "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.8) 70%, rgba(255,255,255,1))"};
            transform-origin: right center;
            transform: rotate(var(--angle));
            opacity: 0;
            animation: shooting-star var(--duration) ease-out forwards;
            box-shadow: ${isLight
              ? "0 0 4px rgba(0,0,0,0.6), 0 0 10px rgba(0,0,0,0.3)"
              : "0 0 4px rgba(255,255,255,0.9), 0 0 10px rgba(255,255,255,0.5)"};
          }

          .shooting-star::after {
            content: "";
            position: absolute;
            right: 0;
            top: 50%;
            width: 3px;
            height: 3px;
            border-radius: 50%;
            background: ${isLight ? "#18181b" : "white"};
            transform: translateY(-50%);
            box-shadow: ${isLight
              ? "0 0 5px #18181b, 0 0 12px rgba(0,0,0,0.6)"
              : "0 0 5px white, 0 0 12px rgba(255,255,255,0.9)"};
          }

          @keyframes shooting-star {
            0% {
              opacity: 0;
              transform: translate3d(0, 0, 0) rotate(var(--angle)) scaleX(0.4);
            }
            10% {
              opacity: 1;
            }
            70% {
              opacity: 0.9;
            }
            100% {
              opacity: 0;
              transform: translate3d(
                  calc(var(--distance) * -0.7),
                  var(--distance),
                  0
                )
                rotate(var(--angle)) scaleX(1);
            }
          }
        `}</style>
      </div>
    </ParticlesProvider>
  );
}

export default memo(Stars);