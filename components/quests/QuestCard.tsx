"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import type { DemoQuest } from "@/components/providers/GameProvider";
import { cn } from "@/lib/utils";

const ATTR_LABEL: Record<string, string> = {
  strength: "Strength",
  intellect: "Intellect",
  endurance: "Endurance",
  wisdom: "Wisdom",
  focus: "Focus",
};

export function QuestCard({
  quest,
  index,
  onComplete,
  onDelete,
  pending,
}: {
  quest: DemoQuest;
  index: number;
  onComplete: (source: HTMLElement) => void;
  onDelete: () => void;
  pending: boolean;
}) {
  const done = quest.is_completed;
  const [confirming, setConfirming] = useState(false);
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group grid grid-cols-[2rem_1fr] gap-3 border-b hairline py-5 transition-colors sm:grid-cols-[2.5rem_1fr_auto] sm:gap-5",
        !done && "hover:bg-white/[0.018]"
      )}
    >
      <span
        className={cn(
          "tnum pt-1 text-sm",
          done ? "text-moss" : "text-fog-faint"
        )}
        aria-hidden="true"
      >
        {done ? <Check className="h-4 w-4" /> : String(index + 1).padStart(2, "0")}
      </span>

      <div className="min-w-0">
        <h3
          className={cn(
            "text-lg font-semibold leading-snug",
            done ? "text-fog-faint line-through" : "text-ink"
          )}
        >
          {quest.title}
        </h3>
        {quest.description && (
          <p className={cn("mt-1 text-[15px] leading-relaxed", done ? "text-fog-faint" : "text-fog")}>
            {quest.description}
          </p>
        )}
        <p className="kicker mt-2.5 !text-[10px] !tracking-[0.22em] text-fog-faint">
          {ATTR_LABEL[quest.attribute_reward] ?? quest.attribute_reward} · {quest.difficulty}
          {done && quest.attribute_points > 0 && (
            <span className="ml-2 text-steel-300">+{quest.attribute_points}</span>
          )}
        </p>
        {!done && (
          <button
            onClick={() => {
              if (confirming) {
                onDelete();
              } else {
                setConfirming(true);
                window.setTimeout(() => setConfirming(false), 2600);
              }
            }}
            className="mt-2 text-xs text-fog-faint opacity-0 transition hover:text-blood focus-visible:opacity-100 group-hover:opacity-100"
            aria-label={confirming ? `Confirm abandoning ${quest.title}` : `Abandon ${quest.title}`}
          >
            {confirming ? "Confirm abandon?" : "Abandon"}
          </button>
        )}
      </div>

      <div className="col-span-2 flex items-center justify-between gap-4 pl-11 sm:col-span-1 sm:flex-col sm:items-end sm:justify-center sm:pl-0">
        <p className={cn("tnum text-sm font-semibold", done ? "text-fog-faint" : "text-ink")}>
          +{quest.xp_reward} XP
          <span className={cn("ml-3", done ? "text-fog-faint" : "text-gold-400")}>
            +{quest.gold_reward} G
          </span>
        </p>
        {done ? (
          <span className="kicker !text-[10px] text-moss">Done</span>
        ) : (
          <button
            onClick={(e) => onComplete(e.currentTarget)}
            disabled={pending}
            aria-label={pending ? "Completing quest" : `Complete ${quest.title}`}
            className="press inline-flex min-h-[44px] items-center gap-1.5 rounded-sharp border border-gold-500/50 px-4 text-sm font-semibold text-gold-400 transition hover:bg-gold-500 hover:text-black disabled:opacity-60"
          >
            {pending ? "Sealing…" : <>Complete <ArrowRight className="h-4 w-4" aria-hidden="true" /></>}
          </button>
        )}
      </div>
    </motion.li>
  );
}
