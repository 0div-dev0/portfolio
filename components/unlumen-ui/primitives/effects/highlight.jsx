"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

const HighlightContext = React.createContext(null);

function Highlight({
  children,
  className,
  hover = true,
  controlledItems = false,
  mode = "parent",
  style,
  containerClassName,
  ...props
}) {
  const containerRef = React.useRef(null);
  const itemsRef = React.useRef(new Map());

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);

  const springConfig = { type: "spring", stiffness: 350, damping: 30 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const springWidth = useSpring(width, springConfig);
  const springHeight = useSpring(height, springConfig);

  const [isActive, setIsActive] = React.useState(false);

  const registerItem = React.useCallback((key, element) => {
    if (element) {
      itemsRef.current.set(key, element);
    } else {
      itemsRef.current.delete(key);
    }
  }, []);

  const setActiveItem = React.useCallback(
    (key) => {
      if (!hover) return;
      const element = itemsRef.current.get(key);
      const container = containerRef.current;
      if (!element || !container) return;

      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      x.set(elementRect.left - containerRect.left);
      y.set(elementRect.top - containerRect.top);
      width.set(elementRect.width);
      height.set(elementRect.height);
      setIsActive(true);
    },
    [hover, x, y, width, height]
  );

  const clearActive = React.useCallback(() => {
    if (!hover) return;
    setIsActive(false);
    x.set(0);
    y.set(0);
    width.set(0);
    height.set(0);
  }, [hover, x, y, width, height]);

  const contextValue = React.useMemo(
    () => ({
      registerItem,
      setActiveItem,
      clearActive,
      controlledItems,
      mode,
    }),
    [registerItem, setActiveItem, clearActive, controlledItems, mode]
  );

  return (
    <HighlightContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={cn("relative", containerClassName)}
        style={style}
        {...props}
      >
        <motion.div
          className={cn(
            "absolute pointer-events-none",
            className
          )}
          style={{
            x: springX,
            y: springY,
            width: springWidth,
            height: springHeight,
            opacity: isActive ? 1 : 0,
          }}
          transition={springConfig}
        />
        {children}
      </div>
    </HighlightContext.Provider>
  );
}

function HighlightItem({
  children,
  className,
  asChild = false,
  active: activeProp,
  ...props
}) {
  const context = React.useContext(HighlightContext);
  const ref = React.useRef(null);
  const id = React.useId();

  React.useEffect(() => {
    if (ref.current && context) {
      context.registerItem(id, ref.current);
    }
    return () => context?.registerItem(id, null);
  }, [id, context]);

  const handlers = context?.hover
    ? {
        onPointerEnter: (e) => {
          context.setActiveItem(id);
          props.onPointerEnter?.(e);
        },
        onPointerLeave: (e) => {
          context.clearActive();
          props.onPointerLeave?.(e);
        },
      }
    : {};

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      className: cn(children.props.className, className),
      ...handlers,
      ...props,
    });
  }

  return (
    <div ref={ref} className={cn("relative", className)} {...handlers} {...props}>
      {children}
    </div>
  );
}

export { Highlight, HighlightItem };
