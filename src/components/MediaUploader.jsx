"use client";
import { useState } from "react";
import { clientStorage, clientConfigured } from "@/lib/firebase-client";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

/**
 * Uploads straight from the browser to Firebase Storage, so large hero videos
 * stream up with a progress bar instead of going through a serverless function.
 */
export default function MediaUploader({ onUploaded }) {
  const [progress, setProgress] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handle(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(""); setResult(null);

    if (!clientConfigured()) {
      setError("Firebase is not configured — drop the file into public/media instead.");
      return;
    }

    const folder = file.type.startsWith("video/") ? "video" : "images";
    const safe = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, "-");
    const objectRef = ref(clientStorage(), `media/${folder}/${Date.now()}-${safe}`);
    const task = uploadBytesResumable(objectRef, file, { contentType: file.type });

    setProgress(0);
    task.on(
      "state_changed",
      (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      (err) => {
        setProgress(null);
        setError(
          err.code === "storage/unauthorized"
            ? "Storage rejected the upload — check your storage.rules and that you are signed in."
            : err.message
        );
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        setProgress(null);
        setResult({ url, name: file.name });
        onUploaded?.(url);
      }
    );
    e.target.value = "";
  }

  return (
    <div className="glass" style={{ padding: "1.4rem", marginBottom: "1.2rem" }}>
      <div style={{ fontSize: ".66rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold)" }}>
        Upload a photo or video
      </div>
      <p className="note" style={{ marginTop: ".5rem" }}>
        Goes straight to Firebase Storage. Copy the URL it gives you into the right key below,
        then save.
      </p>
      <input type="file" accept="image/*,video/*" onChange={handle}
        style={{ marginTop: ".9rem", fontSize: ".9rem" }} />
      {progress !== null && (
        <div style={{ marginTop: ".9rem" }}>
          <div style={{ height: 4, background: "rgba(255,255,255,.14)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "var(--g-gold)", transition: "width .2s" }} />
          </div>
          <p className="note" style={{ marginTop: ".4rem" }}>Uploading… {progress}%</p>
        </div>
      )}
      {error ? <p className="fstatus show" style={{ marginTop: ".9rem" }}>{error}</p> : null}
      {result && (
        <div style={{ marginTop: ".9rem" }}>
          <p className="note">Uploaded <b style={{ color: "#fff" }}>{result.name}</b></p>
          <input readOnly value={result.url} onFocus={(e) => e.target.select()}
            style={{
              width: "100%", marginTop: ".5rem", fontSize: ".78rem",
              fontFamily: "ui-monospace,Menlo,Consolas,monospace", color: "#fff",
              background: "rgba(255,255,255,.06)", border: "1px solid rgba(232,180,74,.4)",
              padding: ".7rem .9rem", borderRadius: 10
            }} />
        </div>
      )}
    </div>
  );
}
