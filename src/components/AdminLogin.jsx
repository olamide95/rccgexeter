"use client";
import { useState } from "react";
import { clientAuth, clientConfigured } from "@/lib/firebase-client";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function AdminLogin({ firebaseReady }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const ready = firebaseReady && clientConfigured();

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const cred = await signInWithEmailAndPassword(clientAuth(), email.trim(), password);
      const idToken = await cred.user.getIdToken();
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not sign in");
      window.location.reload();
    } catch (err) {
      const code = err.code || "";
      setError(
        code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")
          ? "That email and password do not match a parish account."
          : err.message
      );
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 440 }}>
      <p className="pill">Parish admin</p>
      <h1 className="h-sec" style={{ fontSize: "var(--t-xl)" }}>Sign In</h1>

      {!ready ? (
        <p className="note" style={{ marginTop: "1.6rem" }}>
          Firebase is not configured yet. Copy <b style={{ color: "#fff" }}>.env.example</b> to
          <b style={{ color: "#fff" }}> .env</b>, fill in the project values, then restart the dev server.
          Until then the site runs from the JSON files in <b style={{ color: "#fff" }}>/content</b> and
          To edit them locally without Firebase, set ALLOW_LOCAL_ADMIN=true in .env.
        </p>
      ) : (
        <form className="form" onSubmit={submit} style={{ marginTop: "1.8rem" }}>
          <div className="field">
            <label htmlFor="ad-email">Email</label>
            <input id="ad-email" type="email" autoComplete="email" value={email} autoFocus
              onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="ad-pw">Password</label>
            <input id="ad-pw" type="password" autoComplete="current-password" value={password}
              onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error ? <p className="fstatus show">{error}</p> : null}
          <button className="btn btn-gold btn-lg" type="submit" disabled={busy} style={{ justifySelf: "start" }}>
            {busy ? "Signing in…" : "Sign In"}
          </button>
          <p className="note">
            Accounts are created in the Firebase console under Authentication, then added to
            ADMIN_EMAILS in your .env file.
          </p>
        </form>
      )}
    </div>
  );
}
