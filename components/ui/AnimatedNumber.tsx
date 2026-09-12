"use client";

import { useEffect, useRef, useState } from "react";

function useAnimatedCounter(target: number, duration = 900): number {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(target);
      fromRef.current = target;
      return;
    }
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  // keep ref in sync when target set externally without animation frame
  useEffect(() => {
    if (value === target) fromRef.current = target;
  }, [value, target]);

  return value;
}

export function AnimatedNumber({
  value,
  className,
  ariaLabel,
}: {
  value: number;
  className?: string;
  ariaLabel?: string;
}) {
  const animated = useAnimatedCounter(value);
  return (
    <span className={className} aria-label={ariaLabel ?? String(value)}>
      {animated.toLocaleString("en-US")}
    </span>
  );
}
