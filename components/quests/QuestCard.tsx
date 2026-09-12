"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Trash2, Loader2 } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import type { DemoQuest } from "@/components/providers/GameProvider";
import { cn } from "@/lib/utils";

const DIFF_STYLE: Record<string, string> = {
  easy: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10",
  normal: "text-arcane-300 border-arcane-400/30 bg-arcane-500/10",
  hard: "text-orange-300 border-orange-400/30 bg-orange-400/10",
  epic: "text-gold-300 border-gold-400/40 bg-gold-500/10",
};

const RARITY: Record<string, "common" | "rare" | "epic" | "legendary"> = {
  easy: "common",
  normal: "rare",
  hard: "epic",
  epic: "legendary",
};

export function QuestCard({
  quest,
  onComplete,
  onDelete,
  pending,
}: {
  quest: DemoQuest;
  onComplete: () => void;
  onDelete: () => void;
  pending: boolean;
}) {
  const [confirming, setConfirming] = useState(false);
  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <GlowCard rarity={RARITY[quest.difficulty] ?? "common"} className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className={cn("font-semibold", quest.is_completed && "text-slate-400 line-through")}>
              {quest.title}
            </h3>
            {quest.description && <p className="mt-1 text-sm text-slate-400">{quest.description}</p>}
          </div>
          <button
            onClick={() => {
              if (confirming) onDelete();
              else {
                setConfirming(true);
                setTimeout(() => setConfirming(false), 2500);
              }
            }}
            className="rounded p-2 text-slate-500 hover:bg-white/5 hover:text-blood"
            aria-label={confirming ? `Confirm delete ${quest.title}` : `Delete ${quest.title}`}
            title="Delete quest"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        {confirming && <p className="mt-1 text-xs text-blood">Tap again to abandon this quest.</p>}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className={cn("rounded-full border px-2.5 py-1 font-semibold uppercase tracking-wider", DIFF_STYLE[quest.difficulty])}>
            {quest.difficulty}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 uppercase tracking-wider text-slate-300">
            {quest.category} → {quest.attribute_reward}
          </span>
          <span className="ml-auto font-semibold text-arcane-300">+{quest.xp_reward} XP</span>
          <span className="font-semibold text-gold-400">+{quest.gold_reward} G</span>
        </div>
        <button
          onClick={onComplete}
          disabled={quest.is_completed || pending}
          className={cn(
            "mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-rune text-sm font-semibold transition active:scale-[0.98]",
            quest.is_completed
              ? "cursor-default bg-emerald-500/15 text-emerald-300"
              : "bg-gradient-to-b from-gold-300 to-gold-600 text-black hover:brightness-110 shadow-gold-glow"
          )}
          aria-label={quest.is_completed ? `${quest.title} completed` : `Complete ${quest.title}`}
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : quest.is_completed ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" /> Quest Complete
            </>
          ) : (
            "Complete Quest"
          )}
        </button>
      </GlowCard>
    </motion.div>
  );
}
