# Phase 2 Tables Migration

Database `jdeniwtixakhhlbsowqh.supabase.co` currently has only the `profiles` table from Phase 1. The three tables required by the app — `bookmarks`, `achievements`, `progress` — must be created.

`phase2-tables.sql` bootsraps them with **idempotent** `create table if not exists` + **RLS policies** so each user only sees their own data + **unique constraints** matching the dedup logic in `src/lib/providers/`.

## Three ways to run

### A) Supabase Dashboard — SQL Editor (recommended, fastest)

1. Open: <https://supabase.com/dashboard/project/jdeniwtixakhhlbsowqh/sql/new>
2. Paste contents of `phase2-tables.sql` into the editor.
3. Click **Run**.
4. Verify: run `select tablename from pg_tables where schemaname='public' order by 1;` → expect `achievements, bookmarks, profiles, progress`.

### B) `tsx scripts/migrate-supabase.ts`

Auto-runs the same SQL over a direct PG connection. Requires `DATABASE_URL` in `.env.local`:

```
DATABASE_URL=postgresql://postgres:[YOUR_DB_PASSWORD]@db.jdeniwtixakhhlbsowqh.supabase.co:5432/postgres
```

Get the password from Dashboard → Project Settings → Database → Connection string → URI.

Run:

```bash
npm run db:migrate:phase2
```

Script outputs a ✓ when tables exist, lists public tables at the end.

### C) Supabase CLI

```bash
supabase db push --db-url "postgresql://postgres:[PASSWORD]@db.jdeniwtixakhhlbsowqh.supabase.co:5432/postgres"
```

Requires `supabase` CLI installed globally + Supabase auth token.

## What the SQL creates

| Table          | Rows policy                        | Unique                           |
| -------------- | ---------------------------------- | -------------------------------- |
| `bookmarks`    | user sees own only (full CRUD)     | —                                |
| `achievements` | user sees own; only insert own     | `(user_id, achievement_type)`    |
| `progress`     | user sees own; insert + delete own | `(user_id, category, target_id)` |

Plus: indexes on `user_id`, `*_at desc` columns, `update_bookmarks_updated_at` trigger reusing `update_updated_at()` from Phase 1.

## Verify after migration

Reload the dashboard and the `code: 'PGRST205'` errors should be gone (no more "table not found"). The toast error from before will still appear because there are no rows yet — that is expected; data inserts alone trigger those.
