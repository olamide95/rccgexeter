import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { addPrayerRequest } from "@/lib/content";

export const dynamic = "force-dynamic";

async function emailIfConfigured(entry) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.PRAYER_TO_EMAIL;
  const from = process.env.PRAYER_FROM_EMAIL;
  if (!key || !to || !from) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from, to, reply_to: entry.email,
        subject: `Prayer request — ${entry.name}${entry.confidential ? " (confidential)" : ""}`,
        text: [
          `Name: ${entry.name}`, `Email: ${entry.email}`, `Phone: ${entry.phone || "—"}`,
          `Subject: ${entry.subject}`, `Confidential: ${entry.confidential ? "yes" : "no"}`,
          "", entry.message
        ].join("\n")
      })
    });
  } catch (err) {
    console.error("Prayer email failed (the request was still saved):", err);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email and message are required" }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "That email address is not valid" }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: "That message is too long" }, { status: 400 });
    }
    if (String(body.website || "")) {
      // honeypot field — bots fill it, humans never see it
      return NextResponse.json({ ok: true });
    }

    const entry = {
      id: crypto.randomUUID(),
      name, email,
      phone: String(body.phone || "").trim(),
      subject: String(body.subject || "A prayer request"),
      message,
      confidential: Boolean(body.confidential),
      status: "new",
      createdAt: new Date().toISOString()
    };

    await addPrayerRequest(entry);
    await emailIfConfigured(entry);
    return NextResponse.json({ ok: true, id: entry.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not save your request" }, { status: 500 });
  }
}
