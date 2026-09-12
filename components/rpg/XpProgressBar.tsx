"use client";

import { useEffect, useRef } from "react";

export function XpProgressBar({ progress, className = "" }: { progress: number; className?: string }) {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pct = `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%`;
    if (reduced) {
      el.style.width = pct;
      return;
    }
    // GSAP if available, else CSS transition
    (async () => {
      try {
        const { gsap } = await import("gsap");
        gsap.to(el, { width: pct, duration: 0.9, ease: "power3.out" });
      } catch {
        el.style.width = pct;
      }
    })();
  }, [progress]);

  return (
    <div
      className={`h-2.5 overflow-hidden rounded-full bg-black/60 ring-1 ring-white/10 ${className}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-label="XP progress to next level"
    >
      <div
        ref={fillRef}
        className="h-full rounded-full bg-gradient-to-r from-arcane-500 via-gold-400 to-gold-300"
        style={{ width: "0%" }}
      />
    </div>
  );
}
