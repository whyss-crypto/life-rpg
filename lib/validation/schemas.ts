import { z } from "zod";

export const questSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().trim().max(500).optional().default(""),
  category: z.string().trim().min(1).max(40).default("personal"),
  difficulty: z.enum(["easy", "normal", "hard", "epic"]).default("normal"),
  dueAt: z.string().optional().nullable(),
});

export const signupSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(24)
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and _ only"),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type QuestInput = z.infer<typeof questSchema>;
