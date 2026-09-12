"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/primitives";

/**
 * Level-up, restrained: a quiet veil, a long beat, the numeral turns.
 * No confetti, no explosion. Anticipation does the work.
 */
export function LevelUpModal({
  open,
  oldLevel,
  newLevel,
  detail,
  onClose,
}: {
  open: boolean;
  oldLevel: number;
  newLevel: number;
  detail?: string;
  onClose: () => void;
}) {
  const numeralRef = useRef<HTMLParagraphElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open || reduce) return;
    let cancelled = false;
    (async () => {
      try {
        const { gsap } = await import("gsap");
        if (cancelled) return;
        // Beat of quiet, then the numeral turns over.
        gsap.fromTo(
          numeralRef.current,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.9, delay: 0.55, ease: "power3.out" }
        );
        gsap.fromTo(
          ruleRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, delay: 0.7, ease: "power3.inOut" }
        );
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [open, reduce]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5 } }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          role="dialog"
          aria-modal="true"
          aria-label={`Level up to level ${newLevel}`}
        >
          <div className="w-full max-w-md text-center">
            <p className="kicker text-fog-faint">Level</p>
            <p
              ref={numeralRef}
              className="display-num mt-4 text-8xl font-bold leading-none text-ink sm:text-9xl"
            >
              {newLevel}
            </p>
            <div ref={ruleRef} className="mx-auto mt-6 h-px w-40 bg-gold-500/70" aria-hidden="true" />
            <p className="mt-6 text-[15px] text-fog">
              {oldLevel} is behind you{detail ? ` — ${detail}` : ". Attributes sharpened."}
            </p>
            <div aria-live="polite" className="sr-only">
              Level up. You are now level {newLevel}.
            </div>
            <Button variant="ghost" onClick={onClose} className="mt-8 min-w-[220px]" autoFocus>
              Return to the board
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
