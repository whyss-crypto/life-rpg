"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { attributeForCategory, type AttributeKey } from "@/lib/game/attributes";
import { rewardsFor } from "@/lib/game/economy";
import { levelForXp, progressForXp } from "@/lib/game/levels";
import { nextStreak } from "@/lib/game/streaks";
import { evaluateAchievements } from "@/lib/game/achievements";

export interface DemoQuest {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "normal" | "hard" | "epic";
  xp_reward: number;
  gold_reward: number;
  attribute_reward: AttributeKey;
  attribute_points: number;
  is_completed: boolean;
  created_at: string;
}

export interface DemoCharacter {
  level: number;
  xp: number;
  gold: number;
  strength: number;
  intellect: number;
  endurance: number;
  wisdom: number;
  focus: number;
  current_streak: number;
  best_streak: number;
  last_activity_date: string | null;
  equipped_title: string | null;
}

export interface DemoItem {
  id: string;
  name: string;
  type: string;
  rarity: string;
  price: number;
  description: string;
}

export const DEMO_SHOP: DemoItem[] = [
  { id: "t-awakened", name: "The Awakened", type: "title", rarity: "common", price: 100, description: "First title for those who began." },
  { id: "t-shadow", name: "Shadow Walker", type: "title", rarity: "rare", price: 450, description: "For heroes who grind after dark." },
  { id: "t-grand", name: "Grandmaster", type: "title", rarity: "epic", price: 800, description: "Deep discipline and mastery." },
  { id: "f-arcane", name: "Arcane Runic Ring", type: "frame", rarity: "rare", price: 350, description: "Glowing arcane avatar frame." },
  { id: "f-dragon", name: "Dragon Gold Border", type: "frame", rarity: "legendary", price: 1000, description: "Molten gold frame of legends." },
  { id: "b-ember", name: "Ember Badge", type: "badge", rarity: "common", price: 150, description: "Proof of a 3-day fire." },
];

const KEY = "life-rpg-demo-v1";

interface DemoState {
  character: DemoCharacter;
  quests: DemoQuest[];
  inventory: string[];
  achievements: string[];
  totalQuests: number;
}

const DEFAULT_STATE: DemoState = {
  character: {
    level: 1, xp: 0, gold: 120,
    strength: 2, intellect: 3, endurance: 2, wisdom: 2, focus: 2,
    current_streak: 0, best_streak: 0, last_activity_date: null,
    equipped_title: null,
  },
  quests: [
    {
      id: "seed-1", title: "Study TypeScript for 45 min", description: "Finish generics + zod validation chapter.",
      category: "study", difficulty: "normal", xp_reward: 100, gold_reward: 20,
      attribute_reward: "intellect", attribute_points: 2, is_completed: false,
      created_at: new Date().toISOString(),
    },
    {
      id: "seed-2", title: "Gym — push day", description: "Chest, shoulders, triceps. 60 minutes.",
      category: "fitness", difficulty: "hard", xp_reward: 175, gold_reward: 35,
      attribute_reward: "strength", attribute_points: 3, is_completed: false,
      created_at: new Date().toISOString(),
    },
    {
      id: "seed-3", title: "Read 20 pages", description: "Deep reading, no phone.",
      category: "reading", difficulty: "easy", xp_reward: 50, gold_reward: 10,
      attribute_reward: "wisdom", attribute_points: 1, is_completed: false,
      created_at: new Date().toISOString(),
    },
  ],
  inventory: [],
  achievements: [],
  totalQuests: 0,
};

function load(): DemoState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as DemoState;
    if (!parsed.character || !Array.isArray(parsed.quests)) return DEFAULT_STATE;
    return parsed;
  } catch {
    return DEFAULT_STATE;
  }
}

export interface CompleteResult {
  xpGained: number;
  goldGained: number;
  attribute: AttributeKey;
  attributePoints: number;
  newXp: number;
  oldLevel: number;
  newLevel: number;
  levelUp: boolean;
  currentStreak: number;
  achievements: string[];
}

interface GameCtx {
  mode: "demo" | "supabase";
  state: DemoState;
  createQuest: (q: { title: string; description: string; category: string; difficulty: DemoQuest["difficulty"] }) => void;
  deleteQuest: (id: string) => void;
  completeQuest: (id: string) => CompleteResult | null;
  purchase: (id: string) => { ok: boolean; error?: string };
  equipTitle: (name: string | null) => void;
  resetDemo: () => void;
}

