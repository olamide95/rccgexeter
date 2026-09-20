import { NextResponse } from "next/server";
import { createSession, COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** POST { idToken } → sets the httpOnly session cookie. */
export async function POST(request) {
  try {
    const { idToken } = await request.json();
    if (!idToken) return NextResponse.json({ error: "Missing token" }, { status: 400 });

    const { sessionCookie, email } = await createSession(idToken);
    const res = NextResponse.json({ ok: true, email });
    res.cookies.set(COOKIE_NAME, sessionCookie, {
      httpOnly: true, sameSite: "lax", path: "/",
      secure: process.env.NODE_ENV === "production", maxAge: SESSION_MAX_AGE
    });
    return res;
  } catch (err) {
    const message = err.code === "not-admin" ? err.message : "Could not start a session";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

/** DELETE → signs out. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}
