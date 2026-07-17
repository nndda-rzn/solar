import { createClient } from "@/utils/supabase/client";
import {
  Bookmark,
  BookmarkRow,
  BookmarkCreatePayload,
  mapBookmarkRow,
} from "@/types/bookmark";

export const supabaseBookmarkProvider = {
  async list(userId: string): Promise<Bookmark[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return ((data as BookmarkRow[]) ?? []).map(mapBookmarkRow);
  },

  async create(
    userId: string,
    payload: BookmarkCreatePayload,
  ): Promise<Bookmark> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("bookmarks")
      .insert({
        user_id: userId,
        name: payload.name,
        camera_position: payload.cameraPosition,
        camera_target: payload.cameraTarget,
        selected_object: payload.selectedObject,
        selected_type: payload.selectedType,
        day_offset: payload.dayOffset,
        scale: payload.scale,
        thumbnail_url: payload.thumbnailUrl,
      })
      .select()
      .single();
    if (error) throw error;
    return mapBookmarkRow(data as BookmarkRow);
  },

  async rename(id: string, name: string): Promise<Bookmark> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("bookmarks")
      .update({ name })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return mapBookmarkRow(data as BookmarkRow);
  },

  async remove(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
    if (error) throw error;
  },
};
