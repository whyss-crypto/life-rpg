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
      <p className="kicker text-fog-faint">Inventory vault</p>
      <h1 className="font-display mt-2 text-3xl font-bold text-ink sm:text-4xl">
        Relics
      </h1>
      <div className="mt-6">
        <HUDHeader name={state.username} level={c.level} xp={c.xp} gold={c.gold} streak={c.current_streak} title={c.equipped_title} />
      </div>
      <div className="mt-8">
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
