"use client";

import React, { useCallback } from "react";
import { cn } from "@/lib/utils";

export function GlowCard({
  children,
  className,
  rarity,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  rarity?: "common" | "rare" | "epic" | "legendary";
} & React.HTMLAttributes<HTMLDivElement>) {
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);

  const ring =
    rarity === "legendary"
      ? "border-gold-400/60 shadow-gold-glow"
      : rarity === "epic"
        ? "border-arcane-400/50"
        : rarity === "rare"
          ? "border-mana/40"
          : "border-white/10";

  return (
    <div
      onMouseMove={onMove}
      className={cn("glow-card card-surface rounded-rune border", ring, className)}
      {...rest}
    >
      {children}
    </div>
  );
}
