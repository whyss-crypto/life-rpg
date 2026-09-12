"use client";

import { useGame } from "@/components/providers/GameProvider";
import { AppShell } from "@/components/layout/AppShell";
import { HUDHeader } from "@/components/layout/HUDHeader";
import { InventoryVault } from "@/components/inventory/InventoryVault";

export default function InventoryPage() {
  const { state, equipTitle } = useGame();
  const c = state.character;
  return (
    <AppShell>
      <p className="font-display text-xs tracking-[0.3em] text-gold-300">INVENTORY VAULT</p>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">
        Your <span className="gold-text">Relics</span>
      </h1>
      <div className="mt-4">
        <HUDHeader level={c.level} xp={c.xp} gold={c.gold} streak={c.current_streak} title={c.equipped_title} />
      </div>
      <div className="mt-4">
        <InventoryVault
          owned={state.inventory}
          catalog={state.catalog}
          equippedTitle={c.equipped_title}
          onEquip={equipTitle}
        />
      </div>
    </AppShell>
  );
}
