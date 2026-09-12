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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-xs tracking-[0.3em] text-gold-300">ARMORY & SHOP</p>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            Spend Glory. <span className="gold-text">Become Legend.</span>
          </h1>
        </div>
        <p className="flex items-center gap-2 rounded-rune border border-gold-400/30 bg-gold-500/10 px-4 py-2 text-sm font-semibold text-gold-300">
          <Coins className="h-4 w-4" aria-hidden="true" /> {c.gold.toLocaleString()} Gold
        </p>
      </div>

      <div className="mt-4">
        <HUDHeader level={c.level} xp={c.xp} gold={c.gold} streak={c.current_streak} title={c.equipped_title} />
      </div>

      {notice && (
        <p role="status" className="mt-4 rounded-rune border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          {notice}
        </p>
      )}

      {state.catalog.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="THE ARMORY IS EMPTY."
            body="No relics are stocked yet. Run the database seed migration (004_seed_data.sql) to fill the shelves."
          />
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {state.catalog.map((item) => (
            <ShopItemCard
              key={item.id}
              item={item}
              owned={state.inventory.includes(item.id)}
              onBuy={async () => {
                const r = await purchase(item.id);
                if (r.ok) setNotice(`${item.name} acquired! Check your Vault.`);
                return r;
              }}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}
