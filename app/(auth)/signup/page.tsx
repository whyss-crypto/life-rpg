"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/primitives";
import { useGame } from "@/components/providers/GameProvider";

const DEMO_MODE =
  !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export default function SignupPage() {
  const router = useRouter();
  const { setUsername: saveHeroName } = useGame();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
      setError("Username: 3–24 chars, letters/numbers/_ only.");
      return;
    }
    setPending(true);
    if (DEMO_MODE) {
      // No backend connected: forge a local demo hero so signup never dead-ends.
      saveHeroName(username);
      router.push("/dashboard");
      return;
    }
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data, error: err } = await supabase.auth.signUp({ email, password });
      if (err) {
        setError(err.message);
        return;
      }
      const user = data.user;
      if (user) {
        // Create profile + character rows (RLS owner policies allow this).
        await supabase.from("profiles").insert({
          id: user.id,
          username,
          display_name: username,
        });
        await supabase.from("characters").insert({ user_id: user.id });
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup unavailable — Supabase not connected.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4">
      <p className="font-display text-center text-sm tracking-[0.3em] text-gold-300">BEGIN YOUR LEGEND</p>
      <h1 className="font-display mt-2 text-center text-3xl font-bold">Create account</h1>
      {DEMO_MODE && (
        <p role="note" className="mt-4 rounded-rune border border-gold-400/30 bg-gold-500/10 px-3 py-2 text-center text-sm text-gold-300">
          Demo mode — no cloud connected. Your hero will be forged on this device.
        </p>
      )}
      <form onSubmit={submit} className="card-surface mt-6 rounded-rune p-6">
        <label className="mb-3 block">
          <span className="mb-1 block text-sm">Username</span>
          <input
            value={username} onChange={(e) => setUsername(e.target.value)} required
            placeholder="dragon_slayer_01" maxLength={24} autoComplete="username"
            className="w-full rounded-rune border border-white/10 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-gold-400/60"
          />
        </label>
        <label className="mb-3 block">
          <span className="mb-1 block text-sm">Email</span>
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full rounded-rune border border-white/10 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-gold-400/60"
          />
        </label>
        <label className="mb-4 block">
          <span className="mb-1 block text-sm">Password (min 6 chars)</span>
          <input
            type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full rounded-rune border border-white/10 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-gold-400/60"
          />
        </label>
        {error && <p role="alert" className="mb-3 text-sm text-blood">{error}</p>}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Forging character…" : "Forge Character"}
        </Button>
        <p className="mt-4 text-center text-sm text-slate-400">
          Have an account? <Link href="/login" className="text-gold-300 underline">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
