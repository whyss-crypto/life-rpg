"use client";

import { Dumbbell, Brain, Activity, BookOpen, Crosshair } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import type { AttributeKey } from "@/lib/game/attributes";

const ICONS: Record<AttributeKey, typeof Dumbbell> = {
  strength: Dumbbell,
  intellect: Brain,
  endurance: Activity,
  wisdom: BookOpen,
  focus: Crosshair,
};

const LABELS: Record<AttributeKey, string> = {
  strength: "Strength",
  intellect: "Intellect",
  endurance: "Endurance",
  wisdom: "Wisdom",
  focus: "Focus",
};

export function AttributeGrid({
  stats,
}: {
  stats: Record<AttributeKey, number>;
}) {
  const max = Math.max(10, ...Object.values(stats));
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5" role="list" aria-label="Character attributes">
      {(Object.keys(LABELS) as AttributeKey[]).map((key) => {
        const Icon = ICONS[key];
        const pct = Math.min(100, Math.round((stats[key] / max) * 100));
        return (
          <GlowCard key={key} className="p-3" role="listitem">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-gold-400" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-300">{LABELS[key]}</p>
            </div>
            <p className="font-display mt-1 text-2xl font-bold" aria-label={`${LABELS[key]} ${stats[key]}`}>
              {stats[key]}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/60" aria-hidden="true">
              <div
                className="h-full rounded-full bg-gradient-to-r from-arcane-500 to-gold-400"
                style={{ width: `${pct}%` }}
              />
            </div>
          </GlowCard>
        );
      })}
    </div>
  );
}
