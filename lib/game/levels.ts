// levels.ts — single source of truth for XP curve.
// xpRequired(level) = round(100 * level^1.5). Strictly increasing.

export function xpRequired(level: number): number {
  const l = Math.max(1, Math.floor(level));
  return Math.max(1, Math.round(100 * Math.pow(l, 1.5)));
}

/** Total cumulative XP needed to *reach* a level (sum of thresholds below it). */
export function totalXpForLevel(level: number): number {
  const l = Math.max(1, Math.floor(level));
  let total = 0;
  for (let i = 1; i < l; i++) total += xpRequired(i);
  return total;
}

/** Derive level from lifetime XP, handling multi-level jumps. */
export function levelForXp(totalXp: number): number {
  let remaining = Math.max(0, Math.floor(totalXp));
  let level = 1;
  while (level < 500) {
    const need = xpRequired(level);
    if (remaining < need) return level;
    remaining -= need;
    level += 1;
  }
  return level;
}

export interface LevelProgress {
  level: number;
  totalXp: number;
  xpIntoLevel: number;
  xpForNext: number;
  progress: number; // 0..1
}

export function progressForXp(totalXp: number): LevelProgress {
  const level = levelForXp(totalXp);
  const base = totalXpForLevel(level);
  const need = xpRequired(level);
  const into = Math.max(0, Math.floor(totalXp) - base);
  return {
    level,
    totalXp: Math.max(0, Math.floor(totalXp)),
    xpIntoLevel: into,
    xpForNext: need,
    progress: need === 0 ? 1 : Math.min(1, into / need),
  };
}
