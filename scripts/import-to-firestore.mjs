/**
 * Import all tools from seed data into Firestore.
 *
 * Usage:
 *   GOOGLE_APPLICATION_CREDENTIALS=firebase-service-account.json node scripts/import-to-firestore.mjs
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

// Load service account
const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || resolve(rootDir, "firebase-service-account.json");
const sa = JSON.parse(readFileSync(saPath, "utf-8"));

const app = initializeApp({ credential: cert(sa) });
const db = getFirestore(app);

// Dynamic import of seed data (compiled TypeScript)
async function loadTools() {
  // We'll read the seed JSON instead of importing TS
  // First generate it
  const { execSync } = await import("child_process");

  console.log("Extracting tool data from seed...");
  execSync(`cd "${rootDir}" && npx tsx -e "
import { tools } from './src/lib/seed-data';
import { writeFileSync } from 'fs';
writeFileSync('/tmp/dai-tools-export.json', JSON.stringify(tools, null, 2));
console.log('Exported ' + tools.length + ' tools');
"`, { stdio: "inherit" });

  return JSON.parse(readFileSync("/tmp/dai-tools-export.json", "utf-8"));
}

async function importTools() {
  console.log("\nDistrict AI Index — Firestore Import");
  console.log("====================================\n");

  const tools = await loadTools();
  console.log(`\nImporting ${tools.length} tools into Firestore...\n`);

  const batch_size = 20; // Firestore batch limit is 500, but let's be safe
  let imported = 0;
  let failed = 0;

  // Process in batches
  for (let i = 0; i < tools.length; i += batch_size) {
    const chunk = tools.slice(i, i + batch_size);
    const batch = db.batch();

    for (const tool of chunk) {
      const docRef = db.collection("tools").doc(tool.slug);

      // Clean the data for Firestore (remove undefined values)
      const cleanTool = JSON.parse(JSON.stringify(tool));

      batch.set(docRef, {
        ...cleanTool,
        _imported_at: new Date().toISOString(),
      }, { merge: true });
    }

    try {
      await batch.commit();
      imported += chunk.length;
      chunk.forEach((t) => process.stdout.write(`  ✓ ${t.name}\n`));
    } catch (err) {
      failed += chunk.length;
      console.error(`  ✗ Batch failed: ${err.message}`);
    }
  }

  // Also create category documents
  console.log("\nImporting categories...");
  const categories = [...new Set(tools.flatMap((t) => t.categories))];
  const catBatch = db.batch();
  for (const cat of categories) {
    const slug = cat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
    catBatch.set(db.collection("categories").doc(slug), {
      name: cat,
      slug,
      tool_count: tools.filter((t) => t.categories.includes(cat)).length,
    }, { merge: true });
  }
  await catBatch.commit();
  console.log(`  ✓ ${categories.length} categories`);

  console.log(`\n====================================`);
  console.log(`Import complete:`);
  console.log(`  ✓ Tools: ${imported}`);
  if (failed > 0) console.log(`  ✗ Failed: ${failed}`);
  console.log(`  ✓ Categories: ${categories.length}`);
  console.log();
}

importTools().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
