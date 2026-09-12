"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase, isServerSupabaseConfigured } from "@/lib/supabase/server";

// Board API — the single server gateway for game state.
// The client store (GameProvider) renders exactly what these return.
// No quest seeds, no localStorage, no demo fallbacks anywhere.

export interface BoardQuest {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: "easy" | "normal" | "hard" | "epic";
  xp_reward: number;
  gold_reward: number;
  attribute_reward: string;
  attribute_points: number;
  is_completed: boolean;
  created_at: string;
}

export interface BoardCharacter {
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
  equipped_title: string | null;
}

export interface BoardItem {
  id: string;
  name: string;
  description: string | null;
  type: string;
  rarity: string;
  price: number;
}

export interface BoardState {
  username: string;
  character: BoardCharacter;
  quests: BoardQuest[];
  inventory: string[];
  catalog: BoardItem[];
  achievements: string[];
  totalQuests: number;
}

type Fail = { ok: false; reason: "auth" | "setup" | "error"; error: string };

const SETUP_ERROR =
  "Database tables are missing. In the Supabase SQL editor, run supabase/migrations/001_initial_schema.sql through 004_seed_data.sql (in order), then refresh this page.";

function setupFail(): Fail {
  return { ok: false as const, reason: "setup", error: SETUP_ERROR };
}

function isMissingTable(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const rec = err as Record<string, unknown>;
  const code = typeof rec.code === "string" ? rec.code : "";
  const msg = typeof rec.message === "string" ? rec.message : "";
  return code === "PGRST205" || /does not exist|schema cache|42P01/i.test(msg);
}

function num(v: unknown, fallback = 0): number {
  const n = typeof v === "string" ? Number(v) : (v as number);
  return Number.isFinite(n) ? (n as number) : fallback;
}

export async function getGameState(): Promise<{ ok: true; board: BoardState } | Fail> {
  if (!isServerSupabaseConfigured()) {
    return {
      ok: false as const,
      reason: "error",
      error: "Supabase keys are missing. Add them to .env.local and restart the dev server.",
    };
  }
  const supabase = createServerSupabase();
  const { data: userData, error: authErr } = await supabase.auth.getUser();
  const user = userData?.user ?? null;
  if (authErr || !user) {
    return { ok: false as const, reason: "auth", error: "Not signed in." };
  }

  // Self-heal profile (signup may pre-create it; email-confirm flows may not).
  const { data: prof0, error: profErr } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();
  if (profErr && isMissingTable(profErr)) return setupFail();
  let username: string | null = (prof0 as { username?: string } | null)?.username ?? null;
  if (!username) {
    const raw = (user.email ?? "hero").split("@")[0].replace(/[^a-zA-Z0-9_]/g, "").slice(0, 16);
    let base = raw.length >= 3 ? raw : `hero_${user.id.replace(/-/g, "").slice(0, 6)}`;
    let ins = await supabase
      .from("profiles")
      .insert({ id: user.id, username: base, display_name: base })
      .select("username")
      .single();
    if (ins.error && isMissingTable(ins.error)) return setupFail();
    if (ins.error) {
      // Name taken — retry once with a unique suffix.
      base = `${base}_${user.id.replace(/-/g, "").slice(0, 4)}`.slice(0, 24);
      ins = await supabase
        .from("profiles")
        .insert({ id: user.id, username: base, display_name: base })
        .select("username")
        .single();
      if (ins.error && isMissingTable(ins.error)) return setupFail();
    }
    username = (ins.data as { username?: string } | null)?.username ?? base;
  }

  // Self-heal character row.
  const { data: char0, error: charErr } = await supabase
    .from("characters")
    .select("*")
    .eq("user_id", user.id)
    .single();
  if (charErr && isMissingTable(charErr)) return setupFail();
  let character = char0 as Record<string, unknown> | null;
  if (!character) {
    const { data: cins, error: cinsErr } = await supabase
      .from("characters")
      .insert({ user_id: user.id })
      .select("*")
      .single();
    if (cinsErr && isMissingTable(cinsErr)) return setupFail();
    character = (cins as Record<string, unknown> | null) ?? null;
  }

  const [qQuests, qInv, qItems, qAllAch, qMyAch, qCount] = await Promise.all([
    supabase.from("quests").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("inventory").select("item_id").eq("user_id", user.id),
    supabase.from("items").select("id, name, description, type, rarity, price").order("price", { ascending: true }),
    supabase.from("achievements").select("id, name"),
    supabase.from("user_achievements").select("achievement_id").eq("user_id", user.id),
    supabase.from("quest_completions").select("id", { count: "exact", head: true }).eq("user_id", user.id),
  ]);
  for (const r of [qQuests, qInv, qItems, qAllAch, qMyAch, qCount]) {
    if (r.error && isMissingTable(r.error)) return setupFail();
  }

  const idToName = new Map<string, string>(
    ((qAllAch.data ?? []) as Array<{ id: string; name: string }>).map((a) => [a.id, a.name])
  );
  const unlocked: string[] = [];
  for (const row of (qMyAch.data ?? []) as Array<{ achievement_id: string }>) {
    const name = idToName.get(row.achievement_id);
    if (name) unlocked.push(name);
  }

  const c = character ?? {};
  const board: BoardState = {
    username: username ?? "Adventurer",
    character: {
      level: num(c.level, 1),
      xp: num(c.xp),
      gold: num(c.gold),
      strength: num(c.strength),
      intellect: num(c.intellect),
      endurance: num(c.endurance),
      wisdom: num(c.wisdom),
      focus: num(c.focus),
      current_streak: num(c.current_streak),
      best_streak: num(c.best_streak),
      equipped_title: (c.equipped_title as string | null) ?? null,
    },
    quests: ((qQuests.data ?? []) as Array<Record<string, unknown>>).map((q) => ({
      id: String(q.id),
      title: String(q.title ?? "Untitled quest"),
      description: (q.description as string | null) ?? null,
      category: String(q.category ?? "personal"),
      difficulty:
        q.difficulty === "easy" || q.difficulty === "hard" || q.difficulty === "epic"
          ? q.difficulty
          : ("normal" as BoardQuest["difficulty"]),
      xp_reward: num(q.xp_reward),
      gold_reward: num(q.gold_reward),
      attribute_reward: String(q.attribute_reward ?? "focus"),
      attribute_points: num(q.attribute_points),
      is_completed: Boolean(q.is_completed),
      created_at: String(q.created_at ?? new Date().toISOString()),
    })),
    inventory: ((qInv.data ?? []) as Array<{ item_id: string }>).map((r) => String(r.item_id)),
    catalog: ((qItems.data ?? []) as Array<Record<string, unknown>>).map((i) => ({
      id: String(i.id),
      name: String(i.name ?? "Relic"),
      description: (i.description as string | null) ?? null,
      type: String(i.type ?? "badge"),
      rarity: String(i.rarity ?? "common"),
      price: num(i.price),
    })),
    achievements: unlocked,
    totalQuests: typeof qCount.count === "number" ? qCount.count : 0,
  };
  return { ok: true as const, board };
}

