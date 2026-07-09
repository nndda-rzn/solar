/**
 * Migration runner — applies docs/sql/phase2-tables.sql against the
 * Supabase Postgres database using a direct PG connection.
 *
 * Requires DATABASE_URL in .env.local:
 *   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
 *
 * Usage:
 *   npm run db:migrate:phase2
 */
import * as fs from "node:fs";
import * as path from "node:path";
import * as dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error(
    "[migrate] DATABASE_URL is not set in .env.local.\n" +
      "Add one line:\n" +
      "  DATABASE_URL=postgresql://postgres:[YOUR_DB_PASSWORD]@db.jdeniwtixakhhlbsowqh.supabase.co:5432/postgres\n" +
      "Find your DB password at https://supabase.com/dashboard/project/jdeniwtixakhhlbsowqh/settings/database\n" +
      "\n" +
      "Or run the SQL manually via Dashboard SQL Editor:\n" +
      "  https://supabase.com/dashboard/project/jdeniwtixakhhlbsowqh/sql/new",
  );
  process.exit(1);
}

const SQL_PATH = path.resolve(process.cwd(), "docs/sql/phase2-tables.sql");

async function main() {
  const sql = fs.readFileSync(SQL_PATH, "utf8");
  console.log(`[migrate] Reading SQL from ${SQL_PATH}`);
  console.log(
    `[migrate] Connecting to ${new URL(DATABASE_URL as string).host}…`,
  );

  const client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("[migrate] Connected. Executing SQL…");

    await client.query(sql);

    console.log("[migrate] ✓ Schema applied successfully");

    const tables = await client.query<{ tablename: string }>(
      "select tablename from pg_tables where schemaname='public' order by 1",
    );
    console.log("[migrate] Public tables now:");
    for (const row of tables.rows) {
      console.log(`  - ${row.tablename}`);
    }

    const expected = ["bookmarks", "achievements", "progress", "profiles"];
    const have = new Set(
      tables.rows.map((r: { tablename: string }) => r.tablename),
    );
    const missing = expected.filter((t) => !have.has(t));
    if (missing.length === 0) {
      console.log("[migrate] ✓ All 4 expected tables present");
    } else {
      console.error(
        `[migrate] ✗ Missing tables: ${missing.join(", ")}. Check SQL output above.`,
      );
      process.exit(2);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[migrate] Failed: ${msg}`);
    if (msg.includes("password authentication failed")) {
      console.error(
        "[migrate] Hint: DB password is wrong. Get the right one from Dashboard → Settings → Database.",
      );
    } else if (msg.includes("ENOTFOUND") || msg.includes("ECONNREFUSED")) {
      console.error(
        "[migrate] Hint: cannot reach the server. Check network / project ref in URL.",
      );
    }
    process.exit(1);
  } finally {
    await client.end().catch(() => undefined);
  }
}

main();
