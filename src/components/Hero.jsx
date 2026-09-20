"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import NextService from "./NextService";

export default function Hero({ media, copy, site }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(media?.heroMuted !== false);
  const hasVideo = Boolean(media?.heroVideo);
  const hasImage = !hasVideo && Boolean(media?.heroImage || media?.heroPoster);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <section className="hero">
      <div className="hero-media">
        {hasVideo && (
          <video ref={videoRef} className="ready" playsInline loop autoPlay preload="auto"
            muted={media?.heroMuted !== false} poster={media?.heroPoster || undefined}>
            <source src={media.heroVideo} />
          </video>
        )}
        {hasImage && <img className="ready" src={media.heroImage || media.heroPoster} alt="" />}
      </div>

      <div className="aurora" style={{ zIndex: 2, opacity: .55 }}><i className="b1" /><i className="b2" /><i className="b3" /></div>
      <div className="gridlines" />
      <div className="motes" id="motes" />
      <div className="hero-veil" /><div className="hero-veil2" />

      {hasVideo && (
        <button className="vtoggle on" onClick={toggle} aria-label={muted ? "Unmute video" : "Mute video"}>
          <svg viewBox="0 0 24 24">
            <path d="M4 9h4l5-4v14l-5-4H4z" />
            {muted ? <path d="M17 9a4 4 0 0 1 0 6" />
                   : <><path d="M17 8a6 6 0 0 1 0 8" /><path d="M19.5 5.5a9 9 0 0 1 0 13" /></>}
          </svg>
        </button>
      )}

      <div className="hero-in">
        <p className="pill fs dl1" style={{ marginInline: "auto" }}>{copy.kicker}</p>
        <h1 className="splitme" data-delay="420">{copy.heading}</h1>
        <p className="lede fs dl2">{copy.lede}</p>
        <div className="hero-cta fs dl3">
          <Link className="btn btn-gold btn-lg" href="/about">Plan Your Visit</Link>
          <Link className="btn btn-glass btn-lg" href="/live">Watch Live Service</Link>
        </div>
      </div>

      <div className="scroller fs dl4"><span>SCROLL</span><i /></div>
      <NextService site={site} variant="bar" />
    </section>
  );
}
