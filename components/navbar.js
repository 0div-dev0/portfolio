"use client";

import React from "react";
import { LayoutGroup, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FaGithub } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "/gallery" },
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
        "relative z-10 flex h-8 sm:h-9 items-center px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-colors duration-200 whitespace-nowrap",
        isActive ? "text-foreground" : "text-foreground/60 hover:text-foreground/90"
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
    <>
    <nav
      className={cn(
        "fixed top-4 left-4 sm:top-5 sm:left-10 z-50 flex items-center gap-1 px-1 py-1 rounded-full transition-all duration-300 max-w-[calc(100vw-200px)] sm:max-w-[calc(100vw-140px)] overflow-x-auto no-scrollbar",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border border-border/10 shadow-lg"
          : "bg-transparent",
        className
      )}
    >
      <LayoutGroup>
        <div className="relative flex items-center">
          {hoveredIndex !== null && activeRect && (
            <motion.div
              layoutId="nav-highlight"
              className="absolute rounded-full bg-foreground/10"
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

    {/* Social icons + theme toggle — independent floating cluster, top right */}
      <div className="fixed top-4 right-4 sm:top-5 sm:right-5 z-50 flex items-center gap-2">
        <a href="" aria-label="Instagram" className="w-8 h-8 rounded-full border border-white/60 flex items-center justify-center text-white transition-colors hover:text-white hover:border-white hover:shadow-[0_0_12px_rgba(255,255,255,0.6)]">
          <FaInstagram size={16} className="drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
        </a>
        <a href="" aria-label="GitHub" className="w-8 h-8 rounded-full border border-white/60 flex items-center justify-center text-white transition-colors hover:text-white hover:border-white hover:shadow-[0_0_12px_rgba(255,255,255,0.6)]">
          <FaGithub size={16} className="drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
        </a>
        <ThemeToggle className="ml-1" />
      </div>
    </>
  );
}

export default Navbar;
