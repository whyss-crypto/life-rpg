export const REWARDS = {
  easy: { xp: 50, gold: 10, attrPoints: 1 },
  normal: { xp: 100, gold: 20, attrPoints: 2 },
  hard: { xp: 175, gold: 35, attrPoints: 3 },
  epic: { xp: 300, gold: 60, attrPoints: 5 },
};
export function rewardsFor(difficulty) {
  const d = String(difficulty).toLowerCase();
  return REWARDS[d] ?? REWARDS.normal;
}
export function isDifficulty(v) {
  return ["easy", "normal", "hard", "epic"].includes(String(v).toLowerCase());
}
