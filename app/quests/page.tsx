"use client";

import { useGame } from "@/components/providers/GameProvider";
import { AppShell } from "@/components/layout/AppShell";
import { QuestBoard } from "@/components/quests/QuestBoard";
import { HUDHeader } from "@/components/layout/HUDHeader";

export default function QuestsPage() {
  const { state } = useGame();
  const c = state.character;
  return (
    <AppShell>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">
        Quest <span className="gold-text">Log</span>
      </h1>
      <p className="mt-1 text-sm text-slate-400">Every mission. Every reward. Nothing escapes the log.</p>
      <div className="mt-4">
        <HUDHeader level={c.level} xp={c.xp} gold={c.gold} streak={c.current_streak} title={c.equipped_title} />
      </div>
      <QuestBoard />
    </AppShell>
  );
}
