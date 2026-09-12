"use client";

import { useGame } from "@/components/providers/GameProvider";
import { AppShell } from "@/components/layout/AppShell";
import { ACHIEVEMENT_RULES } from "@/lib/game/achievements";
import { cn } from "@/lib/utils";

export default function AchievementsPage() {
  const { state } = useGame();
  const owned = new Set(state.achievements);
  return (
    <AppShell>
      <p className="kicker text-fog-faint">Hall of feats</p>
      <h1 className="font-display mt-2 text-3xl font-bold text-ink sm:text-4xl">
        Feats{" "}
        <span className="tnum align-middle text-base font-normal text-fog-faint">
          {owned.size}/{ACHIEVEMENT_RULES.length}
        </span>
      </h1>
      <ul className="mt-8 border-t hairline">
        {ACHIEVEMENT_RULES.map((a) => {
          const has = owned.has(a.name);
          return (
            <li
              key={a.name}
              className={cn("grid grid-cols-[2rem_1fr] gap-4 border-b hairline py-5", !has && "opacity-55")}
            >
              <span
                className={cn("tnum pt-0.5 font-display text-sm", has ? "text-gold-400" : "text-fog-faint")}
                aria-hidden="true"
              >
                {has ? "◆" : "◇"}
              </span>
              <div>
                <h2 className="font-display text-base font-bold tracking-[0.14em] text-ink">{a.name}</h2>
                <p className="mt-0.5 text-[15px] text-fog">{a.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
