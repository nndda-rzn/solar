/**
 * Seed script — creates test accounts for local development.
 *
 * Usage:
 *   npm run db:seed          seed the 3 default test users (idempotent)
 *   npm run db:seed -- --clear   delete the 3 test users first, then reseed
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (never expose this key
 * in client code — it bypasses RLS entirely).
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "[seed] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.\n" +
      "        Get the service_role key from Supabase Dashboard → Settings → API.\n" +
      "        Never commit this key or use it in client-side code.",
  );
  process.exit(1);
}

// service_role client — server-only, bypasses RLS. Never ship to the browser.
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

interface SeedUser {
  email: string;
  password: string;
  username: string;
  displayName: string;
  level: number;
  xp: number;
  bio: string;
}

const SEED_USERS: SeedUser[] = [
  {
    email: "admin@cosmic.test",
    password: "admin123",
    username: "admin",
    displayName: "Admin Explorer",
    level: 10,
    xp: 500,
    bio: "Administrator akun Cosmic Explorer.",
  },
  {
    email: "user@cosmic.test",
    password: "user123",
    username: "user",
    displayName: "Test User",
    level: 1,
    xp: 0,
    bio: "Akun uji standar.",
  },
  {
    email: "student@cosmic.test",
    password: "student123",
    username: "student",
    displayName: "Student Explorer",
    level: 3,
    xp: 150,
    bio: "Akun uji untuk skenario belajar.",
  },
];

async function findUserByEmail(email: string) {
  // admin.listUsers is paginated; the test fixture set is small enough that
  // a single page covers it comfortably.
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  if (error) throw error;
  return data.users.find((u) => u.email === email) ?? null;
}

async function clearSeedUsers() {
  console.log("[seed] Clearing existing test users...");
  for (const seedUser of SEED_USERS) {
    const existing = await findUserByEmail(seedUser.email);
    if (existing) {
      const { error } = await supabase.auth.admin.deleteUser(existing.id);
      if (error) {
        console.error(
          `[seed] Failed to delete ${seedUser.email}:`,
          error.message,
        );
      } else {
        console.log(`[seed] Deleted ${seedUser.email}`);
      }
    }
  }
}

async function upsertSeedUser(seedUser: SeedUser) {
  const existing = await findUserByEmail(seedUser.email);

  let userId: string;

  if (existing) {
    console.log(`[seed] ${seedUser.email} already exists, skipping create.`);
    userId = existing.id;
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email: seedUser.email,
      password: seedUser.password,
      email_confirm: true,
      user_metadata: {
        username: seedUser.username,
        displayName: seedUser.displayName,
      },
    });

    if (error || !data.user) {
      console.error(
        `[seed] Failed to create ${seedUser.email}:`,
        error?.message,
      );
      return;
    }

    userId = data.user.id;
    console.log(`[seed] Created ${seedUser.email}`);
  }

  // The `handle_new_user` trigger auto-inserts a row in `profiles` on
  // signup. Upsert here to (a) cover the "already existed" branch and
  // (b) set the level/xp/bio fields the trigger doesn't know about.
  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: userId,
      email: seedUser.email,
      username: seedUser.username,
      display_name: seedUser.displayName,
      bio: seedUser.bio,
      level: seedUser.level,
      xp: seedUser.xp,
    },
    { onConflict: "id" },
  );

  if (profileError) {
    console.error(
      `[seed] Failed to upsert profile for ${seedUser.email}:`,
      profileError.message,
    );
  } else {
    console.log(`[seed] Profile ready for ${seedUser.email}`);
  }
}

async function main() {
  const shouldClear = process.argv.includes("--clear");

  if (shouldClear) {
    await clearSeedUsers();
  }

  console.log("[seed] Seeding test users...");
  for (const seedUser of SEED_USERS) {
    await upsertSeedUser(seedUser);
  }

  console.log("\n[seed] Done. Test accounts:");
  for (const u of SEED_USERS) {
    console.log(`  - ${u.email} / ${u.password}`);
  }
}

main().catch((error) => {
  console.error("[seed] Unexpected error:", error);
  process.exit(1);
});
