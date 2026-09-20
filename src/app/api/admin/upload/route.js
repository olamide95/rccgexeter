import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { requireAdmin } from "@/lib/auth";
import { bucket, isFirebaseConfigured } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Small uploads (images) go through here. Large videos should use the direct
 * browser upload in the admin panel, which streams straight to Storage.
 */
export async function POST(request) {
  try {
    await requireAdmin();
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: "Firebase Storage is not configured — drop the file into public/media instead" },
        { status: 400 }
      );
    }

    const form = await request.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") || "images").replace(/[^a-z0-9-]/gi, "");
    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }

    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, "-");
    const objectPath = `media/${folder}/${Date.now()}-${safeName}`;
    const token = crypto.randomUUID();
    const blob = bucket().file(objectPath);

    await blob.save(Buffer.from(await file.arrayBuffer()), {
      resumable: false,
      contentType: file.type || "application/octet-stream",
      metadata: { metadata: { firebaseStorageDownloadTokens: token } }
    });

    const url =
      `https://firebasestorage.googleapis.com/v0/b/${bucket().name}/o/` +
      `${encodeURIComponent(objectPath)}?alt=media&token=${token}`;

    return NextResponse.json({ ok: true, url, path: objectPath });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
