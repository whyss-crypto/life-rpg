"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface ShopItem {
  id: string;
  name: string;
  type: string;
  rarity: string;
  price: number;
  description: string | null;
}

const RARITY_TICK: Record<string, string> = {
  common: "bg-fog-faint",
  rare: "bg-steel-400",
  epic: "bg-ember",
  legendary: "bg-gold-500",
};

export function ShopItemCard({
  item,
  owned,
  onBuy,
}: {
  item: ShopItem;
  owned: boolean;
  onBuy: () => Promise<{ ok: boolean; error?: string }>;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function buy() {
    if (owned || pending) return;
    setPending(true);
    setError("");
    const res = await onBuy();
    setPending(false);
    if (!res.ok) setError(res.error ?? "Purchase failed.");
  }

  return (
    <div className="grid gap-3 border-b hairline py-6 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8">
      <div>
        <p className="flex items-center gap-2.5">
          <span className={cn("h-3.5 w-[3px]", RARITY_TICK[item.rarity] ?? RARITY_TICK.common)} aria-hidden="true" />
          <span className="kicker !text-[10px] text-fog-faint">
            {item.rarity} · {item.type}
          </span>
        </p>
        <h3 className="font-display mt-2 text-xl font-bold text-ink">{item.name}</h3>
        <p className="mt-1 max-w-lg text-[15px] text-fog">
          {item.description ?? "A mysterious relic of the realm."}
        </p>
        {error && (
          <p role="alert" className="mt-2 text-sm text-blood">
            {error}
          </p>
        )}
      </div>
      <div className="flex items-center gap-5 sm:flex-col sm:items-end sm:gap-2">
        <p className="tnum text-lg font-semibold text-gold-400">{item.price} G</p>
        {owned ? (
          <span className="kicker !text-[10px] text-moss">In vault</span>
        ) : (
          <button
            onClick={() => void buy()}
            disabled={pending}
            className="press min-h-[44px] rounded-sharp border border-gold-500/50 px-5 text-sm font-semibold text-gold-400 transition hover:bg-gold-500 hover:text-black disabled:opacity-60"
            aria-label={`Acquire ${item.name} for ${item.price} gold`}
          >
            {pending ? "Sealing…" : "Acquire"}
          </button>
        )}
      </div>
    </div>
  );
}
