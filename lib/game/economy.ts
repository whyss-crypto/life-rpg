import type { Difficulty } from "./attributes";

export const REWARDS: Record<Difficulty, { xp: number; gold: number; attrPoints: number }> = {
  easy: { xp: 50, gold: 10, attrPoints: 1 },
  normal: { xp: 100, gold: 20, attrPoints: 2 },
  hard: { xp: 175, gold: 35, attrPoints: 3 },
  epic: { xp: 300, gold: 60, attrPoints: 5 },
};

export function rewardsFor(difficulty: string): { xp: number; gold: number; attrPoints: number } {
  const d = difficulty.toLowerCase() as Difficulty;
  return REWARDS[d] ?? REWARDS.normal;
}
