-- =====================================================================
-- Cosmic Explorer — Bookmarks, Achievements, Progress tables (Phase 2)
-- Run this in the Supabase Dashboard → SQL Editor for your project.
-- =====================================================================

-- Ensure UUID extension
create extension if not exists "uuid-ossp";

-- =============================================================================
-- 1. Bookmarks table
-- =============================================================================
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  camera_position jsonb not null,
  camera_target jsonb,
  selected_object text,
  selected_type text,
  day_offset double precision not null default 0,
  scale text not null default 'solar',
  thumbnail_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_bookmarks_user_id on public.bookmarks(user_id);
create index if not exists idx_bookmarks_created_at on public.bookmarks(created_at desc);

alter table public.bookmarks enable row level security;

drop policy if exists "Users can manage own bookmarks" on public.bookmarks;
create policy "Users can manage own bookmarks"
  on public.bookmarks
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- =============================================================================
-- 2. Achievements table
-- =============================================================================
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_type text not null,
  title text not null,
  description text not null default '',
  icon text not null default '',
  xp_reward integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  earned_at timestamptz not null default now(),

  -- Each user can only earn a specific achievement type once
  constraint achievements_user_type_unique unique (user_id, achievement_type)
);

create index if not exists idx_achievements_user_id on public.achievements(user_id);
create index if not exists idx_achievements_earned_at on public.achievements(earned_at desc);

alter table public.achievements enable row level security;

drop policy if exists "Users can view own achievements" on public.achievements;
create policy "Users can view own achievements"
  on public.achievements for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own achievements" on public.achievements;
create policy "Users can insert own achievements"
  on public.achievements for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- =============================================================================
-- 3. Progress table
-- =============================================================================
create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  target_id text not null,
  metadata jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now(),

  -- Each (user, category, target) is logged only once
  constraint progress_user_category_target_unique unique (user_id, category, target_id)
);

create index if not exists idx_progress_user_id on public.progress(user_id);
create index if not exists idx_progress_category on public.progress(category);
create index if not exists idx_progress_completed_at on public.progress(completed_at desc);

alter table public.progress enable row level security;

drop policy if exists "Users can view own progress" on public.progress;
create policy "Users can view own progress"
  on public.progress for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own progress" on public.progress;
create policy "Users can insert own progress"
  on public.progress for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own progress" on public.progress;
create policy "Users can delete own progress"
  on public.progress for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- =============================================================================
-- 4. Triggers (update_updated_at function already exists from Phase 1)
-- =============================================================================
drop trigger if exists update_bookmarks_updated_at on public.bookmarks;
create trigger update_bookmarks_updated_at
  before update on public.bookmarks
  for each row execute procedure public.update_updated_at();
