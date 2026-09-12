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
      <HUDHeader
        name={state.username}
        level={c.level}
        xp={c.xp}
        gold={c.gold}
        streak={c.current_streak}
        title={c.equipped_title}
      />
      <div className="mt-10">
        <QuestBoard />
      </div>
    </AppShell>
  );
}
