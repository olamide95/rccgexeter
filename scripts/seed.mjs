/**
 * Push everything in /content into Firestore.
 *
 *   npm run seed
 *
 * Safe to re-run: it overwrites the ten documents under the `content`
 * collection and touches nothing else (prayer requests are never altered).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* read .env without adding a dependency */
for (const file of [".env.local", ".env"]) {
  const p = path.join(root, file);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
}

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  console.error("Missing Firebase service-account variables. Fill in .env first.");
  process.exit(1);
}

initializeApp({
  credential: cert({
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  })
});

const db = getFirestore();
const LIST_DOCS = new Set(["ministries", "events", "sermons", "gallery", "team", "testimonies", "blog"]);
const NAMES = ["site", "media", "pages", ...LIST_DOCS];

const batch = db.batch();
let count = 0;

for (const name of NAMES) {
  const file = path.join(root, "content", `${name}.json`);
  if (!fs.existsSync(file)) { console.warn(`  skipped ${name} — no file`); continue; }
  const value = JSON.parse(fs.readFileSync(file, "utf8"));
  const data = LIST_DOCS.has(name) ? { items: value } : value;
  batch.set(db.collection("content").doc(name), { ...data, updatedAt: new Date().toISOString() });
  console.log(`  queued ${name}`);
  count++;
}

await batch.commit();
console.log(`\nSeeded ${count} documents into ${FIREBASE_PROJECT_ID}/content`);
process.exit(0);
