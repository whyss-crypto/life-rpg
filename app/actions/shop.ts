"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase, isServerSupabaseConfigured } from "@/lib/supabase/server";

export async function purchaseItemAction(itemId: string) {
  if (!isServerSupabaseConfigured()) {
    return { ok: false as const, error: "Backend not connected." };
  }
  const supabase = await createServerSupabase();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false as const, error: "Session expired." };
  const { data, error } = await supabase.rpc("purchase_item", { p_item_id: itemId });
  if (error) {
    const msg = error.message ?? "";
    if (msg.includes("INSUFFICIENT_GOLD"))
      return { ok: false as const, error: "Insufficient gold. Complete more quests." };
    if (msg.includes("ALREADY_OWNED")) return { ok: false as const, error: "Already owned." };
    return { ok: false as const, error: "Purchase failed. Try again." };
  }
  revalidatePath("/shop");
  revalidatePath("/inventory");
  const d = data as Record<string, unknown>;
  return { ok: true as const, newGold: Number(d["newGold"] ?? 0), itemName: String(d["itemName"] ?? "Item") };
}

