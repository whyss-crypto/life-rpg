"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { BoardCharacter, BoardItem, BoardQuest, BoardState } from "@/app/actions/game";
import { getGameState, updateUsernameAction, equipTitleAction } from "@/app/actions/game";
import { createQuestAction, deleteQuestAction, completeQuestAction } from "@/app/actions/quests";
import { purchaseItemAction } from "@/app/actions/shop";

// Game store — Supabase is the ONLY source of truth.
// No seeds, no localStorage, no offline fallbacks. Every mutation goes
// through an authoritative Server Action; the board is re-read afterwards.

// Re-exported so quest/shop components keep stable prop types.
export type DemoQuest = BoardQuest;
export type DemoItem = BoardItem;

export type CompleteRes = Awaited<ReturnType<typeof completeQuestAction>>;
export type OpRes = { ok: boolean; error?: string };

type Status = "loading" | "ready" | "error";

const PUBLIC_PATHS = new Set(["/", "/login", "/signup"]);

const EMPTY_BOARD: BoardState = {
  username: "",
  character: {
    level: 1, xp: 0, gold: 0,
    strength: 0, intellect: 0, endurance: 0, wisdom: 0, focus: 0,
    current_streak: 0, best_streak: 0, equipped_title: null,
  },
  quests: [],
  inventory: [],
  catalog: [],
  achievements: [],
  totalQuests: 0,
};

interface GameCtx {
  status: Status;
  error: string;
  state: BoardState;
  refresh: () => Promise<void>;
  createQuest: (q: {
    title: string;
    description: string;
    category: string;
    difficulty: DemoQuest["difficulty"];
  }) => Promise<OpRes>;
  removeQuest: (id: string) => Promise<OpRes>;
  completeQuest: (id: string) => Promise<CompleteRes>;
  purchase: (id: string) => Promise<OpRes>;
  equipTitle: (name: string | null) => Promise<void>;
  setUsername: (name: string) => Promise<OpRes>;
}

const Ctx = createContext<GameCtx | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");
  const [board, setBoard] = useState<BoardState>(EMPTY_BOARD);

  const fetchBoard = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!opts?.silent) {
        setStatus("loading");
        setError("");
      }
      // One-time purge of saves written by the old demo build so ghost
      // names/progress can never resurface.
      try {
        localStorage.removeItem("life-rpg-demo-v1");
      } catch {}
      const res = await getGameState();
      if (!res.ok) {
        if (res.reason === "auth") {
          router.replace("/login");
          return;
        }
        setError(res.error);
        setStatus("error");
        return;
      }
      setBoard(res.board);
      setStatus("ready");
    },
    [router]
  );

  useEffect(() => {
    if (PUBLIC_PATHS.has(pathname)) return; // landing + auth pages need no board
    void fetchBoard();
  }, [pathname, fetchBoard]);

  const refresh = useCallback(() => fetchBoard({ silent: true }), [fetchBoard]);

  const createQuest = useCallback<GameCtx["createQuest"]>(
    async (q) => {
      const r = await createQuestAction({ ...q, dueAt: null });
      if (r.ok) await fetchBoard({ silent: true });
      return r.ok ? { ok: true } : { ok: false, error: r.error };
    },
    [fetchBoard]
  );

  const removeQuest = useCallback<GameCtx["removeQuest"]>(
    async (id) => {
      const r = await deleteQuestAction(id);
      if (r.ok) await fetchBoard({ silent: true });
      return r.ok ? { ok: true } : { ok: false, error: r.error };
    },
    [fetchBoard]
  );

  const completeQuest = useCallback<GameCtx["completeQuest"]>(
    async (id) => {
      const r = await completeQuestAction(id);
      if (r.ok) await fetchBoard({ silent: true });
      return r;
    },
    [fetchBoard]
  );

  const purchase = useCallback<GameCtx["purchase"]>(
    async (id) => {
      const r = await purchaseItemAction(id);
      if (r.ok) {
        await fetchBoard({ silent: true });
        return { ok: true };
      }
      return { ok: false, error: r.error };
    },
    [fetchBoard]
  );

  const equipTitle = useCallback<GameCtx["equipTitle"]>(
    async (name) => {
      const r = await equipTitleAction(name);
      if (r.ok) await fetchBoard({ silent: true });
    },
    [fetchBoard]
  );

  const setUsername = useCallback<GameCtx["setUsername"]>(
    async (name) => {
      const r = await updateUsernameAction(name);
      if (r.ok) await fetchBoard({ silent: true });
      return r.ok ? { ok: true } : { ok: false, error: r.error };
    },
    [fetchBoard]
  );

  const value = useMemo(
    () => ({
      status, error, state: board, refresh,
      createQuest, removeQuest, completeQuest, purchase, equipTitle, setUsername,
    }),
    [status, error, board, refresh, createQuest, removeQuest, completeQuest, purchase, equipTitle, setUsername]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGame(): GameCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
