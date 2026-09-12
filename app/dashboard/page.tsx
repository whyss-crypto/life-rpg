"use client";

import { useGame } from "@/components/providers/GameProvider";
import { AppShell } from "@/components/layout/AppShell";
import { HUDHeader } from "@/components/layout/HUDHeader";
import { AttributeGrid } from "@/components/character/AttributeGrid";
import { QuestBoard } from "@/components/quests/QuestBoard";

export default function DashboardPage() {
  const { state } = useGame();
  const c = state.character;
  const active = state.quests.filter((q) => !q.is_completed).length;

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

      <section className="mt-10" aria-label="Attributes">
        <h2 className="kicker text-fog-faint">Attributes</h2>
        <div className="mt-2">
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
      </section>

      <div className="mt-10">
        <QuestBoard />
      </div>

      {state.achievements.length > 0 && (
        <p className="mt-10 border-t hairline pt-5 text-sm text-fog" aria-label="Recent feats">
          <span className="kicker mr-3 !text-[10px] text-fog-faint">Feats</span>
          {state.achievements.join(" · ")}
          <span className="text-fog-faint"> · {active} quest{active === 1 ? "" : "s"} open</span>
        </p>
      )}
    </AppShell>
  );
}
