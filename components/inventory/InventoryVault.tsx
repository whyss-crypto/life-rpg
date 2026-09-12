"use client";

import { Backpack } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import { EmptyState } from "@/components/ui/primitives";
import type { DemoItem } from "@/components/providers/GameProvider";

export function InventoryVault({
  owned,
  catalog,
  equippedTitle,
  onEquip,
}: {
  owned: string[];
  catalog: DemoItem[];
  equippedTitle: string | null;
  onEquip: (name: string | null) => void;
}) {
  const items = catalog.filter((c) => owned.includes(c.id));
  if (items.length === 0) {
    return (
      <EmptyState
        title="NOTHING UNLOCKED YET."
        body="Complete quests and spend your gold in the Armory to build your collection."
      />
    );
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const equipped = item.type === "title" && equippedTitle === item.name;
        return (
          <GlowCard key={item.id} className="p-4">
            <div className="flex items-center gap-2 text-slate-300">
              <Backpack className="h-4 w-4 text-gold-400" aria-hidden="true" />
              <span className="text-xs uppercase tracking-widest text-slate-500">{item.type}</span>
            </div>
            <h3 className="font-display mt-1 text-lg font-bold">{item.name}</h3>
            <p className="text-sm text-slate-400">{item.description}</p>
            {item.type === "title" && (
              <button
                onClick={() => onEquip(equipped ? null : item.name)}
                className={
                  equipped
                    ? "mt-3 min-h-[40px] w-full rounded-rune bg-emerald-500/15 text-sm font-semibold text-emerald-300"
                    : "mt-3 min-h-[40px] w-full rounded-rune bg-white/5 text-sm font-semibold text-slate-200 hover:bg-white/10"
                }
                aria-pressed={equipped}
                aria-label={equipped ? `Unequip ${item.name}` : `Equip ${item.name}`}
              >
                {equipped ? "Active Title" : "Equip Title"}
              </button>
            )}
          </GlowCard>
        );
      })}
    </div>
  );
}
