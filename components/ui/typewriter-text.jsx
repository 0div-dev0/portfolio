"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Typewriter component
 *
 * Renders text with a fast typewriter effect (completes typing in <= 1 second max).
 * Shows cursor ONLY while actively typing or deleting, hiding it when idle.
 * Handles dynamic `text` prop transitions smoothly by deleting active text
 * and re-typing the new target text.
 */
export function Typewriter({
  text,
  maxDuration = 1000,
  cursor = "|",
  loop = false,
  delay = 1500,
  className,
}) {
  const textArray = Array.isArray(text) ? text : [text];
  const [textArrayIndex, setTextArrayIndex] = useState(0);
  const rawTargetText = textArray[textArrayIndex] || "";

  const [displayText, setDisplayText] = useState(rawTargetText);
  const [isDeleting, setIsDeleting] = useState(false);
  const activeTargetRef = useRef(rawTargetText);
  const prevPropTextRef = useRef(text);

  // Synchronize when `text` prop changes dynamically
  useEffect(() => {
    const currentPropString = Array.isArray(text) ? text.join(";") : text;
    const prevPropString = Array.isArray(prevPropTextRef.current)
      ? prevPropTextRef.current.join(";")
      : prevPropTextRef.current;

    if (currentPropString !== prevPropString) {
      prevPropTextRef.current = text;
      setTextArrayIndex(0);
      const newTarget = Array.isArray(text) ? text[0] : text;
      activeTargetRef.current = newTarget;

      // Start deleting current text to reveal new text
      setIsDeleting(true);
    }
  }, [text]);

  const currentTarget = activeTargetRef.current || "";
  const isWriting = isDeleting || displayText.length < currentTarget.length;

  // Dynamic speeds so typing finishes well within maxDuration (default 1000ms).
  // The delete phase is much faster so the full replace completes almost
  // instantly (whole swap well under ~800ms for typical hero strings).
  const calcSpeed = Math.max(4, Math.floor(maxDuration / Math.max(currentTarget.length, 1) / 2));
  const calcDeleteSpeed = Math.max(2, Math.floor(220 / Math.max(displayText.length, 1)));

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (isDeleting) {
          if (displayText.length > 0) {
            setDisplayText((prev) => prev.slice(0, -1));
          } else {
            setIsDeleting(false);
            if (loop && textArray.length > 1) {
              const nextIdx = (textArrayIndex + 1) % textArray.length;
              setTextArrayIndex(nextIdx);
              activeTargetRef.current = textArray[nextIdx];
            }
          }
        } else {
          if (displayText.length < currentTarget.length) {
            setDisplayText(currentTarget.slice(0, displayText.length + 1));
          } else if (loop) {
            setTimeout(() => setIsDeleting(true), delay);
          }
        }
      },
      isDeleting ? calcDeleteSpeed : calcSpeed
    );

    return () => clearTimeout(timeout);
  }, [
    displayText,
    isDeleting,
    calcSpeed,
    calcDeleteSpeed,
    delay,
    loop,
    textArray,
    textArrayIndex,
    currentTarget,
  ]);

  return (
    <span className={cn("inline-block", className)}>
      {displayText}
      {isWriting && (
        <span className="animate-pulse ml-0.5 opacity-90 transition-opacity duration-150">
          {cursor}
        </span>
      )}
    </span>
  );
}

export default Typewriter;
