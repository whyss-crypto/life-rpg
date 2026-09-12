"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/components/providers/GameProvider";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/primitives";
import { GlowCard } from "@/components/ui/GlowCard";

export default function SettingsPage() {
  const { resetDemo } = useGame();
  const router = useRouter();
  const [msg, setMsg] = useState("");
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
