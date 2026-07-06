export interface Profile {
  id: string;
  email: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  level: number;
  xp: number;
  preferences: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/** Raw row shape as returned by Supabase (snake_case columns). */
export interface ProfileRow {
  id: string;
  email: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  level: number;
  xp: number;
  preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export function mapProfileRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    bio: row.bio,
    level: row.level,
    xp: row.xp,
    preferences: row.preferences ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface ProfileFormValues {
  displayName: string;
  bio: string;
  avatarUrl: string;
}
