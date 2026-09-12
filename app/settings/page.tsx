"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/components/providers/GameProvider";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/primitives";

const inputCls =
  "min-w-0 flex-1 rounded-sharp border hairline bg-black/40 px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-gold-500/60";

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
    setMsg("The realm knows you by the new name.");
  }

  return (
    <AppShell>
      <p className="kicker text-fog-faint">Configuration</p>
      <h1 className="font-display mt-2 text-3xl font-bold text-ink sm:text-4xl">Settings</h1>

      <section className="mt-8 border-t hairline pt-6" aria-label="Hero name">
        <h2 className="text-lg font-semibold text-ink">Hero name</h2>
        <p className="mt-1 text-[15px] text-fog">Written beside your level, everywhere.</p>
        <form className="mt-4 flex max-w-md gap-3" onSubmit={(e) => void saveName(e)}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            aria-label="Hero name"
            className={inputCls}
          />
          <Button type="submit" variant="ghost" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </form>
        {msg && (
          <p role={isError ? "alert" : "status"} className={`mt-3 text-sm ${isError ? "text-blood" : "text-moss"}`}>
            {msg}
          </p>
        )}
      </section>

      <section className="mt-8 border-t hairline pt-6" aria-label="Cloud saves">
        <h2 className="text-lg font-semibold text-ink">Cloud saves</h2>
        <p className="mt-1 max-w-md text-[15px] leading-relaxed text-fog">
          Your hero lives in the database — progress follows you across devices and survives refreshes.
        </p>
      </section>

      <section className="mt-8 border-t border-b hairline py-6" aria-label="Session">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">Session</h2>
            <p className="mt-1 text-[15px] text-fog">Leave this device.</p>
          </div>
          <Button variant="danger" onClick={() => void logout()}>
            Log out
          </Button>
        </div>
      </section>
    </AppShell>
  );
}
