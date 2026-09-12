function toDay(s) {
  const [y, m, d] = s.split("-").map(Number);
  return Date.UTC(y, m - 1, d) / 86400000;
}
export function nextStreak(prev, today) {
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
  return { current: prev.current, best: prev.best, incremented: false };
}
