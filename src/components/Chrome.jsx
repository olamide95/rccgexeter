"use client";

export function ScrollProgress() { return <div className="prog" id="prog" />; }
export function CursorGlow() { return <div className="cglow" id="cglow" />; }
export function BackToTop() {
  return (
    <button className="totop" id="totop" aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
      <svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
    </button>
  );
}
