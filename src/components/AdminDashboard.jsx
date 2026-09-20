"use client";
import { useEffect, useState, useCallback } from "react";
import MediaUploader from "./MediaUploader";

const TABS = [
  ["prayer", "Prayer Requests"], ["site", "Site Settings"], ["media", "Photos & Video"],
  ["pages", "Page Copy"], ["ministries", "Ministries"], ["events", "Events"],
  ["sermons", "Sermons"], ["gallery", "Gallery"], ["team", "Team"],
  ["testimonies", "Testimonies"], ["blog", "Blog"]
];

export default function AdminDashboard({ email, local }) {
  const [tab, setTab] = useState("prayer");
  const [text, setText] = useState("");
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (name) => {
    setStatus("");
    if (name === "prayer") {
      const res = await fetch("/api/admin/prayer");
      const data = await res.json();
      setRequests(data.requests || []);
      return;
    }
    const res = await fetch(`/api/admin/content?name=${name}`);
    const data = await res.json();
    setText(JSON.stringify(data.data, null, 2));
  }, []);

  useEffect(() => { load(tab); }, [tab, load]);

  async function save() {
    let parsed;
    try { parsed = JSON.parse(text); }
    catch (err) { setStatus(`Not valid JSON — ${err.message}`); return; }
    setBusy(true);
    const res = await fetch("/api/admin/content", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: tab, data: parsed })
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    setStatus(res.ok ? "Saved to Firestore. The site updates on its next request." : (data.error || "Could not save."));
  }

  async function mark(id, next) {
    const res = await fetch("/api/admin/prayer", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: next })
    });
    const data = await res.json();
    setRequests(data.requests || []);
  }

  async function remove(id) {
    if (!confirm("Delete this request permanently?")) return;
    const res = await fetch("/api/admin/prayer", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    const data = await res.json();
    setRequests(data.requests || []);
  }

  async function logout() {
    await fetch("/api/auth/session", { method: "DELETE" });
    window.location.href = "/";
  }

  const newCount = requests.filter((r) => r.status === "new").length;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "baseline" }}>
        <div>
          <p className="pill">Parish admin</p>
          <h1 className="h-sec" style={{ fontSize: "var(--t-xl)" }}>Manage The Website</h1>
          <p className="note" style={{ marginTop: ".5rem" }}>
            Signed in as {email}{local ? " — local mode, editing the JSON files in /content" : ""}
          </p>
        </div>
        {!local && <button className="btn btn-glass" onClick={logout}>Sign Out</button>}
      </div>

      <div className="tabs">
        {TABS.map(([key, label]) => (
          <button key={key} className={tab === key ? "on" : ""} onClick={() => setTab(key)}>
            {label}{key === "prayer" && newCount ? ` (${newCount})` : ""}
          </button>
        ))}
      </div>

      {tab === "prayer" ? (
        <div>
          {!requests.length && (
            <p className="note">No prayer requests yet. They arrive here the moment someone submits the form.</p>
          )}
          {requests.map((r) => (
            <div className="pr-card" key={r.id}>
              <div className="pr-h">
                <span className="pr-n">{r.name}</span>
                <span style={{ display: "flex", gap: ".5rem", alignItems: "center", flexWrap: "wrap" }}>
                  {r.confidential ? <span className="pr-tag">Confidential</span> : null}
                  <span className="pr-tag">{r.status}</span>
                  <span className="note">{new Date(r.createdAt).toLocaleString("en-GB")}</span>
                </span>
              </div>
              <p className="note" style={{ marginTop: ".4rem" }}>
                {r.subject} — <a href={`mailto:${r.email}`} style={{ color: "var(--gold-hi)" }}>{r.email}</a>
                {r.phone ? ` — ${r.phone}` : ""}
              </p>
              <p className="pr-m">{r.message}</p>
              <div className="toolbar">
                {r.status !== "praying" && <button className="btn btn-glass" onClick={() => mark(r.id, "praying")}>Mark Praying</button>}
                {r.status !== "answered" && <button className="btn btn-gold" onClick={() => mark(r.id, "answered")}>Mark Answered</button>}
                <button className="btn btn-glass" onClick={() => remove(r.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {tab === "media" && <MediaUploader />}
          <p className="note">
            Editing the <b style={{ color: "#fff" }}>{tab}</b> document. Change the values, keep the
            structure, then save. Image paths can be a Storage URL or a local path such as
            /media/images/welcome.jpg
          </p>
          <div className="field" style={{ marginTop: "1rem" }}>
            <textarea className="json" value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} />
          </div>
          <div className="toolbar">
            <button className="btn btn-gold" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save Changes"}</button>
            <button className="btn btn-glass" onClick={() => load(tab)}>Discard</button>
            {status ? <span className="note">{status}</span> : null}
          </div>
        </div>
      )}
    </>
  );
}
