"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useGame } from "@/components/providers/GameProvider";
import { QuestCard } from "./QuestCard";
import { CreateQuestModal } from "./CreateQuestModal";
import { LevelUpModal } from "@/components/rpg/LevelUpModal";
import { RewardFlyouts, useFlyouts } from "@/components/rpg/RewardFlyout";
import { Button } from "@/components/ui/primitives";
import { EmptyState } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const FILTERS = ["all", "active", "completed", "strength", "intellect", "endurance", "wisdom", "focus"] as const;

export function QuestBoard({ onStats }: { onStats?: (s: { levelUp: { old: number; next: number } | null }) => void }) {
  const { state, createQuest, deleteQuest, completeQuest } = useGame();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [modal, setModal] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [levelUp, setLevelUp] = useState<{ old: number; next: number } | null>(null);
  const [notice, setNotice] = useState("");
  const flyouts = useFlyouts();

  const quests = useMemo(() => {
    return state.quests.filter((q) => {
      if (filter === "all") return true;
      if (filter === "active") return !q.is_completed;
      if (filter === "completed") return q.is_completed;
      return q.attribute_reward === filter;
    });
  }, [state.quests, filter]);

  async function handleCreate(q: { title: string; description: string; category: string; difficulty: "easy" | "normal" | "hard" | "epic" }) {
    // Authoritative server first (no-op in demo mode), local store mirrors instantly.
    try {
      const { createQuestAction } = await import("@/app/actions/quests");
      await createQuestAction({ ...q, dueAt: null });
    } catch {}
    createQuest(q);
  }

  async function handleComplete(id: string) {
    if (pendingId) return;
    setPendingId(id);
    setNotice("");
    // tiny tactile delay so the button press is felt (optimistic presentation only)
    await new Promise((r) => setTimeout(r, 120));
    try {
      const { completeQuestAction } = await import("@/app/actions/quests");
      const server = await completeQuestAction(id);
      if (!server.ok && server.error && !server.error.startsWith("Demo mode")) {
        // Server is authoritative when connected: surface its verdict.
        if (server.error.includes("already completed")) {
          setPendingId(null);
          setNotice("Quest already completed — no double rewards.");
          return;
        }
      }
      if (server.ok) {
        flyouts.push(server.xpGained, server.goldGained);
        if (server.levelUp) setLevelUp({ old: server.oldLevel, next: server.newLevel });
        if (server.achievements.length > 0) setNotice(`Achievement unlocked: ${server.achievements.join(", ")}`);
        // Mirror into local store so demo + server stay visually in sync.
        completeQuest(id);
        setPendingId(null);
        onStats?.({ levelUp: server.levelUp ? { old: server.oldLevel, next: server.newLevel } : null });
        return;
      }
    } catch {}
    const res = completeQuest(id);
    setPendingId(null);
    if (!res) {
      setNotice("Quest already completed — no double rewards.");
      return;
    }
    flyouts.push(res.xpGained, res.goldGained);
    if (res.levelUp) setLevelUp({ old: res.oldLevel, next: res.newLevel });
    if (res.achievements.length > 0) {
      setNotice(`Achievement unlocked: ${res.achievements.join(", ")}`);
    }
    onStats?.({ levelUp: res.levelUp ? { old: res.oldLevel, next: res.newLevel } : null });
  }

  return (
    <section aria-label="Quest board" className="mt-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-display text-lg tracking-[0.2em] text-slate-200">
          QUEST <span className="gold-text">BOARD</span>
        </h2>
        <Button onClick={() => setModal(true)} className="!min-h-[40px] !px-4 !py-2">
          <Plus className="h-4 w-4" aria-hidden="true" /> New Quest
        </Button>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter quests">
        {FILTERS.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              "min-h-[36px] shrink-0 rounded-full border px-3.5 text-xs font-semibold uppercase tracking-wider transition",
              filter === f
                ? "border-gold-400/60 bg-gold-500/15 text-gold-300"
                : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div aria-live="polite" className="sr-only">
        {quests.filter((q) => !q.is_completed).length} active quests.
      </div>
      {notice && (
        <p role="status" className="mb-3 rounded-rune border border-gold-400/30 bg-gold-500/10 px-3 py-2 text-sm text-gold-300">
          {notice}
        </p>
      )}

      {quests.length === 0 ? (
        <EmptyState
          title="YOUR QUEST BOARD IS EMPTY."
          body="Every adventure starts with a first quest. Create one and earn your first reward."
          action={
            <Button onClick={() => setModal(true)} className="mt-2">
              <Plus className="h-4 w-4" aria-hidden="true" /> Create Quest
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {quests.map((q) => (
            <QuestCard
              key={q.id}
              quest={q}
              pending={pendingId === q.id}
              onComplete={() => void handleComplete(q.id)}
              onDelete={() => deleteQuest(q.id)}
            />
          ))}
        </div>
      )}

      <CreateQuestModal open={modal} onClose={() => setModal(false)} onCreate={(q) => void handleCreate(q)} />
      <LevelUpModal
        open={!!levelUp}
        oldLevel={levelUp?.old ?? 1}
        newLevel={levelUp?.next ?? 1}
        onClose={() => setLevelUp(null)}
      />
      <RewardFlyouts items={flyouts.items} />
    </section>
  );
}
