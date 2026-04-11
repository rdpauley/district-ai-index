/**
 * Run all migrations against Supabase using pg driver.
 *
 * Usage:
 *   SUPABASE_DB_PASSWORD=yourpassword node supabase/run-migrations.mjs
 *
 * Find password: Supabase Dashboard → Settings → Database → Database Password
 */

import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const PROJECT_REF = "owtmlcqtmczrnmzhhpyh";
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;

if (!DB_PASSWORD) {
  console.error("Usage: SUPABASE_DB_PASSWORD=yourpassword node supabase/run-migrations.mjs");
  process.exit(1);
}

const connStr = `postgresql://postgres.${PROJECT_REF}:${DB_PASSWORD}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;

async function run() {
  const pg = await import("pg");
  const client = new pg.default.Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log("Connected.\n");

  const dir = join(__dirname, "migrations");
  const files = readdirSync(dir).filter(f => f.endsWith(".sql")).sort();

  for (const file of files) {
    process.stdout.write(`  ${file}...`);
    try {
      await client.query(readFileSync(join(dir, file), "utf-8"));
      console.log(" ✓");
    } catch (err) {
      console.log(` ✗ ${err.message.split("\n")[0]}`);
    }
  }

  await client.end();
  console.log("\nMigrations complete.");
}

run().catch(e => { console.error(e.message); process.exit(1); });
