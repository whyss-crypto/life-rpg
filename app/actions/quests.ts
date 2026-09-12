"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase, isServerSupabaseConfigured } from "@/lib/supabase/server";
import { questSchema } from "@/lib/validation/schemas";
import { checkRateLimit } from "@/lib/rate-limit";
import { attributeForCategory } from "@/lib/game/attributes";
import { rewardsFor } from "@/lib/game/economy";

function err(message: string) {
  return { ok: false as const, error: message };
}

export async function createQuestAction(form: {
  title: string;
  description?: string;
  category: string;
  difficulty: "easy" | "normal" | "hard" | "epic";
  dueAt?: string | null;
}) {
  if (!isServerSupabaseConfigured()) {
    return err("Demo mode: Supabase not connected. Quest will be kept locally by the demo store.");
  }
  const parsed = questSchema.safeParse({
    title: form.title,
    description: form.description ?? "",
    category: form.category,
    difficulty: form.difficulty,
    dueAt: form.dueAt ?? null,
  });
  if (!parsed.success) return err(parsed.error.issues[0]?.message ?? "Invalid quest");
  const supabase = await createServerSupabase();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return err("Session expired. Please sign in again.");

  // Spam throttle: 20 quests per 10 minutes per hero (per-instance window).
  if (!checkRateLimit(`quest-create:${user.id}`, 20, 10 * 60 * 1000).ok) {
    return err("Easy, hero — too many quests at once. Wait a minute and try again.");
  }

  const r = rewardsFor(parsed.data.difficulty);
  const attr = attributeForCategory(parsed.data.category);
  const { error } = await supabase.from("quests").insert({
    user_id: user.id,
    title: parsed.data.title,
    description: parsed.data.description || null,
    category: parsed.data.category,
    difficulty: parsed.data.difficulty,
    xp_reward: r.xp,
    gold_reward: r.gold,
    attribute_reward: attr,
    attribute_points: r.attrPoints,
    due_at: parsed.data.dueAt || null,
  });
  if (error) return err("Could not create quest. Try again.");
  revalidatePath("/dashboard");
  revalidatePath("/quests");
  return { ok: true as const };
}

export async function deleteQuestAction(questId: string) {
  if (!isServerSupabaseConfigured()) return err("Demo mode.");
  const supabase = await createServerSupabase();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return err("Session expired.");
  const { error } = await supabase.from("quests").delete().eq("id", questId);
  if (error) return err("Could not delete quest.");
  revalidatePath("/dashboard");
  revalidatePath("/quests");
  return { ok: true as const };
}

export async function completeQuestAction(questId: string) {
  if (!isServerSupabaseConfigured()) {
    return err("Demo mode: completion handled locally.");
  }
  const supabase = await createServerSupabase();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return err("Session expired. Please sign in again.");
  const { data, error } = await supabase.rpc("complete_quest", { p_quest_id: questId });
  if (error) {
    const msg = error.message ?? "";
    if (msg.includes("ALREADY_COMPLETED")) return err("Quest already completed — no double rewards.");
    if (msg.includes("FORBIDDEN")) return err("You cannot complete someone else's quest.");
    if (msg.includes("QUEST_NOT_FOUND")) return err("Quest not found.");
    return err("Could not complete quest. Try again.");
  }
  revalidatePath("/dashboard");
  revalidatePath("/quests");
  revalidatePath("/character");
  revalidatePath("/achievements");
  const d = data as Record<string, unknown>;
  return {
    ok: true as const,
    xpGained: Number(d["xpGained"] ?? 0),
    goldGained: Number(d["goldGained"] ?? 0),
    attribute: String(d["attribute"] ?? "focus"),
    attributePoints: Number(d["attributePoints"] ?? 0),
    newXp: Number(d["newXp"] ?? 0),
    oldLevel: Number(d["oldLevel"] ?? 1),
    newLevel: Number(d["newLevel"] ?? 1),
    levelUp: Boolean(d["levelUp"]),
    currentStreak: Number(d["currentStreak"] ?? 0),
    achievements: (d["achievements"] as string[]) ?? [],
  };
}

