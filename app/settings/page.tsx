"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/components/providers/GameProvider";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/primitives";
import { GlowCard } from "@/components/ui/GlowCard";

export default function SettingsPage() {
  const { state, setUsername } = useGame();
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [name, setName] = useState(state.username);
  const [saving, setSaving] = useState(false);

  async function logout() {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      await createClient().auth.signOut();
    } catch {}
    router.push("/");
    router.refresh();
  }

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setIsError(false);
    const r = await setUsername(name);
    setSaving(false);
    if (!r.ok) {
      setMsg(r.error ?? "Could not update name.");
      setIsError(true);
      return;
    }
    setMsg("Hero name updated across the realm.");
  }

  return (
    <AppShell>
      <p className="font-display text-xs tracking-[0.3em] text-gold-300">CONFIGURATION</p>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Settings</h1>
      <div className="mt-4 grid gap-3">
        <GlowCard className="p-4">
          <h2 className="font-semibold">Hero name</h2>
          <p className="mt-1 text-sm text-slate-400">Shown across your dashboard and character sheet.</p>
          <form className="mt-3 flex gap-2" onSubmit={(e) => void saveName(e)}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={24}
              aria-label="Hero name"
              className="min-w-0 flex-1 rounded-rune border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-gold-400/60"
            />
            <Button type="submit" variant="ghost" className="!min-h-[40px]" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </form>
          {msg && (
            <p role={isError ? "alert" : "status"} className={`mt-2 text-sm ${isError ? "text-blood" : "text-emerald-300"}`}>
              {msg}
            </p>
          )}
        </GlowCard>
        <GlowCard className="p-4">
          <h2 className="font-semibold">Cloud saves</h2>
          <p className="mt-1 text-sm text-slate-400">
            Your hero lives in Supabase — progress persists across devices and survives refreshes.
          </p>
        </GlowCard>
        <GlowCard className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <h2 className="font-semibold">Session</h2>
            <p className="text-sm text-slate-400">Sign out of this device.</p>
          </div>
          <Button variant="danger" onClick={() => void logout()}>
            Log out
          </Button>
        </GlowCard>
      </div>
    </AppShell>
  );
}
