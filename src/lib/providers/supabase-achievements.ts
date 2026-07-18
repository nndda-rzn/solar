import { createClient } from "@/utils/supabase/client";
import {
  Achievement,
  AchievementRow,
  AchievementDefinition,
  mapAchievementRow,
} from "@/types/achievement";

export const supabaseAchievementProvider = {
  async list(userId: string): Promise<Achievement[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("user_id", userId)
      .order("earned_at", { ascending: false });
    if (error) throw error;
    return ((data as AchievementRow[]) ?? []).map(mapAchievementRow);
  },

  async award(
    userId: string,
    definition: AchievementDefinition,
    description: string,
  ): Promise<Achievement | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("achievements")
      .insert({
        user_id: userId,
        achievement_type: definition.id,
        title: definition.title,
        description,
        icon: definition.icon,
        xp_reward: definition.xp,
      })
      .select()
      .single();
    if (error) {
      if (error.code === "23505") return null;
      throw error;
    }
    return mapAchievementRow(data as AchievementRow);
  },
};
