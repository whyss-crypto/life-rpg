"use client";

import { useState } from "react";
import { Coins, Loader2, Check } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/utils";

export interface ShopItem {
  id: string;
  name: string;
  type: string;
  rarity: string;
  price: number;
  description: string | null;
}

const RARITY_STYLE: Record<string, string> = {
  common: "text-slate-300 border-white/15",
  rare: "text-mana border-mana/40",
  epic: "text-arcane-300 border-arcane-400/50",
  legendary: "text-gold-300 border-gold-400/60",
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
    <GlowCard
      rarity={(item.rarity as "common" | "rare" | "epic" | "legendary") ?? "common"}
      className="flex flex-col p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest", RARITY_STYLE[item.rarity] ?? RARITY_STYLE.common)}>
          {item.rarity}
        </span>
        <span className="text-[11px] uppercase tracking-widest text-slate-500">{item.type}</span>
      </div>
      <h3 className="font-display mt-2 text-lg font-bold">{item.name}</h3>
      <p className="mt-1 min-h-[40px] text-sm text-slate-400">{item.description ?? "A mysterious relic of the realm."}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-semibold text-gold-300">
          <Coins className="h-4 w-4" aria-hidden="true" /> {item.price} G
        </span>
        {owned ? (
          <span className="flex items-center gap-1 text-sm text-emerald-300">
            <Check className="h-4 w-4" aria-hidden="true" /> Owned
          </span>
        ) : (
          <button
            onClick={() => void buy()}
            disabled={pending}
            className="min-h-[40px] rounded-rune bg-gradient-to-b from-gold-300 to-gold-600 px-4 text-sm font-semibold text-black hover:brightness-110 disabled:opacity-60"
            aria-label={`Buy ${item.name} for ${item.price} gold`}
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : "Acquire"}
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-xs text-blood">
          {error}
        </p>
      )}
    </GlowCard>
  );
}
