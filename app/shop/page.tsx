"use client";

import { useState } from "react";
import { Coins } from "lucide-react";
import { useGame } from "@/components/providers/GameProvider";
import { AppShell } from "@/components/layout/AppShell";
import { HUDHeader } from "@/components/layout/HUDHeader";
import { ShopItemCard } from "@/components/shop/ShopItemCard";
import { EmptyState } from "@/components/ui/primitives";

export default function ShopPage() {
  const { state, purchase } = useGame();
  const c = state.character;
  const [notice, setNotice] = useState("");

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker text-fog-faint">Armory</p>
          <h1 className="font-display mt-2 text-3xl font-bold text-ink sm:text-4xl">
            Spend glory.
          </h1>
        </div>
        <p className="tnum text-sm text-fog">
          Treasury — <span className="text-xl font-semibold text-gold-400">{c.gold.toLocaleString()} G</span>
        </p>
      </div>

      <div className="mt-6">
        <HUDHeader
          name={state.username}
          level={c.level}
          xp={c.xp}
          gold={c.gold}
          streak={c.current_streak}
          title={c.equipped_title}
        />
      </div>

      {notice && (
        <p role="status" className="border-b hairline py-3 text-sm text-gold-400">
          {notice}
        </p>
      )}

      {state.catalog.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Bare shelves."
            body="No relics are stocked yet. Run the database seed migration (004_seed_data.sql) to fill the armory."
          />
        </div>
      ) : (
        <div className="mt-8 border-t hairline">
          {state.catalog.map((item) => (
            <ShopItemCard
              key={item.id}
              item={item}
              owned={state.inventory.includes(item.id)}
              onBuy={async () => {
                const r = await purchase(item.id);
                if (r.ok) setNotice(`${item.name} acquired — it waits in your vault.`);
                return r;
              }}
            />
          ))}
        </div>
      )}

      <p className="mt-6 flex items-center gap-1.5 text-sm text-fog-faint">
        <Coins className="h-4 w-4" aria-hidden="true" />
        Every coin is earned on the board. Nothing here costs real money.
      </p>
    </AppShell>
  );
}
