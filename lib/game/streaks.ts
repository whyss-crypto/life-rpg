// streaks.ts — calendar-day streak logic. Pure + testable.
// Policy: dates are YYYY-MM-DD strings in the product timezone (UTC day by default).

function toDay(s: string): number {
  const [y, m, d] = s.split("-").map(Number);
  return Date.UTC(y, m - 1, d) / 86400000;
}

export interface StreakState {
  current: number;
  best: number;
  lastDate: string | null;
}

export function nextStreak(
  prev: StreakState,
  today: string
): { current: number; best: number; incremented: boolean } {
  if (!prev.lastDate) {
    return { current: 1, best: Math.max(1, prev.best), incremented: true };
  }
  if (prev.lastDate === today) {
    return { current: prev.current, best: prev.best, incremented: false };
  }
  const diff = toDay(today) - toDay(prev.lastDate);
  if (diff === 1) {
    const current = prev.current + 1;
    return { current, best: Math.max(prev.best, current), incremented: true };
  }
  if (diff > 1) {
    return { current: 1, best: prev.best, incremented: true };
  }
  // today is before lastDate (clock skew) — keep state
  return { current: prev.current, best: prev.best, incremented: false };
}
