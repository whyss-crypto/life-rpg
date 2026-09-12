"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/primitives";

const inputCls =
  "w-full rounded-sharp border hairline bg-black/40 px-3.5 py-2.5 text-[15px] text-ink outline-none placeholder:text-fog-faint focus:border-gold-500/60";

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
      setError(err instanceof Error ? err.message : "Sign-in failed. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5">
      <p className="kicker text-gold-400">Welcome back, hero</p>
      <h1 className="font-display mt-3 text-4xl font-bold text-ink">Sign in</h1>
      <form onSubmit={submit} className="mt-8 border-t hairline pt-8">
        <label className="block">
          <span className="kicker mb-2 block !text-[10px] text-fog-faint">Email</span>
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            autoComplete="email" className={inputCls}
          />
        </label>
        <label className="mt-4 block">
          <span className="kicker mb-2 block !text-[10px] text-fog-faint">Password</span>
          <input
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password" className={inputCls}
          />
        </label>
        {error && <p role="alert" className="mt-4 text-sm text-blood">{error}</p>}
        <Button type="submit" disabled={pending} className="mt-6 w-full !min-h-[52px]">
          {pending ? "Entering…" : "Enter the realm"}
        </Button>
        <p className="mt-6 text-center text-sm text-fog">
          New here? <Link href="/signup" className="text-ink underline decoration-white/25 underline-offset-4 hover:decoration-white/60">Create an account</Link>
        </p>
      </form>
    </main>
  );
}
