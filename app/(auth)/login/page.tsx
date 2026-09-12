"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/primitives";
import { loginSchema } from "@/lib/validation/schemas";

const inputCls =
  "w-full rounded-sharp border hairline bg-black/40 px-3.5 py-2.5 text-[15px] text-ink outline-none placeholder:text-fog-faint focus:border-gold-500/60";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    params.get("error") === "expired"
      ? "That sign-in link expired or was already used. Please sign in again."
      : ""
  );
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your details and try again.");
      return;
    }
    setPending(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      if (err) {
        setError(err.message);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Sign-in failed. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
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
  );
}

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5">
      <p className="kicker text-gold-400">Welcome back, hero</p>
      <h1 className="font-display mt-3 text-4xl font-bold text-ink">Sign in</h1>
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
