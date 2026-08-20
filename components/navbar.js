"use client";

import React from "react";
import { LayoutGroup, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Play", href: "#play" },
  { label: "Contact", href: "#contact" },
];

function NavItem({ label, href, isActive, onHoverStart, onHoverEnd }) {
  return (
    <a
      href={href}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className={cn(
        "relative z-10 flex h-9 items-center px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200",
        isActive ? "text-white" : "text-white/60 hover:text-white/90"
      )}
    >
      {label}
    </a>
  );
}

export function Navbar({ className }) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState(null);
  const [activeRect, setActiveRect] = React.useState(null);
  const itemRefs = React.useRef([]);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleHoverStart = React.useCallback((index) => {
    setHoveredIndex(index);
    const el = itemRefs.current[index];
    if (el) {
      const parentEl = el.parentElement;
      const parentRect = parentEl.getBoundingClientRect();
      const itemRect = el.getBoundingClientRect();
      setActiveRect({
        left: itemRect.left - parentRect.left,
        top: itemRect.top - parentRect.top,
        width: itemRect.width,
        height: itemRect.height,
      });
    }
  }, []);

  const handleHoverEnd = React.useCallback(() => {
    setHoveredIndex(null);
    setActiveRect(null);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-1 py-1 rounded-full transition-all duration-300",
        isScrolled
          ? "bg-black/80 backdrop-blur-md border border-white/10 shadow-lg"
          : "bg-transparent",
        className
      )}
    >
      <LayoutGroup>
        <div className="relative flex items-center">
          {hoveredIndex !== null && activeRect && (
            <motion.div
              layoutId="nav-highlight"
              className="absolute rounded-full bg-white/10"
              initial={false}
              animate={{
                left: activeRect.left,
                top: activeRect.top,
                width: activeRect.width,
                height: activeRect.height,
              }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 30,
              }}
            />
          )}
          {NAV_ITEMS.map((item, i) => (
            <div
              key={item.label}
              ref={(el) => { itemRefs.current[i] = el; }}
            >
              <NavItem
                label={item.label}
                href={item.href}
                isActive={hoveredIndex === i}
                onHoverStart={() => handleHoverStart(i)}
                onHoverEnd={handleHoverEnd}
              />
            </div>
          ))}
        </div>
      </LayoutGroup>
    </nav>
  );
}

export default Navbar;
