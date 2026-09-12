"use client";

import { Flame, Trophy, Swords, Coins } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

export function CharacterHero({
  level,
  xp,
  gold,
  streak,
  best,
  totalQuests,
  achievements,
  title,
}: {
  level: number;
  xp: number;
  gold: number;
  streak: number;
  best: number;
  totalQuests: number;
  achievements: number;
  title?: string | null;
}) {
  const tiles = [
    { icon: Flame, label: "Streak", value: `${streak}d`, sub: `Best ${best}d` },
    { icon: Swords, label: "Quests", value: String(totalQuests), sub: "Completed" },
    { icon: Coins, label: "Gold", value: gold.toLocaleString(), sub: "Treasury" },
    { icon: Trophy, label: "Feats", value: String(achievements), sub: "Unlocked" },
  ];
  return (
    <GlowCard rarity="legendary" className="overflow-hidden p-6">
      <div className="flex flex-wrap items-center gap-5">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b from-gold-300 to-gold-700 font-display text-3xl font-bold text-black shadow-gold-glow"
          aria-hidden="true"
        >
          {level}
        </div>
        <div>
          <p className="font-display text-xs tracking-[0.3em] text-gold-300">THE ADVENTURER</p>
          <h1 className="font-display text-3xl font-bold">
            LEVEL <span className="gold-text">{level}</span>
          </h1>
          {title && <p className="text-sm text-arcane-300">«{title}»</p>}
          <p className="mt-1 text-sm text-slate-400">
            <AnimatedNumber value={xp} /> lifetime XP
          </p>
        </div>
        <div className="ml-auto grid grid-cols-2 gap-3 sm:grid-cols-4">
          {tiles.map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="min-w-[92px] rounded-rune border border-white/10 bg-black/30 px-3 py-2 text-center">
              <Icon className="mx-auto h-4 w-4 text-gold-400" aria-hidden="true" />
              <p className="mt-1 font-display text-lg font-bold">{value}</p>
              <p className="text-[11px] uppercase tracking-widest text-slate-400">
                {label} · {sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </GlowCard>
  );
}
