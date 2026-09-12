"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/components/providers/GameProvider";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/primitives";
import { GlowCard } from "@/components/ui/GlowCard";

export default function SettingsPage() {
  const { state, setUsername, resetDemo } = useGame();
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [name, setName] = useState(state.username);
  const supabaseReady = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );

  async function logout() {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      await (await createClient()).auth.signOut();
    } catch {}
    router.push("/");
    router.refresh();
  }

  return (
    <AppShell>
      <p className="font-display text-xs tracking-[0.3em] text-gold-300">CONFIGURATION</p>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Settings</h1>
      <div className="mt-4 grid gap-3">
        <GlowCard className="p-4">
          <h2 className="font-semibold">Backend</h2>
          <p className="mt-1 text-sm text-slate-400">
            {supabaseReady
              ? "Supabase is configured. Auth + authoritative saves are live."
              : "Demo mode — add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local, run the SQL in supabase/migrations, and restart. See README."}
          </p>
        </GlowCard>
        <GlowCard className="p-4">
          <h2 className="font-semibold">Hero name</h2>
          <p className="mt-1 text-sm text-slate-400">Shown across your dashboard and character sheet.</p>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!/^[a-zA-Z0-9_]{3,24}$/.test(name)) {
                setMsg("Name: 3–24 chars, letters/numbers/_ only.");
                return;
              }
              setUsername(name);
              setMsg("Hero name updated.");
            }}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={24}
              aria-label="Hero name"
              className="min-w-0 flex-1 rounded-rune border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-gold-400/60"
            />
            <Button type="submit" variant="ghost" className="!min-h-[40px]">
              Save
            </Button>
          </form>
        </GlowCard>
        <GlowCard className="p-4">
          <h2 className="font-semibold">Demo data</h2>
          <p className="mt-1 text-sm text-slate-400">Reset the local demo hero, quests and vault on this device.</p>
          <Button
            variant="ghost"
            className="mt-3"
            onClick={() => {
              resetDemo();
              setMsg("Demo hero reset.");
            }}
          >
            Reset demo
          </Button>
          {msg && <p role="status" className="mt-2 text-sm text-emerald-300">{msg}</p>}
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
