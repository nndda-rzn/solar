import { createClient } from "@/utils/supabase/client";
import {
  Progress,
  ProgressCategory,
  ProgressRow,
  mapProgressRow,
} from "@/types/progress";

export const supabaseProgressProvider = {
  async list(userId: string): Promise<Progress[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false });
    if (error) throw error;
    return ((data as ProgressRow[]) ?? []).map(mapProgressRow);
  },

  async track(
    userId: string,
    category: ProgressCategory,
    targetId: string,
    metadata?: Record<string, unknown>,
  ): Promise<Progress | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("progress")
      .insert({
        user_id: userId,
        category,
        target_id: targetId,
        metadata: metadata ?? {},
      })
      .select()
      .single();
    if (error) {
      if (error.code === "23505") return null;
      throw error;
    }
    return mapProgressRow(data as ProgressRow);
  },

  async hasProgress(
    userId: string,
    category: ProgressCategory,
    targetId: string,
  ): Promise<boolean> {
    const supabase = createClient();
    const { count, error } = await supabase
      .from("progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("category", category)
      .eq("target_id", targetId);
    if (error) throw error;
    return (count ?? 0) > 0;
  },

  async delete(
    userId: string,
    category: ProgressCategory,
    targetId: string,
  ): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("progress")
      .delete()
      .eq("user_id", userId)
      .eq("category", category)
      .eq("target_id", targetId);
    if (error) throw error;
  },
};
