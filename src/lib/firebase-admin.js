import "server-only";
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

/**
 * Lazy Admin SDK init. If the service-account variables are missing the whole
 * app falls back to the JSON files in /content, so `npm run dev` works before
 * Firebase is wired up. See isFirebaseConfigured().
 */
export function isFirebaseConfigured() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );
}

function app() {
  if (getApps().length) return getApp();
  if (!isFirebaseConfigured()) throw new Error("Firebase Admin is not configured — check your .env");
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // .env keeps the key on one line with \n escapes; turn them back into newlines
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
}

export function db() { return getFirestore(app()); }
export function auth() { return getAuth(app()); }
export function bucket() { return getStorage(app()).bucket(); }
