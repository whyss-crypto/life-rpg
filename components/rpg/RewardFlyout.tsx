"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface Flyout {
  id: number;
  xp: number;
  gold: number;
}

export function RewardFlyouts({ items }: { items: Flyout[] }) {
  return (
    <div className="pointer-events-none fixed right-6 top-24 z-[80] flex flex-col gap-2" aria-hidden="true">
      <AnimatePresence>
        {items.map((f) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: -18, scale: 1 }}
            exit={{ opacity: 0, y: -42 }}
            transition={{ duration: 0.5 }}
            className="card-surface rounded-rune border-gold-400/40 px-4 py-2 text-sm font-semibold"
          >
            <span className="text-arcane-300">+{f.xp} XP</span>{" "}
            <span className="text-gold-400">+{f.gold} Gold</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function useFlyouts(): { items: Flyout[]; push: (xp: number, gold: number) => void } {
  const [items, setItems] = useState<Flyout[]>([]);
  useEffect(() => {
    if (items.length === 0) return;
    const t = setTimeout(() => setItems((s) => s.slice(1)), 2200);
    return () => clearTimeout(t);
  }, [items]);
  return {
    items,
    push: (xp, gold) => setItems((s) => [...s.slice(-2), { id: Date.now() + Math.random(), xp, gold }]),
  };
}
