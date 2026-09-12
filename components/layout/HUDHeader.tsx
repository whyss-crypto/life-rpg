"use client";

import { Flame, Coins, Star } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { XpProgressBar } from "@/components/rpg/XpProgressBar";
import { progressForXp } from "@/lib/game/levels";

export function HUDHeader({
  level,
  xp,
  gold,
  streak,
  title,
}: {
  level: number;
  xp: number;
  gold: number;
  streak: number;
  title?: string | null;
}) {
  const prog = progressForXp(xp);
  return (
    <header className="card-surface rounded-rune flex flex-wrap items-center gap-x-6 gap-y-3 border-white/10 p-4" aria-label="Character status">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-gold-300 to-gold-700 font-display text-xl font-bold text-black shadow-gold-glow" aria-hidden="true">
          {level}
        </span>
        <div>
          <p className="font-display text-sm tracking-[0.25em] text-gold-300">LEVEL {level}</p>
          {title && <p className="text-xs text-arcane-300">«{title}»</p>}
          <p className="text-xs text-slate-400" aria-live="polite">
            <AnimatedNumber value={prog.xpIntoLevel} /> / {prog.xpForNext.toLocaleString()} XP
          </p>
        </div>
      </div>
      <div className="min-w-[160px] flex-1">
        <XpProgressBar progress={prog.progress} />
      </div>
      <div className="flex items-center gap-5 text-sm">
        <span className="flex items-center gap-1.5" title="Gold">
          <Coins className="h-4 w-4 text-gold-400" aria-hidden="true" />
          <AnimatedNumber value={gold} className="font-semibold text-gold-300" ariaLabel={`${gold} gold`} />
        </span>
        <span className="flex items-center gap-1.5" title="Streak">
          <Flame className="h-4 w-4 text-orange-400" aria-hidden="true" />
          <span aria-live="polite">{streak} day{streak === 1 ? "" : "s"}</span>
        </span>
        <span className="hidden items-center gap-1.5 sm:flex" title="Total XP">
          <Star className="h-4 w-4 text-arcane-300" aria-hidden="true" />
          <AnimatedNumber value={xp} className="text-slate-200" ariaLabel={`${xp} total experience`} />
        </span>
      </div>
    </header>
  );
}
