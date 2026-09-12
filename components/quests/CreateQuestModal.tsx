"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/primitives";
import { CATEGORIES } from "@/lib/game/attributes";
import { rewardsFor } from "@/lib/game/economy";

const inputCls =
  "w-full rounded-sharp border hairline bg-black/40 px-3.5 py-2.5 text-[15px] text-ink outline-none placeholder:text-fog-faint focus:border-gold-500/60";

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
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/80 p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Create new quest"
        >
          <motion.form
            onSubmit={submit}
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 32, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-lg border-t hairline bg-void-900 p-6 sm:border sm:p-8"
          >
            <div className="flex items-baseline justify-between">
              <h2 className="kicker text-ink">New quest</h2>
              <button onClick={onClose} type="button" className="press rounded p-2 text-fog hover:text-ink" aria-label="Close quest creator">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <label className="mt-6 block">
              <span className="kicker mb-2 block !text-[10px] text-fog-faint">Title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Study React for 1 hour"
                maxLength={120}
                className={inputCls}
                autoFocus
              />
            </label>

            <label className="mt-4 block">
              <span className="kicker mb-2 block !text-[10px] text-fog-faint">Terms of done</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does finished look like?"
                rows={2}
                maxLength={500}
                className={inputCls}
              />
            </label>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <label className="block">
                <span className="kicker mb-2 block !text-[10px] text-fog-faint">Discipline</span>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
                  {CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="kicker mb-2 block !text-[10px] text-fog-faint">Weight</span>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as typeof difficulty)} className={inputCls}>
                  <option value="easy">Easy</option>
                  <option value="normal">Normal</option>
                  <option value="hard">Hard</option>
                  <option value="epic">Epic</option>
                </select>
              </label>
            </div>

            <p className="tnum mt-5 border-t hairline pt-4 text-sm text-fog" aria-live="polite">
              Terms: <span className="font-semibold text-ink">+{reward.xp} XP</span>
              <span className="ml-3 font-semibold text-gold-400">+{reward.gold} G</span>
              <span className="ml-3 text-fog-faint">+{reward.attrPoints} attribute</span>
            </p>

            {error && (
              <p role="alert" className="mt-3 text-sm text-blood">
                {error}
              </p>
            )}

            <div className="mt-5 flex gap-3">
              <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                Decline
              </Button>
              <Button type="submit" className="flex-1">
                Accept quest
              </Button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
