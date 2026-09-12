"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useGame } from "@/components/providers/GameProvider";
import { QuestCard } from "./QuestCard";
import { CreateQuestModal } from "./CreateQuestModal";
import { LevelUpModal } from "@/components/rpg/LevelUpModal";
import { flyToken, hudTarget, pulseHud, prefersReducedMotion } from "@/components/rpg/flight";
import { Button } from "@/components/ui/primitives";
import { EmptyState } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const FILTERS = ["all", "active", "completed", "strength", "intellect", "endurance", "wisdom", "focus"] as const;

const ATTR_LABEL: Record<string, string> = {
  strength: "Strength",
  intellect: "Intellect",
  endurance: "Endurance",
  wisdom: "Wisdom",
  focus: "Focus",
};

export function QuestBoard({ onStats }: { onStats?: (s: { levelUp: { old: number; next: number } | null }) => void }) {
  const { state, createQuest, removeQuest, completeQuest } = useGame();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [modal, setModal] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [levelUp, setLevelUp] = useState<{ old: number; next: number; detail?: string } | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const quests = useMemo(() => {
    return state.quests.filter((q) => {
      if (filter === "all") return true;
      if (filter === "active") return !q.is_completed;
      if (filter === "completed") return q.is_completed;
      return q.attribute_reward === filter;
    });
  }, [state.quests, filter]);

  async function handleCreate(q: { title: string; description: string; category: string; difficulty: "easy" | "normal" | "hard" | "epic" }) {
    setError("");
    const r = await createQuest(q);
    if (!r.ok) setError(r.error ?? "Could not create quest. Try again.");
  }

  async function handleDelete(id: string) {
    setError("");
    const r = await removeQuest(id);
    if (!r.ok) setError(r.error ?? "Could not abandon quest.");
  }

  async function handleComplete(id: string, source: HTMLElement) {
    if (pendingId) return;
    setPendingId(id);
    setNotice("");
    setError("");
    await new Promise((r) => setTimeout(r, 120));
    const sourceRect = source.getBoundingClientRect();
    const res = await completeQuest(id);
    setPendingId(null);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    // Signature moment: rewards leave the quest and travel to the HUD.
    const xpTo = hudTarget("xp");
    const goldTo = hudTarget("gold");
    if (!prefersReducedMotion() && xpTo && goldTo) {
      await Promise.all([
        flyToken({ from: sourceRect, to: xpTo, label: `+${res.xpGained} XP`, tone: "ivory" }),
        flyToken({ from: sourceRect, to: goldTo, label: `+${res.goldGained} G`, tone: "gold", delay: 0.12 }),
      ]);
      await Promise.all([pulseHud("xp"), pulseHud("gold")]);
    }
    if (res.levelUp) {
      setLevelUp({
        old: res.oldLevel,
        next: res.newLevel,
        detail: `+${res.attributePoints} ${ATTR_LABEL[res.attribute] ?? res.attribute}`,
      });
    }
    if (res.achievements.length > 0) {
      setNotice(`Feat unlocked — ${res.achievements.join(", ")}`);
    }
    onStats?.({ levelUp: res.levelUp ? { old: res.oldLevel, next: res.newLevel } : null });
  }

  return (
    <section aria-label="Quest board">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="kicker text-fog-faint">Today&apos;s quests</h2>
        <button
          onClick={() => setModal(true)}
          className="press inline-flex min-h-[40px] items-center gap-1.5 text-sm font-semibold text-ink hover:text-gold-400"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> New quest
        </button>
      </div>

      <div className="mb-2 flex gap-5 overflow-x-auto border-b hairline" role="tablist" aria-label="Filter quests">
        {FILTERS.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              "relative min-h-[44px] shrink-0 pb-3 text-[13px] capitalize transition",
              filter === f ? "text-ink" : "text-fog-faint hover:text-fog"
            )}
          >
            {f}
            {filter === f && <span className="absolute inset-x-0 -bottom-px h-[2px] bg-gold-500" aria-hidden="true" />}
          </button>
        ))}
      </div>

      <div aria-live="polite" className="sr-only">
        {quests.filter((q) => !q.is_completed).length} active quests.
      </div>
      {notice && (
        <p role="status" className="border-b hairline py-3 text-sm text-gold-400">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="border-b hairline py-3 text-sm text-blood">
          {error}
        </p>
      )}

      {quests.length === 0 ? (
        <EmptyState
          title="A quiet board."
          body="Every campaign starts with a first quest. Write one worth completing."
          action={
            <Button variant="ghost" onClick={() => setModal(true)} className="mt-2">
              <Plus className="h-4 w-4" aria-hidden="true" /> New quest
            </Button>
          }
        />
      ) : (
        <ol>
          {quests.map((q, i) => (
            <QuestCard
              key={q.id}
              quest={q}
              index={i}
              pending={pendingId === q.id}
              onComplete={(el) => void handleComplete(q.id, el)}
              onDelete={() => void handleDelete(q.id)}
            />
          ))}
        </ol>
      )}

      <CreateQuestModal open={modal} onClose={() => setModal(false)} onCreate={(q) => void handleCreate(q)} />
      <LevelUpModal
        open={!!levelUp}
        oldLevel={levelUp?.old ?? 1}
        newLevel={levelUp?.next ?? 1}
        detail={levelUp?.detail}
        onClose={() => setLevelUp(null)}
      />
    </section>
  );
}
