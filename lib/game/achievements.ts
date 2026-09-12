export interface AchievementRule {
  name: string;
  description: string;
  check: (s: { totalQuests: number; totalXp: number; level: number; streak: number }) => boolean;
}

export const ACHIEVEMENT_RULES: AchievementRule[] = [
  {
    name: "FIRST QUEST",
    description: "Complete your first quest.",
    check: (s) => s.totalQuests >= 1,
  },
  {
    name: "WEEK WARRIOR",
    description: "Reach a 7-day streak.",
    check: (s) => s.streak >= 7,
  },
  {
    name: "CENTURION",
    description: "Earn 1000 lifetime XP.",
    check: (s) => s.totalXp >= 1000,
  },
  {
    name: "QUEST MASTER",
    description: "Complete 50 quests.",
    check: (s) => s.totalQuests >= 50,
  },
  {
    name: "LEVEL 10",
    description: "Reach level 10.",
    check: (s) => s.level >= 10,
  },
  {
    name: "DISCIPLINED",
    description: "Maintain a 14-day streak.",
    check: (s) => s.streak >= 14,
  },
];

export function evaluateAchievements(
  stats: { totalQuests: number; totalXp: number; level: number; streak: number },
  alreadyUnlocked: string[] = []
): string[] {
  const owned = new Set(alreadyUnlocked);
  return ACHIEVEMENT_RULES.filter((r) => !owned.has(r.name) && r.check(stats)).map((r) => r.name);
}
