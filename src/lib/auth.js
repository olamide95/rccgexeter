import "server-only";
import { cookies } from "next/headers";
import { auth, isFirebaseConfigured } from "./firebase-admin";

export const COOKIE_NAME = "gog_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 5; // 5 days

export function adminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
}

export function isAdminEmail(email) {
  const list = adminEmails();
  if (!list.length) return true; // no allowlist set — any Firebase Auth user may sign in
  return list.includes(String(email || "").toLowerCase());
}

/** Exchange a client ID token for an httpOnly session cookie. */
export async function createSession(idToken) {
  const decoded = await auth().verifyIdToken(idToken, true);
  if (!isAdminEmail(decoded.email)) {
    const err = new Error("This account is not on the parish admin list");
    err.code = "not-admin";
    throw err;
  }
  const sessionCookie = await auth().createSessionCookie(idToken, {
    expiresIn: SESSION_MAX_AGE * 1000
  });
  return { sessionCookie, email: decoded.email };
}

/** Returns the signed-in admin, or null. */
export async function currentAdmin() {
  if (!isFirebaseConfigured()) {
    // No Firebase yet. /admin stays locked unless you explicitly opt in with
    // ALLOW_LOCAL_ADMIN=true in .env, and never in a production build.
    const optedIn = process.env.ALLOW_LOCAL_ADMIN === "true";
    const isDev = process.env.NODE_ENV !== "production";
    return optedIn && isDev ? { email: "local-dev", local: true } : null;
  }
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const decoded = await auth().verifySessionCookie(token, true);
    if (!isAdminEmail(decoded.email)) return null;
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const admin = await currentAdmin();
  if (!admin) {
    const err = new Error("Unauthorised");
    err.status = 401;
    throw err;
  }
  return admin;
}
