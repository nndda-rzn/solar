import { ProgressCategory } from "./progress";

export type AchievementCategory = "explorer" | "mastery" | "quest";

export type RuleType =
  "count_unique" | "has_target" | "count_total" | "time_window" | "combination";

export interface Rule {
  type: RuleType;
  category: ProgressCategory;
  threshold?: number;
  targetId?: string;
  windowMs?: number;
  rules?: Rule[];
  operator?: "and" | "or";
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: { en: string; id: string };
  icon: string;
  category: AchievementCategory;
  xp: number;
  rule: Rule;
  hidden?: boolean;
}

export interface Achievement {
  id: string;
  userId: string;
  achievementType: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  earnedAt: string;
  metadata: Record<string, unknown>;
}

export interface AchievementRow {
  id: string;
  user_id: string;
  achievement_type: string;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
  earned_at: string;
  metadata: Record<string, unknown>;
}

export function mapAchievementRow(row: AchievementRow): Achievement {
  return {
    id: row.id,
    userId: row.user_id,
    achievementType: row.achievement_type,
    title: row.title,
    description: row.description,
    icon: row.icon,
    xpReward: row.xp_reward,
    earnedAt: row.earned_at,
    metadata: row.metadata ?? {},
  };
}
