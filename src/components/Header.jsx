"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  ["/", "Home"], ["/about", "About"], ["/leadership", "Leadership"],
  ["/ministries", "Ministries"], ["/sermons", "Sermons"], ["/gallery", "Gallery"],
  ["/events", "Events"], ["/give", "Give"], ["/prayer", "Prayer"], ["/contact", "Contact"]
];

export default function Header({ site }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className={`hdr${solid ? " solid" : ""}`}>
        <div className="hdr-in">
          <Link className="brand" href="/">
            <img src="/brand/logo-white.png" alt={site?.name || "RCCG Glory of God Parish, Exeter"} />
          </Link>
          <nav className="nav" aria-label="Main">
            <span className="nav-links" style={{ display: "contents" }}>
              {NAV.map(([href, label]) => (
                <Link key={href} href={href}
                  className={`lnk${pathname === href ? " active" : ""}`}>{label}</Link>
              ))}
            </span>
            <Link className="btn btn-gold hdr-cta" href="/live">Watch Live</Link>
            <button className="burger" aria-label="Open menu" aria-expanded={open}
              onClick={() => setOpen((v) => !v)}><i /><i /><i /></button>
          </nav>
        </div>
      </header>

      <div className={`drawer${open ? " open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu">
        <button className="dclose" aria-label="Close menu" onClick={() => setOpen(false)}>&times;</button>
        <nav>
          {NAV.concat([["/live", "Watch Live"]]).map(([href, label], i) => (
            <Link key={href + i} href={href} style={{ animationDelay: `${0.14 + i * 0.05}s` }}>
              {label} <span>{String(i + 1).padStart(2, "0")}</span>
            </Link>
          ))}
        </nav>
        <div className="d-foot">
          <b>{site?.venue}</b> — {site?.address1}, {site?.address2}<br />
          Sunday 10:00am &nbsp;•&nbsp; Wednesday 6:00pm<br />
          24/7 Prayer Line <b>{site?.prayerLine}</b>
        </div>
      </div>
    </>
  );
}
