"use client";

import Link from "next/link";
import { useGame } from "@/components/providers/GameProvider";
import { AppShell } from "@/components/layout/AppShell";
import { HUDHeader } from "@/components/layout/HUDHeader";
import { AttributeGrid } from "@/components/character/AttributeGrid";
import { QuestBoard } from "@/components/quests/QuestBoard";
import { GlowCard } from "@/components/ui/GlowCard";
import { Trophy } from "lucide-react";

export default function DashboardPage() {
  const { state } = useGame();
  const c = state.character;
  const active = state.quests.filter((q) => !q.is_completed).length;

  return (
    <AppShell>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-xs tracking-[0.3em] text-gold-300">ADVENTURER&apos;S HUB</p>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            Dashboard <span className="text-sm font-normal text-slate-400">· {active} active quests</span>
          </h1>
        </div>
        <Link href="/character" className="hidden rounded-rune border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 sm:block">
          Character Sheet
        </Link>
      </div>

      <div className="mt-4">
        <HUDHeader level={c.level} xp={c.xp} gold={c.gold} streak={c.current_streak} title={c.equipped_title} />
      </div>

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

      <QuestBoard />

      {state.achievements.length > 0 && (
        <GlowCard className="mt-6 flex items-center gap-3 p-4" aria-label="Recent achievements">
          <Trophy className="h-5 w-5 text-gold-400" aria-hidden="true" />
          <p className="text-sm">
            <span className="font-semibold text-gold-300">Feats unlocked:</span>{" "}
            {state.achievements.join(" · ")}
          </p>
        </GlowCard>
      )}
    </AppShell>
  );
}
