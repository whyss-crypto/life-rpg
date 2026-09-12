"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

function LedgerSlip() {
  const reduce = useReducedMotion();
  const rows = [
    { k: "+120 XP", v: "Study React — 60 min", c: "text-ink" },
    { k: "+25 G", v: "Armory tithe", c: "text-gold-400" },
    { k: "+2 INT", v: "Intellect sharpened", c: "text-steel-300" },
    { k: "DAY 8", v: "Streak kept alight", c: "text-ember" },
  ];
  return (
    <div className="border hairline bg-void-900/80 backdrop-blur" aria-label="Recent rewards">
      <p className="kicker border-b hairline px-5 py-3 text-fog">Ledger — today</p>
      <ul>
        {rows.map((r, i) => (
          <motion.li
            key={r.k}
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.16, duration: 0.7, ease: EASE }}
            className="flex items-baseline justify-between gap-6 border-b hairline px-5 py-3 last:border-0"
          >
            <span className={`tnum text-sm font-semibold ${r.c}`}>{r.k}</span>
            <span className="truncate text-sm text-fog">{r.v}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function LoopIndex() {
  const steps = [
    { n: "01", t: "Name the quest", d: "A boring task, written as a mission with clear terms of done." },
    { n: "02", t: "Do the thing", d: "Study, train, read, build. The world doesn't care — your ledger does." },
    { n: "03", t: "Claim the reward", d: "XP, gold and attribute growth, settled by the server — never by wishful thinking." },
    { n: "04", t: "Compound", d: "Streaks, levels and relics stack. Showing up becomes the game." },
  ];
  return (
    <div>
      {steps.map((s, i) => (
        <Reveal key={s.n} delay={i * 0.06}>
          <div className="grid grid-cols-[auto_1fr] gap-5 border-t hairline py-7 sm:grid-cols-[80px_220px_1fr] sm:gap-8 sm:items-baseline">
            <span className="display-num text-2xl text-fog-faint">{s.n}</span>
            <h3 className="font-display text-xl font-bold text-ink sm:text-2xl">{s.t}</h3>
            <p className="col-span-2 max-w-xl text-[15px] leading-relaxed text-fog sm:col-span-1">{s.d}</p>
          </div>
        </Reveal>
      ))}
      <div className="border-t hairline" aria-hidden="true" />
    </div>
  );
}

function CurveScale() {
  // Cumulative XP gates at a few levels — the honest shape of progression.
  const marks = [
    { l: 1, xp: 0, mobile: true },
    { l: 5, xp: 1447, mobile: false },
    { l: 10, xp: 6698, mobile: true },
    { l: 15, xp: 17055, mobile: false },
    { l: 20, xp: 33144, mobile: true },
  ];
  const max = marks[marks.length - 1].xp;
  return (
    <div className="mt-10" aria-label="Experience required by level">
      <div className="relative h-px bg-white/12" aria-hidden="true">
        {marks.map((m) => (
          <div
            key={m.l}
            className={`absolute top-0 ${m.mobile ? "" : "hidden sm:block"}`}
            style={{ left: `${(m.xp / max) * 100}%` }}
          >
            <div className="h-2.5 w-px -translate-y-1 bg-gold-500" />
          </div>
        ))}
      </div>
      <div className="relative mt-3 h-16" aria-hidden="true">
        {marks.map((m) => (
          <div
            key={m.l}
            className={`absolute ${m.mobile ? "" : "hidden sm:block"}`}
            style={{ left: `${(m.xp / max) * 100}%` }}
          >
            <p className="display-num -translate-x-1/2 whitespace-nowrap text-sm text-ink">Lv {m.l}</p>
            <p className="tnum -translate-x-1/2 whitespace-nowrap text-xs text-fog-faint">
              {m.xp.toLocaleString()} XP
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const reduce = useReducedMotion();
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="font-display text-sm tracking-[0.3em] text-ink" aria-label="Life RPG home">
          LIFE&nbsp;RPG
        </Link>
        <nav className="flex items-center gap-5 text-sm" aria-label="Account">
          <Link href="/login" className="press text-fog transition hover:text-ink">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="press rounded-sharp bg-ink px-4 py-2 font-semibold text-black"
          >
            Begin
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        {/* HERO — one idea: the numeral field + the ledger */}
        <section className="relative overflow-hidden pb-16 pt-10 sm:pt-16" aria-label="Introduction">
          <motion.p
            aria-hidden="true"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="display-num pointer-events-none absolute -right-6 top-0 select-none text-[42vw] font-bold leading-none sm:text-[24rem] lg:text-[30rem]"
            style={{ WebkitTextStroke: "1px rgba(236,231,218,0.16)", color: "transparent" }}
          >
            12
          </motion.p>

          <div className="relative max-w-2xl">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="kicker text-gold-400"
            >
              A productivity game
            </motion.p>
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="font-display mt-5 text-5xl font-bold leading-[1.02] text-ink sm:text-7xl"
            >
              Turn your life
              <br />
              into a quest.
            </motion.h1>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.22, ease: EASE }}
              className="mt-6 max-w-md text-lg leading-relaxed text-fog"
            >
              Real tasks become missions. Completion pays XP, gold and character growth —
              settled by the server, kept by your streak.
            </motion.p>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.34, ease: EASE }}
              className="mt-8 flex flex-wrap items-center gap-5"
            >
              <Link
                href="/signup"
                className="press inline-flex min-h-[52px] items-center gap-2 rounded-sharp bg-ink px-7 font-semibold text-black"
              >
                Start your journey <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/login"
                className="press group inline-flex items-center gap-1 text-[15px] text-fog transition hover:text-ink"
              >
                Already playing? Sign in
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="relative z-10 mt-12 max-w-sm sm:ml-auto sm:-mt-10 sm:w-80"
          >
            <LedgerSlip />
          </motion.div>
        </section>

        {/* 01 — THE LOOP */}
        <section className="py-14 sm:py-20" aria-label="How it works">
          <Reveal>
            <p className="kicker text-fog-faint">01 — The loop</p>
            <h2 className="font-display mt-3 max-w-xl text-3xl font-bold text-ink sm:text-4xl">
              Boring work in.
              Character out.
            </h2>
          </Reveal>
          <div className="mt-10">
            <LoopIndex />
          </div>
        </section>

        {/* 02 — A REAL PAGE FROM THE GAME */}
        <section className="py-14 sm:py-20" aria-label="Sample quests">
          <Reveal>
            <p className="kicker text-fog-faint">02 — From the board</p>
            <h2 className="font-display mt-3 max-w-xl text-3xl font-bold text-ink sm:text-4xl">
              Every new hero starts here.
            </h2>
          </Reveal>
          <div className="mt-10 border-t hairline">
            {[
              { t: "Study for 30 minutes", d: "One subject. Phone in another room.", m: "Intellect · Easy", xp: "+50 XP", g: "+10 G" },
              { t: "Walk for 20 minutes", d: "Outside. No podcast required.", m: "Endurance · Easy", xp: "+50 XP", g: "+10 G" },
              { t: "Read 10 pages", d: "Any book. Mark one line worth keeping.", m: "Wisdom · Easy", xp: "+50 XP", g: "+10 G" },
            ].map((q) => (
              <Reveal key={q.t}>
                <div className="grid gap-2 border-b hairline py-6 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-ink">{q.t}</h3>
                    <p className="mt-1 text-[15px] text-fog">{q.d}</p>
                    <p className="kicker mt-3 !text-[10px] text-fog-faint">{q.m}</p>
                  </div>
                  <p className="tnum text-sm font-semibold text-ink">
                    {q.xp} <span className="ml-3 text-gold-400">{q.g}</span>
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-5 text-sm text-fog-faint">
              Starter quests, granted to every new character. After that, the board is yours to fill.
            </p>
          </Reveal>
        </section>

        {/* 03 — PROGRESSION, HONESTLY */}
        <section className="py-14 sm:py-20" aria-label="Progression">
          <Reveal>
            <p className="kicker text-fog-faint">03 — Progression</p>
            <h2 className="font-display mt-3 max-w-xl text-3xl font-bold text-ink sm:text-4xl">
              Later levels demand more.
              That&apos;s the point.
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-fog">
              Each level costs more than the last — 100 × N<sup>1.5</sup> experience, to be exact.
              No flat treadmills. Plateaus are earned, and so is breaking them.
            </p>
          </Reveal>
          <Reveal>
            <CurveScale />
          </Reveal>
        </section>

        {/* FINAL */}
        <section className="border-t hairline py-16 sm:py-24" aria-label="Begin">
          <div className="max-w-2xl">
            <Reveal>
              <h2 className="font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
                Your next level
                <br />
                is a quest away.
              </h2>
              <Link
                href="/signup"
                className="press mt-8 inline-flex min-h-[52px] items-center gap-2 rounded-sharp bg-ink px-7 font-semibold text-black"
              >
                Forge your character <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 border-t hairline px-5 py-6 text-xs text-fog-faint sm:px-8">
        <p className="font-display tracking-[0.3em]">LIFE RPG</p>
        <p>Quests · XP · Streaks · Relics</p>
      </footer>
    </div>
  );
}