export async function updateUsernameAction(
  name: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const clean = name.trim();
  if (!/^[a-zA-Z0-9_]{3,24}$/.test(clean)) {
    return { ok: false as const, error: "Name: 3–24 chars, letters/numbers/_ only." };
  }
  if (!isServerSupabaseConfigured()) {
    return { ok: false as const, error: "Backend not connected." };
  }
  const supabase = createServerSupabase();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) return { ok: false as const, error: "Session expired. Please sign in again." };
  const { error } = await supabase
    .from("profiles")
    .update({ username: clean, display_name: clean })
    .eq("id", user.id);
  if (error) {
    if (isMissingTable(error)) return { ok: false as const, error: SETUP_ERROR };
    if (error.code === "23505" || /duplicate|unique/i.test(error.message ?? "")) {
      return { ok: false as const, error: "That name is taken — try another." };
    }
    return { ok: false as const, error: "Could not update name. Try again." };
  }
  revalidatePath("/dashboard");
  revalidatePath("/character");
  revalidatePath("/settings");
  return { ok: true as const };
}

export async function equipTitleAction(
  name: string | null
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (name !== null && (typeof name !== "string" || name.length > 60)) {
    return { ok: false as const, error: "Invalid title." };
  }
  if (!isServerSupabaseConfigured()) {
    return { ok: false as const, error: "Backend not connected." };
  }
  const supabase = createServerSupabase();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) return { ok: false as const, error: "Session expired. Please sign in again." };
  const { error } = await supabase
    .from("characters")
    .update({ equipped_title: name })
    .eq("user_id", user.id);
  if (error) {
    if (isMissingTable(error)) return { ok: false as const, error: SETUP_ERROR };
    return { ok: false as const, error: "Could not equip title." };
  }
  revalidatePath("/dashboard");
  revalidatePath("/character");
  revalidatePath("/inventory");
  return { ok: true as const };
}
