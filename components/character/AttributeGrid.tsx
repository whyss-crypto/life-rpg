"use client";

import { Dumbbell, Brain, Activity, BookOpen, Crosshair } from "lucide-react";
import type { AttributeKey } from "@/lib/game/attributes";

const ROWS: Array<{ key: AttributeKey; abbr: string; label: string; icon: typeof Dumbbell }> = [
  { key: "strength", abbr: "STR", label: "Strength", icon: Dumbbell },
  { key: "intellect", abbr: "INT", label: "Intellect", icon: Brain },
  { key: "endurance", abbr: "END", label: "Endurance", icon: Activity },
  { key: "wisdom", abbr: "WIS", label: "Wisdom", icon: BookOpen },
  { key: "focus", abbr: "FOC", label: "Focus", icon: Crosshair },
];

/**
 * Attribute ledger — reads like a character sheet, not a KPI dashboard.
 */
export function AttributeGrid({ stats }: { stats: Record<AttributeKey, number> }) {
  const max = Math.max(10, ...Object.values(stats));
  return (
    <div role="list" aria-label="Character attributes" className="border-t hairline">
      {ROWS.map(({ key, abbr, label, icon: Icon }) => {
        const pct = Math.min(100, Math.round((stats[key] / max) * 100));
        return (
          <div
            key={key}
            role="listitem"
            className="grid grid-cols-[auto_1fr_auto] items-baseline gap-4 border-b hairline py-3.5"
          >
            <p className="flex items-center gap-2.5 text-sm text-fog">
              <Icon className="h-4 w-4 text-fog-faint" strokeWidth={1.75} aria-hidden="true" />
              <span className="tnum w-8 text-xs tracking-[0.18em]">{abbr}</span>
              <span className="hidden sm:inline">{label}</span>
            </p>
            <div className="h-[2px] overflow-hidden rounded-full bg-white/[0.07]" aria-hidden="true">
              <div className="h-full rounded-full bg-steel-400/80" style={{ width: `${pct}%` }} />
            </div>
            <p
              className="display-num tnum w-10 text-right text-xl font-bold text-ink"
              aria-label={`${label} ${stats[key]}`}
            >
              {stats[key]}
            </p>
          </div>
        );
      })}
    </div>
  );
}
