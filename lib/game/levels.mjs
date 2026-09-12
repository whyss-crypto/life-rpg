export function xpRequired(level) {
  const l = Math.max(1, Math.floor(level));
  return Math.max(1, Math.round(100 * Math.pow(l, 1.5)));
}
export function totalXpForLevel(level) {
  const l = Math.max(1, Math.floor(level));
  let total = 0;
  for (let i = 1; i < l; i++) total += xpRequired(i);
  return total;
}
export function levelForXp(totalXp) {
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
export function progressForXp(totalXp) {
  const level = levelForXp(totalXp);
  const base = totalXpForLevel(level);
  const need = xpRequired(level);
  const into = Math.max(0, Math.floor(totalXp) - base);
  return { level, totalXp: Math.max(0, Math.floor(totalXp)), xpIntoLevel: into, xpForNext: need, progress: need === 0 ? 1 : Math.min(1, into / need) };
}
