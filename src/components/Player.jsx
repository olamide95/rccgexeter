"use client";
import { useRouter } from "next/navigation";
import Media from "./Media";

export default function Player({ image, tag = "Live Sunday", embed = "", href = "/live", style }) {
  const router = useRouter();
  if (embed) {
    return (
      <div className="player" data-anim="zoom" style={style}>
        <iframe src={embed} title="Live stream" allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, zIndex: 6 }} />
      </div>
    );
  }
  return (
    <div className="player" data-anim="zoom" style={style}>
      <Media src={image} />
      <span className="ptag">{tag}</span>
      <button className="playbtn" aria-label="Watch the service" onClick={() => router.push(href)}>
        <svg viewBox="0 0 24 24"><path d="M6 3l15 9-15 9z" /></svg>
      </button>
    </div>
  );
}
