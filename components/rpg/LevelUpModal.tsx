"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/primitives";

export function LevelUpModal({
  open,
  oldLevel,
  newLevel,
  onClose,
}: {
  open: boolean;
  oldLevel: number;
  newLevel: number;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let cancelled = false;
    (async () => {
      try {
        const confetti = (await import("canvas-confetti")).default;
        if (cancelled) return;
        const end = Date.now() + 900;
        const colors = ["#f5b942", "#ffe9a8", "#6e8fff", "#5eead4"];
        (function frame() {
          confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0 }, colors });
          confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 }, colors });
          if (Date.now() < end && !cancelled) requestAnimationFrame(frame);
        })();
        confetti({ particleCount: 160, spread: 100, origin: { y: 0.4 }, colors });
      } catch {}
      try {
        const { gsap } = await import("gsap");
        if (!cancelled) {
          gsap.fromTo(
            "[data-level-banner]",
            { scale: 0.7, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.6)" }
          );
        }
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [open ]);

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
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={`Level up to level ${newLevel}`}
        >
          <motion.div
            data-level-banner
            initial={{ y: 24, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            className="card-surface glow-card w-full max-w-md rounded-rune border-gold-400/50 p-8 text-center shadow-gold-glow"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-gold-300 to-gold-700 shadow-gold-glow">
              <Crown className="h-8 w-8 text-black" aria-hidden="true" />
            </div>
            <p className="font-display text-sm tracking-[0.3em] text-gold-300">LEVEL UP</p>
            <p className="font-display mt-2 text-5xl font-bold">
              <span className="text-slate-400 line-through decoration-blood/70 text-3xl">{oldLevel}</span>{" "}
              <span className="gold-text">→ {newLevel}</span>
            </p>
            <p className="mt-3 text-sm text-slate-300">
              Your discipline forged a stronger self. Attributes boosted. The board awaits your next quest.
            </p>
            <div aria-live="polite" className="sr-only">
              Level up! You are now level {newLevel}.
            </div>
            <Button onClick={onClose} className="mt-6 w-full" autoFocus>
              Continue the Journey
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
