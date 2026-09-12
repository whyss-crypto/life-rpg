"use client";

import Link from "next/link";
import { useGame } from "@/components/providers/GameProvider";
import { AppShell } from "@/components/layout/AppShell";
import { HUDHeader } from "@/components/layout/HUDHeader";
import { AttributeGrid } from "@/components/character/AttributeGrid";

/**
 * The character sheet: name, level, rule, attributes, record.
 * One column. Nothing competes with the character.
 */
export default function CharacterPage() {
  const { state } = useGame();
  const c = state.character;

  const record: Array<[string, string]> = [
    ["Quests sealed", String(state.totalQuests)],
    ["Best streak", `${c.best_streak} day${c.best_streak === 1 ? "" : "s"}`],
    ["Feats held", String(state.achievements.length)],
    ["Gold in hand", `${c.gold.toLocaleString()} G`],
  ];

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

      <section className="mt-10" aria-label="Record">
        <h2 className="kicker text-fog-faint">Record</h2>
        <dl className="mt-2 border-t hairline">
          {record.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between border-b hairline py-3.5">
              <dt className="text-[15px] text-fog">{k}</dt>
              <dd className="tnum text-[15px] font-semibold text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {state.achievements.length > 0 && (
        <section className="mt-10" aria-label="Feats">
          <h2 className="kicker text-fog-faint">Feats</h2>
          <ul className="mt-2 border-t hairline">
            {state.achievements.map((a) => (
              <li key={a} className="border-b hairline py-3.5 font-display text-sm tracking-[0.18em] text-ink">
                {a}
              </li>
            ))}
          </ul>
          <Link href="/achievements" className="press mt-4 inline-block text-sm text-fog hover:text-ink">
            Full hall of feats →
          </Link>
        </section>
      )}
    </AppShell>
  );
}
