"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/primitives";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError(err.message);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Auth backend not connected. Use the demo board or add Supabase env vars."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4">
      <p className="font-display text-center text-sm tracking-[0.3em] text-gold-300">WELCOME BACK, HERO</p>
      <h1 className="font-display mt-2 text-center text-3xl font-bold">Sign in</h1>
      <form onSubmit={submit} className="card-surface mt-6 rounded-rune p-6">
        <label className="mb-3 block">
          <span className="mb-1 block text-sm">Email</span>
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full rounded-rune border border-white/10 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-gold-400/60"
          />
        </label>
        <label className="mb-4 block">
          <span className="mb-1 block text-sm">Password</span>
          <input
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-rune border border-white/10 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-gold-400/60"
          />
        </label>
        {error && <p role="alert" className="mb-3 text-sm text-blood">{error}</p>}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Entering…" : "Enter the Realm"}
        </Button>
        <p className="mt-4 text-center text-sm text-slate-400">
          New here? <Link href="/signup" className="text-gold-300 underline">Create an account</Link>
          {" · "}
          <Link href="/dashboard" className="text-slate-300 underline">Try demo board</Link>
        </p>
      </form>
    </main>
  );
}
