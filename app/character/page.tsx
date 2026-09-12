"use client";

import { useGame } from "@/components/providers/GameProvider";
import { AppShell } from "@/components/layout/AppShell";
import { CharacterHero } from "@/components/character/CharacterHero";
import { AttributeGrid } from "@/components/character/AttributeGrid";
import { GlowCard } from "@/components/ui/GlowCard";
import { progressForXp } from "@/lib/game/levels";
import { XpProgressBar } from "@/components/rpg/XpProgressBar";

export default function CharacterPage() {
  const { state } = useGame();
  const c = state.character;
  const prog = progressForXp(c.xp);

  return (
    <AppShell>
      <p className="font-display text-xs tracking-[0.3em] text-gold-300">CHARACTER SANCTUM</p>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Character Sheet</h1>

      <div className="mt-4">
        <CharacterHero
          level={c.level}
          xp={c.xp}
          gold={c.gold}
          streak={c.current_streak}
          best={c.best_streak}
          totalQuests={state.totalQuests}
          achievements={state.achievements.length}
          title={c.equipped_title}
        />
      </div>

      <GlowCard className="mt-4 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300">
            {prog.xpIntoLevel.toLocaleString()} / {prog.xpForNext.toLocaleString()} XP to level {c.level + 1}
          </span>
          <span className="font-semibold text-gold-300">{Math.round(prog.progress * 100)}%</span>
        </div>
        <XpProgressBar progress={prog.progress} className="mt-2" />
      </GlowCard>

      <div className="mt-4">
        <AttributeGrid
          stats={{
            strength: c.strength,
            intellect: c.intellect,
            endurance: c.endurance,
            wisdom: c.wisdom,
            focus: c.focus,
          }}
        />
      </div>

      <GlowCard className="mt-4 p-4">
        <h2 className="font-display text-sm tracking-[0.25em] text-slate-200">MILESTONES</h2>
        <dl className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          <div><dt className="text-slate-500">Best streak</dt><dd className="font-semibold">{c.best_streak} days</dd></div>
          <div><dt className="text-slate-500">Quests done</dt><dd className="font-semibold">{state.totalQuests}</dd></div>
          <div><dt className="text-slate-500">Feats</dt><dd className="font-semibold">{state.achievements.length}</dd></div>
          <div><dt className="text-slate-500">Gold held</dt><dd className="font-semibold text-gold-300">{c.gold.toLocaleString()} G</dd></div>
        </dl>
      </GlowCard>
    </AppShell>
  );
}
