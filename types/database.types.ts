export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      characters: {
        Row: {
          user_id: string;
          level: number;
          xp: number;
          gold: number;
          strength: number;
          intellect: number;
          endurance: number;
          wisdom: number;
          focus: number;
          current_streak: number;
          best_streak: number;
          last_activity_date: string | null;
          equipped_title: string | null;
          equipped_frame: string | null;
          equipped_theme: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          level?: number;
          xp?: number;
          gold?: number;
          strength?: number;
          intellect?: number;
          endurance?: number;
          wisdom?: number;
          focus?: number;
          current_streak?: number;
          best_streak?: number;
          last_activity_date?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["characters"]["Insert"]> & {
          equipped_title?: string | null;
          equipped_frame?: string | null;
          equipped_theme?: string | null;
          updated_at?: string;
        };
      };
      quests: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: string;
          difficulty: string;
          xp_reward: number;
          gold_reward: number;
          attribute_reward: string;
          attribute_points: number;
          is_completed: boolean;
          due_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          category: string;
          difficulty?: string;
          xp_reward: number;
          gold_reward: number;
          attribute_reward: string;
          attribute_points?: number;
          is_completed?: boolean;
          due_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["quests"]["Insert"]>;
      };
      quest_completions: {
        Row: {
          id: string;
          quest_id: string;
          user_id: string;
          completed_at: string;
          xp_earned: number;
          gold_earned: number;
          attribute: string;
          attribute_points: number;
        };
        Insert: {
          id?: string;
          quest_id: string;
          user_id: string;
          completed_at?: string;
          xp_earned: number;
          gold_earned: number;
          attribute: string;
          attribute_points: number;
        };
        Update: Partial<Database["public"]["Tables"]["quest_completions"]["Insert"]>;
      };
      items: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          type: string;
          rarity: string;
          price: number;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          type: string;
          rarity?: string;
          price: number;
          metadata?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["items"]["Insert"]>;
      };
      inventory: {
        Row: {
          id: string;
          user_id: string;
          item_id: string;
          purchased_at: string;
          equipped: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_id: string;
          purchased_at?: string;
          equipped?: boolean;
        };
        Update: { equipped?: boolean };
      };
      achievements: {
        Row: {
          id: string;
          name: string;
          description: string;
          type: string;
          threshold: number | null;
          metadata: Json;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          type: string;
          threshold?: number | null;
          metadata?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["achievements"]["Insert"]>;
      };
      user_achievements: {
        Row: { user_id: string; achievement_id: string; unlocked_at: string };
        Insert: { user_id: string; achievement_id: string; unlocked_at?: string };
        Update: Record<string, never>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      complete_quest: {
        Args: { p_quest_id: string };
        Returns: Json;
      };
      purchase_item: {
        Args: { p_item_id: string };
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
