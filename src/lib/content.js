import "server-only";
import fs from "node:fs";
import path from "node:path";
import { db, isFirebaseConfigured } from "./firebase-admin";

const CONTENT_DIR = path.join(process.cwd(), "content");

/** Documents under the Firestore `content` collection. */
export const COLLECTIONS = [
  "site", "media", "pages", "ministries", "events",
  "sermons", "gallery", "team", "testimonies", "blog"
];

/** Which of those are arrays (stored in Firestore as { items: [...] }). */
const LIST_DOCS = new Set(["ministries", "events", "sermons", "gallery", "team", "testimonies", "blog"]);

const EMPTY = (name) => (LIST_DOCS.has(name) ? [] : {});

/* ── local JSON fallback, used until Firebase credentials are set ── */
function readLocal(name) {
  try {
    return JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, `${name}.json`), "utf8"));
  } catch {
    return EMPTY(name);
  }
}

function writeLocal(name, value) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  fs.writeFileSync(path.join(CONTENT_DIR, `${name}.json`), JSON.stringify(value, null, 2) + "\n", "utf8");
}

/** Firestore stores arrays wrapped so a document always has a shape. */
function toDoc(name, value) { return LIST_DOCS.has(name) ? { items: value } : value; }
function fromDoc(name, data) {
  if (!data) return null;
  return LIST_DOCS.has(name) ? (Array.isArray(data.items) ? data.items : []) : data;
}

/* ── reads ── */

export async function readCollection(name) {
  if (!COLLECTIONS.includes(name)) throw new Error(`Unknown collection: ${name}`);
  if (!isFirebaseConfigured()) return readLocal(name);
  try {
    const snap = await db().collection("content").doc(name).get();
    const value = fromDoc(name, snap.exists ? snap.data() : null);
    // Not seeded yet — fall back so the site is never blank
    return value ?? readLocal(name);
  } catch (err) {
    console.error(`Firestore read failed for "${name}", using local content:`, err.message);
    return readLocal(name);
  }
}

/** Everything a page needs, in one round trip. */
export async function getContent() {
  if (!isFirebaseConfigured()) {
    return Object.fromEntries(COLLECTIONS.map((n) => [n, readLocal(n)]));
  }
  try {
    const refs = COLLECTIONS.map((n) => db().collection("content").doc(n));
    const snaps = await db().getAll(...refs);
    const out = {};
    snaps.forEach((snap, i) => {
      const name = COLLECTIONS[i];
      out[name] = fromDoc(name, snap.exists ? snap.data() : null) ?? readLocal(name);
    });
    return out;
  } catch (err) {
    console.error("Firestore read failed, using local content:", err.message);
    return Object.fromEntries(COLLECTIONS.map((n) => [n, readLocal(n)]));
  }
}

/* ── writes ── */

export async function writeCollection(name, value) {
  if (!COLLECTIONS.includes(name)) throw new Error(`Unknown collection: ${name}`);
  if (!isFirebaseConfigured()) { writeLocal(name, value); return; }
  await db().collection("content").doc(name).set(
    { ...toDoc(name, value), updatedAt: new Date().toISOString() },
    { merge: false }
  );
}

/* ── prayer requests ── */

const PRAYER_FILE = path.join(process.cwd(), "data", "prayer-requests.json");

function readPrayerLocal() {
  try { return JSON.parse(fs.readFileSync(PRAYER_FILE, "utf8")); } catch { return []; }
}
function writePrayerLocal(all) {
  fs.mkdirSync(path.dirname(PRAYER_FILE), { recursive: true });
  fs.writeFileSync(PRAYER_FILE, JSON.stringify(all, null, 2) + "\n", "utf8");
}

export async function addPrayerRequest(entry) {
  if (!isFirebaseConfigured()) {
    const all = readPrayerLocal();
    all.unshift(entry);
    writePrayerLocal(all);
    return entry;
  }
  await db().collection("prayerRequests").doc(entry.id).set(entry);
  return entry;
}

export async function listPrayerRequests(limit = 200) {
  if (!isFirebaseConfigured()) return readPrayerLocal();
  const snap = await db().collection("prayerRequests")
    .orderBy("createdAt", "desc").limit(limit).get();
  return snap.docs.map((d) => d.data());
}

export async function updatePrayerRequest(id, patch) {
  if (!isFirebaseConfigured()) {
    const all = readPrayerLocal().map((r) => (r.id === id ? { ...r, ...patch } : r));
    writePrayerLocal(all);
    return all;
  }
  await db().collection("prayerRequests").doc(id).set(patch, { merge: true });
  return listPrayerRequests();
}

export async function deletePrayerRequest(id) {
  if (!isFirebaseConfigured()) {
    const all = readPrayerLocal().filter((r) => r.id !== id);
    writePrayerLocal(all);
    return all;
  }
  await db().collection("prayerRequests").doc(id).delete();
  return listPrayerRequests();
}
