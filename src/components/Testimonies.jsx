"use client";
import { useEffect, useState } from "react";
import Media from "./Media";

export default function Testimonies({ items = [] }) {
  const [cur, setCur] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setCur((c) => (c + 1) % items.length), 6500);
    return () => clearInterval(t);
  }, [items.length]);

  if (!items.length) return null;

  return (
    <>
      <div className="tslide">
        {items.map((t, i) => (
          <div key={i} className={`ti${i === cur ? " on" : ""}`}>
            <Media src={t.image} className="tface" seed={i * 31} />
            <p className="tq">&ldquo;{t.quote}&rdquo;</p>
            <p className="tn">{t.name}</p>
          </div>
        ))}
      </div>
      <div className="tdots">
        {items.map((_, i) => (
          <button key={i} className={i === cur ? "on" : ""} aria-label={`Testimony ${i + 1}`}
            onClick={() => setCur(i)} />
        ))}
      </div>
    </>
  );
}
