"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Swords, User, ShoppingBag, Backpack, Trophy, Settings } from "lucide-react";
import { useGame } from "@/components/providers/GameProvider";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { progressForXp } from "@/lib/game/levels";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/quests", label: "Quests", icon: Swords },
  { href: "/character", label: "Character", icon: User },
  { href: "/shop", label: "Armory", icon: ShoppingBag },
  { href: "/inventory", label: "Vault", icon: Backpack },
  { href: "/achievements", label: "Feats", icon: Trophy },
  { href: "/settings", label: "Settings", icon: Settings },
];

function Identity() {
  const { status, state } = useGame();
  if (status !== "ready") {
    return (
      <div className="px-3 py-2" aria-hidden="true">
        <div className="h-4 w-24 animate-pulse rounded-sharp bg-white/[0.07]" />
        <div className="mt-2 h-3 w-16 animate-pulse rounded-sharp bg-white/[0.05]" />
      </div>
    );
  }
  const c = state.character;
  const prog = progressForXp(c.xp);
  return (
    <div className="px-3 py-2">
      <div className="flex items-baseline gap-2">
        <span className="display-num text-xl font-bold text-ink">{c.level}</span>
        <span className="truncate text-sm font-medium text-ink" title={state.username}>
          {state.username || "Adventurer"}
        </span>
      </div>
      <p className="tnum mt-1 text-[11px] tracking-wide text-fog">
        LEVEL {c.level} · <AnimatedNumber value={prog.xpIntoLevel} />/{prog.xpForNext.toLocaleString()} XP
      </p>
      <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-white/[0.07]" aria-hidden="true">
        <div className="h-full bg-gold-500" style={{ width: `${Math.round(prog.progress * 100)}%` }} />
      </div>
    </div>
  );
}

export function GameNav() {
  const path = usePathname();
  return (
    <>
      {/* Desktop rail */}
      <aside className="hidden w-60 shrink-0 flex-col border-r hairline py-6 lg:flex" aria-label="Primary">
        <Link href="/" className="px-5 font-display text-[13px] tracking-[0.3em] text-ink" aria-label="Life RPG home">
          LIFE&nbsp;RPG
        </Link>
        <div className="mt-5 border-y hairline py-3">
          <Identity />
        </div>
        <nav className="mt-2 flex flex-col px-2" aria-label="Sections">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = path === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "press relative flex items-center gap-3 rounded-sharp px-3 py-2.5 text-[15px]",
                  active ? "bg-white/[0.05] text-ink" : "text-fog hover:text-ink"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 bg-gold-500" aria-hidden="true" />
                )}
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
        <StreakFoot />
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t hairline bg-void-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
        aria-label="Primary mobile"
      >
        <div className="grid grid-cols-6 px-1 py-1.5">
          {LINKS.slice(0, 6).map(({ href, label, icon: Icon }, i) => {
            const active = path === href;
            const short = ["Home", "Quests", "Hero", "Shop", "Vault", "Feats"][i] ?? label;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                aria-label={label}
                className={cn(
                  "relative flex min-h-[54px] min-w-0 flex-col items-center justify-center gap-1 px-0.5 text-[10px]",
                  active ? "text-ink" : "text-fog-faint"
                )}
              >
                {active && (
                  <span className="absolute top-0 h-[2px] w-8 bg-gold-500" aria-hidden="true" />
                )}
                <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                <span className="truncate">{short}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

function StreakFoot() {
  const { status, state } = useGame();
  if (status !== "ready") return null;
  const s = state.character.current_streak;
  const b = state.character.best_streak;
  return (
    <div className="mt-auto px-5 pt-6">
      <p className="kicker !text-[10px] text-fog-faint">Streak</p>
      <p className="tnum mt-1 text-sm text-fog">
        Day <span className="font-semibold text-ember">{s}</span>
        <span className="text-fog-faint"> · best {b}</span>
      </p>
    </div>
  );
}
