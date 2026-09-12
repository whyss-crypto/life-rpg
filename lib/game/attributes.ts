export type AttributeKey = "strength" | "intellect" | "endurance" | "wisdom" | "focus";
export type Difficulty = "easy" | "normal" | "hard" | "epic";

export const ATTRIBUTES: Array<{
  key: AttributeKey;
  label: string;
  icon: string;
  blurb: string;
}> = [
  { key: "strength", label: "Strength", icon: "dumbbell", blurb: "Body & discipline" },
  { key: "intellect", label: "Intellect", icon: "brain", blurb: "Code & study" },
  { key: "endurance", label: "Endurance", icon: "activity", blurb: "Run & stamina" },
  { key: "wisdom", label: "Wisdom", icon: "book", blurb: "Reading & reflection" },
  { key: "focus", label: "Focus", icon: "crosshair", blurb: "Deep work & calm" },
];

export const CATEGORIES: Array<{ key: string; label: string; attribute: AttributeKey }> = [
  { key: "coding", label: "Coding", attribute: "intellect" },
  { key: "study", label: "Study", attribute: "intellect" },
  { key: "fitness", label: "Fitness", attribute: "strength" },
  { key: "running", label: "Running", attribute: "endurance" },
  { key: "reading", label: "Reading", attribute: "wisdom" },
  { key: "health", label: "Health", attribute: "endurance" },
  { key: "focus", label: "Deep Work", attribute: "focus" },
  { key: "creative", label: "Creative", attribute: "wisdom" },
  { key: "personal", label: "Personal", attribute: "focus" },
];

export function attributeForCategory(category: string): AttributeKey {
  const found = CATEGORIES.find((c) => c.key === category.toLowerCase());
  return found ? found.attribute : "focus";
}

export function attributeLabel(key: string): string {
  return ATTRIBUTES.find((a) => a.key === key)?.label ?? key;
}
