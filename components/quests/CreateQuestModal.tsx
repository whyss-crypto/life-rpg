"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/primitives";
import { CATEGORIES } from "@/lib/game/attributes";
import { rewardsFor } from "@/lib/game/economy";

export function CreateQuestModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (q: { title: string; description: string; category: string; difficulty: "easy" | "normal" | "hard" | "epic" }) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("study");
  const [difficulty, setDifficulty] = useState<"easy" | "normal" | "hard" | "epic">("normal");
  const [error, setError] = useState("");

  const reward = rewardsFor(difficulty);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Give your quest a title.");
      return;
    }
    if (title.trim().length > 120) {
      setError("Title must be under 120 characters.");
      return;
    }
    onCreate({ title: title.trim(), description: description.trim(), category, difficulty });
    setTitle("");
    setDescription("");
    setError("");
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Create new quest"
        >
          <motion.form
            onSubmit={submit}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="card-surface w-full max-w-lg rounded-t-2xl border-white/10 p-6 sm:rounded-rune"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg tracking-widest text-gold-300">NEW QUEST</h2>
              <button onClick={onClose} type="button" className="rounded p-2 text-slate-400 hover:bg-white/5" aria-label="Close quest creator">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <label className="mb-3 block">
              <span className="mb-1 block text-sm text-slate-300">Quest title *</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Study React for 1 hour"
                maxLength={120}
                className="w-full rounded-rune border border-white/10 bg-black/40 px-3 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:border-gold-400/60"
                autoFocus
              />
            </label>

            <label className="mb-3 block">
              <span className="mb-1 block text-sm text-slate-300">Details</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does 'done' look like?"
                rows={2}
                maxLength={500}
                className="w-full rounded-rune border border-white/10 bg-black/40 px-3 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:border-gold-400/60"
              />
            </label>

            <div className="mb-3 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-sm text-slate-300">Category</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-rune border border-white/10 bg-black/40 px-3 py-2.5 text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-slate-300">Difficulty</span>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
                  className="w-full rounded-rune border border-white/10 bg-black/40 px-3 py-2.5 text-sm"
                >
                  <option value="easy">Easy</option>
                  <option value="normal">Normal</option>
                  <option value="hard">Hard</option>
                  <option value="epic">Epic</option>
                </select>
              </label>
            </div>

            <p className="mb-4 rounded-rune border border-gold-400/20 bg-gold-500/5 px-3 py-2 text-sm" aria-live="polite">
              Reward preview: <span className="font-semibold text-arcane-300">+{reward.xp} XP</span>{" "}
              <span className="font-semibold text-gold-400">+{reward.gold} Gold</span>{" "}
              <span className="text-slate-400">+{reward.attrPoints} attribute</span>
            </p>

            {error && (
              <p role="alert" className="mb-3 text-sm text-blood">
                {error}
              </p>
            )}

            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Accept Quest
              </Button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