const Ctx = createContext<GameCtx | null>(null);

function dayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
      } catch {}
    }
  }, [state, hydrated]);

  const createQuest = useCallback<GameCtx["createQuest"]>(({ title, description, category, difficulty }) => {
    const r = rewardsFor(difficulty);
    const q: DemoQuest = {
      id: `q-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
      title: title.slice(0, 120),
      description: (description ?? "").slice(0, 500),
      category,
      difficulty,
      xp_reward: r.xp,
      gold_reward: r.gold,
      attribute_reward: attributeForCategory(category) as AttributeKey,
      attribute_points: r.attrPoints,
      is_completed: false,
      created_at: new Date().toISOString(),
    };
    setState((s) => ({ ...s, quests: [q, ...s.quests] }));
  }, []);

  const deleteQuest = useCallback((id: string) => {
    setState((s) => ({ ...s, quests: s.quests.filter((q) => q.id !== id) }));
  }, []);

  const completeQuest = useCallback(
    (id: string): CompleteResult | null => {
      let result: CompleteResult | null = null;
      setState((s) => {
        const q = s.quests.find((x) => x.id === id);
        if (!q || q.is_completed) return s;
        const today = dayKey();
        const streak = nextStreak(
          { current: s.character.current_streak, best: s.character.best_streak, lastDate: s.character.last_activity_date },
          today
        );
        const oldLevel = s.character.level;
        const newXp = s.character.xp + q.xp_reward;
        const newLevel = levelForXp(newXp);
        const prog = progressForXp(newXp);
        void prog;
        const totalQuests = s.totalQuests + 1;
        const newly = evaluateAchievements(
          { totalQuests, totalXp: newXp, level: newLevel, streak: streak.current },
          s.achievements
        );
        result = {
          xpGained: q.xp_reward,
          goldGained: q.gold_reward,
          attribute: q.attribute_reward,
          attributePoints: q.attribute_points,
          newXp,
          oldLevel,
          newLevel,
          levelUp: newLevel > oldLevel,
          currentStreak: streak.current,
          achievements: newly,
        };
        return {
          ...s,
          totalQuests,
          achievements: [...s.achievements, ...newly],
          quests: s.quests.map((x) => (x.id === id ? { ...x, is_completed: true } : x)),
          character: {
            ...s.character,
            xp: newXp,
            level: newLevel,
            gold: s.character.gold + q.gold_reward,
            current_streak: streak.current,
            best_streak: streak.best,
            last_activity_date: today,
            [q.attribute_reward]: (s.character[q.attribute_reward] as number) + q.attribute_points,
          },
        };
      });
      return result;
    },
    []
  );

  const purchase = useCallback((id: string) => {
    let out: { ok: boolean; error?: string } = { ok: true };
    setState((s) => {
      if (s.inventory.includes(id)) {
        out = { ok: false, error: "Already owned." };
        return s;
      }
      const item = DEMO_SHOP.find((i) => i.id === id);
      if (!item) {
        out = { ok: false, error: "Item not found." };
        return s;
      }
      if (s.character.gold < item.price) {
        out = { ok: false, error: "Insufficient gold. Complete more quests." };
        return s;
      }
      return {
        ...s,
        inventory: [...s.inventory, id],
        character: { ...s.character, gold: s.character.gold - item.price },
      };
    });
    return out;
  }, []);

  const equipTitle = useCallback((name: string | null) => {
    setState((s) => ({ ...s, character: { ...s.character, equipped_title: name } }));
  }, []);

  const resetDemo = useCallback(() => {
    setState(DEFAULT_STATE);
    try {
      localStorage.removeItem(KEY);
    } catch {}
  }, []);

  const mode: GameCtx["mode"] =
    typeof window !== "undefined" &&
    (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
      ? "demo"
      : "demo"; // server-connected mode upgrades these flows to Server Actions; demo store always available offline

  const value = useMemo(
    () => ({ mode, state, createQuest, deleteQuest, completeQuest, purchase, equipTitle, resetDemo }),
    [mode, state, createQuest, deleteQuest, completeQuest, purchase, equipTitle, resetDemo]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGame(): GameCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
