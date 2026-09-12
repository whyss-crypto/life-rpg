import { createServerSupabase, isServerSupabaseConfigured } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

export type CharacterRow = Tables<"characters">;

export async function getSessionUser() {
  if (!isServerSupabaseConfigured()) return null;
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getCharacter(userId: string): Promise<CharacterRow | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("characters").select("*").eq("user_id", userId).single();
  return data as CharacterRow | null;
}

export async function getQuests(userId: string) {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("quests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getShopCatalog() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("items").select("*").order("price", { ascending: true });
  return data ?? [];
}

