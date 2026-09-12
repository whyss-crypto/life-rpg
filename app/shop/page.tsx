"use client";

import { useState } from "react";
import { Coins } from "lucide-react";
import { useGame, DEMO_SHOP } from "@/components/providers/GameProvider";
import { AppShell } from "@/components/layout/AppShell";
import { HUDHeader } from "@/components/layout/HUDHeader";
import { ShopItemCard } from "@/components/shop/ShopItemCard";

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

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_SHOP.map((item) => (
          <ShopItemCard
            key={item.id}
            item={item}
            owned={state.inventory.includes(item.id)}
            onBuy={async () => {
              // Try authoritative server purchase first; fall back to demo store.
              try {
                const { purchaseItemAction } = await import("@/app/actions/shop");
                const res = await purchaseItemAction(item.id);
                if (res.ok) {
                  setNotice(`${item.name} acquired!`);
                  purchase(item.id);
                  return { ok: true as const };
                }
                if (res.error && !res.error.startsWith("Demo mode")) {
                  return { ok: false as const, error: res.error };
                }
              } catch {}
              const local = purchase(item.id);
              if (local.ok) setNotice(`${item.name} acquired! Check your Vault.`);
              return local;
            }}
          />
        ))}
      </div>
    </AppShell>
  );
}
