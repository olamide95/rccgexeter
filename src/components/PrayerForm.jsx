"use client";
import { useState } from "react";

const SUBJECTS = [
  "A prayer request", "Planning my first visit", "Joining a ministry",
  "Becoming a member", "Giving and Gift Aid", "Something else"
];

export default function PrayerForm({ compact = false }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", subject: SUBJECTS[0], message: "", confidential: false
  });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: "error", text: "Please add your name, email and message so we can pray with you and reply." });
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setStatus({ type: "error", text: "That email address does not look right — please check it." });
      return;
    }
    setBusy(true);
    setStatus({ type: "", text: "" });
    try {
      const res = await fetch("/api/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus({
        type: "ok",
        text: `Thank you, ${form.name.split(" ")[0]}. Your request is with the prayer team and we will reply within 24 hours.`
      });
      setForm({ name: "", email: "", phone: "", subject: SUBJECTS[0], message: "", confidential: false });
    } catch (err) {
      setStatus({ type: "error", text: `${err.message}. Please call the prayer line instead.` });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate data-anim={compact ? undefined : "right"}>
      <div className="row2">
        <div className="field">
          <label htmlFor="pf-name">Your name</label>
          <input id="pf-name" type="text" autoComplete="name" value={form.name} onChange={set("name")} required />
        </div>
        <div className="field">
          <label htmlFor="pf-email">Email address</label>
          <input id="pf-email" type="email" autoComplete="email" value={form.email} onChange={set("email")} required />
        </div>
      </div>
      <div className="row2">
        <div className="field">
          <label htmlFor="pf-phone">Phone (optional)</label>
          <input id="pf-phone" type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} />
        </div>
        <div className="field">
          <label htmlFor="pf-subject">What is this about?</label>
          <select id="pf-subject" value={form.subject} onChange={set("subject")}>
            {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="pf-message">Your prayer request</label>
        <textarea id="pf-message" value={form.message} onChange={set("message")} required
          placeholder="Tell us what to pray about. Write as much or as little as you like." />
      </div>
      <label style={{ display: "flex", gap: ".7rem", alignItems: "flex-start", fontSize: ".9rem", color: "var(--dim)" }}>
        <input type="checkbox" checked={form.confidential} onChange={set("confidential")}
          style={{ width: "auto", marginTop: ".35rem" }} />
        <span>Keep this confidential — share it only with the pastors, not the wider prayer band.</span>
      </label>
      {status.text ? <p className="fstatus show">{status.text}</p> : null}
      <button className="btn btn-gold btn-lg" type="submit" disabled={busy} style={{ justifySelf: "start" }}>
        {busy ? "Sending…" : "Send To The Prayer Team"}
      </button>
      <p style={{ fontSize: "var(--t-xs)", color: "var(--dim)" }}>
        Your details are never shared outside the parish.
      </p>
    </form>
  );
}
