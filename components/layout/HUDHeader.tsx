"use client";

import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { XpProgressBar } from "@/components/rpg/XpProgressBar";
import { progressForXp } from "@/lib/game/levels";

/**
 * Character anchor — the primary visual landmark of every game screen.
 * Open composition: numeral, name, rule, figures. No container.
 */
export function HUDHeader({
  name,
  level,
  xp,
  gold,
  streak,
  title,
}: {
  name?: string;
  level: number;
  xp: number;
  gold: number;
  streak: number;
  title?: string | null;
}) {
  const prog = progressForXp(xp);
  return (
    <header className="border-y hairline py-6 sm:py-8" aria-label="Character status">
      <div className="flex flex-wrap items-end gap-x-10 gap-y-6">
        <div className="flex items-end gap-5">
          <p className="display-num text-7xl font-bold leading-none text-ink sm:text-8xl" aria-label={`Level ${level}`}>
            {level}
          </p>
          <div className="pb-1.5">
            <p className="kicker text-fog-faint">Level</p>
            <p className="font-display mt-1 max-w-[220px] truncate text-xl font-bold text-ink" title={name}>
              {name || "Adventurer"}
            </p>
            {title && <p className="mt-0.5 text-sm italic text-steel-300">«{title}»</p>}
          </div>
        </div>

        <dl className="flex gap-8 pb-1.5 sm:ml-auto">
          <div>
            <dt className="kicker !text-[10px] text-fog-faint">Gold</dt>
            <dd className="tnum mt-1 text-2xl font-semibold text-gold-400" data-hud="gold">
              <AnimatedNumber value={gold} ariaLabel={`${gold} gold`} />
            </dd>
          </div>
          <div>
            <dt className="kicker !text-[10px] text-fog-faint">Streak</dt>
            <dd className="tnum mt-1 text-2xl font-semibold text-ink" aria-live="polite">
              {streak}
              <span className="ml-1 text-sm font-normal text-fog-faint">day{streak === 1 ? "" : "s"}</span>
            </dd>
          </div>
          <div className="hidden sm:block">
            <dt className="kicker !text-[10px] text-fog-faint">Lifetime XP</dt>
            <dd className="tnum mt-1 text-2xl font-semibold text-ink" data-hud="xp">
              <AnimatedNumber value={xp} ariaLabel={`${xp} total experience`} />
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-5 flex items-baseline gap-4">
        <XpProgressBar progress={prog.progress} className="flex-1" />
        <p className="tnum shrink-0 text-xs text-fog" aria-live="polite">
          <AnimatedNumber value={prog.xpIntoLevel} /> / {prog.xpForNext.toLocaleString()} XP
        </p>
      </div>
    </header>
  );
}
