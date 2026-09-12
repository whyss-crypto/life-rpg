"use client";

import { useEffect, useRef } from "react";

export function XpProgressBar({ progress, className = "" }: { progress: number; className?: string }) {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    const pct = `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%`;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.width = pct;
      return;
    }
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
      className={`h-[3px] overflow-hidden rounded-full bg-white/[0.08] ${className}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-label="Experience progress to next level"
    >
      <div ref={fillRef} className="h-full rounded-full bg-gold-500" style={{ width: "0%" }} />
    </div>
  );
}
