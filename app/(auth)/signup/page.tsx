"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/primitives";

const inputCls =
  "w-full rounded-sharp border hairline bg-black/40 px-3.5 py-2.5 text-[15px] text-ink outline-none placeholder:text-fog-faint focus:border-gold-500/60";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
      setError("Username: 3–24 chars, letters/numbers/_ only.");
      return;
    }
    setPending(true);
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
        await supabase.from("profiles").insert({
          id: user.id,
          username,
          display_name: username,
        });
        await supabase.from("characters").insert({ user_id: user.id });
      }
      if (!data.session) {
        setInfo("Account forged. Check your email to confirm it, then sign in.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5">
      <p className="kicker text-gold-400">Begin your legend</p>
      <h1 className="font-display mt-3 text-4xl font-bold text-ink">Create account</h1>
      <form onSubmit={submit} className="mt-8 border-t hairline pt-8">
        <label className="block">
          <span className="kicker mb-2 block !text-[10px] text-fog-faint">Username</span>
          <input
            value={username} onChange={(e) => setUsername(e.target.value)} required
            placeholder="dragon_slayer_01" maxLength={24} autoComplete="username"
            className={inputCls}
          />
        </label>
        <label className="mt-4 block">
          <span className="kicker mb-2 block !text-[10px] text-fog-faint">Email</span>
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            autoComplete="email" className={inputCls}
          />
        </label>
        <label className="mt-4 block">
          <span className="kicker mb-2 block !text-[10px] text-fog-faint">Password · min 6</span>
          <input
            type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password" className={inputCls}
          />
        </label>
        {error && <p role="alert" className="mt-4 text-sm text-blood">{error}</p>}
        {info && <p role="status" className="mt-4 text-sm text-moss">{info}</p>}
        <Button type="submit" disabled={pending} className="mt-6 w-full !min-h-[52px]">
          {pending ? "Forging character…" : "Forge character"}
        </Button>
        <p className="mt-6 text-center text-sm text-fog">
          Have an account? <Link href="/login" className="text-ink underline decoration-white/25 underline-offset-4 hover:decoration-white/60">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
