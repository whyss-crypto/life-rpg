"use client";

import { Lock, Check } from "lucide-react";
import { useGame } from "@/components/providers/GameProvider";
import { AppShell } from "@/components/layout/AppShell";
import { GlowCard } from "@/components/ui/GlowCard";
import { ACHIEVEMENT_RULES } from "@/lib/game/achievements";

export default function AchievementsPage() {
  const { state } = useGame();
  const owned = new Set(state.achievements);
  return (
    <AppShell>
      <p className="font-display text-xs tracking-[0.3em] text-gold-300">HALL OF FEATS</p>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">
        Achievements <span className="text-base font-normal text-slate-400">· {owned.size}/{ACHIEVEMENT_RULES.length}</span>
      </h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {ACHIEVEMENT_RULES.map((a) => {
          const has = owned.has(a.name);
          return (
            <GlowCard key={a.name} rarity={has ? "legendary" : "common"} className="flex items-center gap-3 p-4">
              <span
                className={
                  has
                    ? "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-b from-gold-300 to-gold-700 text-black"
                    : "flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-500"
                }
                aria-hidden="true"
              >
                {has ? <Check className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
              </span>
              <div>
                <h2 className="font-display text-sm tracking-widest">{a.name}</h2>
                <p className="text-sm text-slate-400">{a.description}</p>
              </div>
            </GlowCard>
          );
        })}
      </div>
    </AppShell>
  );
}
