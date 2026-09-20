"use client";
import { useState, useEffect } from "react";
import Media from "./Media";

export default function Gallery({ items = [], feature = false }) {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = open !== null ? "hidden" : "";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div className="gal">
        {items.map((g, i) => (
          <button key={g.id || i} className={`gitem${feature && i % 5 === 0 ? " tall" : ""}`}
            data-anim="zoom" style={{ transitionDelay: `${(i % 4) * 0.07}s` }}
            onClick={() => setOpen(i)} aria-label={`Open ${g.caption}`}>
            <Media src={g.src} seed={i * 17} />
            <span className="gzoom">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4.5-4.5M11 8v6M8 11h6" /></svg>
            </span>
            <span className="glab">{g.caption}</span>
          </button>
        ))}
      </div>

      <div className={`lightbox${open !== null ? " open" : ""}`} role="dialog" aria-modal="true"
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
        <div className="lbin">
          <button className="lbclose" aria-label="Close" onClick={() => setOpen(null)}>&times;</button>
          {open !== null && <Media src={items[open]?.src} seed={open * 17} />}
          <p className="lbcap">{open !== null ? items[open]?.caption : ""}</p>
        </div>
      </div>
    </>
  );
}
