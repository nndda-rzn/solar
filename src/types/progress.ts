export type ProgressCategory =
  | "visited_planet"
  | "visited_star"
  | "visited_constellation"
  | "search_used"
  | "scale_reached"
  | "time_traveled"
  | "bookmark_created"
  | "panel_opened"
  | "speed_reached"
  | "library_accessed";

export interface Progress {
  id: string;
  userId: string;
  category: ProgressCategory;
  targetId: string;
  metadata: Record<string, unknown>;
  completedAt: string;
}

export interface ProgressRow {
  id: string;
  user_id: string;
  category: string;
  target_id: string;
  metadata: Record<string, unknown>;
  completed_at: string;
}

export function mapProgressRow(row: ProgressRow): Progress {
  return {
    id: row.id,
    userId: row.user_id,
    category: row.category as ProgressCategory,
    targetId: row.target_id,
    metadata: row.metadata ?? {},
    completedAt: row.completed_at,
  };
}
