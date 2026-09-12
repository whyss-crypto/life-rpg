import Link from "next/link";
import { Swords, Flame, Coins, Trophy, ChevronRight, Sparkles } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";

export default function LandingPage() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
  return (
    <div className="min-h-screen">
      {/* top bar */}
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
        <p className="font-display text-lg tracking-[0.25em]">
          LIFE <span className="gold-text">RPG</span>
        </p>
        <div className="flex gap-2">
          <Link
            href="/login"
            className="min-h-[40px] rounded-rune border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="min-h-[40px] rounded-rune bg-gradient-to-b from-gold-300 to-gold-600 px-4 py-2 text-sm font-semibold text-black shadow-gold-glow hover:brightness-110"
          >
            Enter the Realm
          </Link>
        </div>
      </div>

      {/* hero */}
      <main className="mx-auto w-full max-w-6xl px-4 pb-16">
        <section className="grid items-center gap-10 py-10 lg:grid-cols-2 lg:py-16" aria-label="Intro">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold-300">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Real life · Real rewards
            </p>
            <h1 className="font-display text-5xl font-bold leading-[1.05] sm:text-6xl">
              TURN YOUR LIFE
              <br />
              <span className="gold-text">INTO A QUEST.</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-slate-300">
              Complete real-world missions. Gain XP. Build your character. Level up in real life.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-rune bg-gradient-to-b from-gold-300 to-gold-600 px-6 font-semibold text-black shadow-gold-glow hover:brightness-110"
              >
                Start Your Journey <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex min-h-[48px] items-center rounded-rune border border-white/15 bg-white/5 px-6 hover:bg-white/10"
              >
                View Demo Board
              </Link>
            </div>
            {!configured && (
              <p className="mt-4 rounded-rune border border-arcane-400/30 bg-arcane-500/10 px-3 py-2 text-sm text-arcane-300">
                Demo mode is active — connect Supabase in <code>.env.local</code> to enable persistent
                multiplayer-grade saves. See README for the 2-minute setup.
              </p>
            )}
          </div>

          {/* interactive preview card */}
          <GlowCard rarity="legendary" className="animate-floaty p-5" aria-label="Quest preview">
            <p className="font-display text-xs tracking-[0.3em] text-gold-300">TODAY&apos;S QUEST</p>
            <h2 className="font-display mt-1 text-2xl font-bold">STUDY REACT — 60 MIN</h2>
            <p className="mt-1 text-sm text-slate-400">Deep work · Intellect path</p>
            <div className="mt-4 flex gap-2 text-xs font-bold">
              <span className="rounded-full bg-arcane-500/20 px-3 py-1 text-arcane-300">+120 XP</span>
              <span className="rounded-full bg-gold-500/15 px-3 py-1 text-gold-300">+25 GOLD</span>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-300">+INT</span>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-black/60" aria-hidden="true">
              <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-arcane-500 to-gold-400" />
            </div>
            <p className="mt-2 text-xs text-slate-400">1,840 / 2,200 XP · Level 12 · 8-day streak</p>
          </GlowCard>
        </section>

        {/* how it works */}
        <section aria-label="How it works" className="py-8">
          <h2 className="font-display text-center text-2xl tracking-[0.2em]">
            THE <span className="gold-text">LOOP</span>
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Swords, t: "Accept a quest", d: "Turn chores, study and training into missions with clear rewards." },
              { icon: Flame, t: "Act daily", d: "Keep your streak flame alive. One quest a day keeps the fire lit." },
              { icon: Coins, t: "Earn & spend", d: "Gold buys titles, frames, themes and badges in the Armory." },
              { icon: Trophy, t: "Become legend", d: "Levels, attributes and feats persist across every device." },
            ].map(({ icon: Icon, t, d }) => (
              <GlowCard key={t} className="p-4">
                <Icon className="h-5 w-5 text-gold-400" aria-hidden="true" />
                <h3 className="mt-2 font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-slate-400">{d}</p>
              </GlowCard>
            ))}
          </div>
        </section>

        <section className="py-10 text-center" aria-label="Final call to action">
          <div className="rune-divider mx-auto mb-8 max-w-md" aria-hidden="true" />
          <h2 className="font-display text-3xl font-bold">
            YOUR NEXT LEVEL <span className="gold-text">AWAITS.</span>
          </h2>
          <Link
            href="/signup"
            className="mt-5 inline-flex min-h-[48px] items-center rounded-rune bg-gradient-to-b from-gold-300 to-gold-600 px-8 font-semibold text-black shadow-gold-glow hover:brightness-110"
          >
            Begin — it takes 20 seconds
          </Link>
        </section>
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        Life RPG · Hackathon build · XP curve 100·N^1.5 · Authoritative Supabase engine
      </footer>
    </div>
  );
}
