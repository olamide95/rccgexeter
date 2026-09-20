import Link from "next/link";
import { getContent } from "@/lib/content";
import PageHero from "@/components/PageHero";
import Player from "@/components/Player";
import NextService from "@/components/NextService";

export const metadata = { title: "Watch Live — RCCG Glory of God Parish, Exeter" };

export default async function LivePage() {
  const c = await getContent();
  const embed = c.media.liveEmbed;
  return (
    <>
      <PageHero crumb="Watch Live" heading="Join Us From Anywhere" image={c.media.liveThumb}
        lede="Sunday 10:00am and Wednesday 6:00pm, London time. Wherever you are, there is a seat." />
      <section className="sec dark" style={{ paddingTop: "clamp(2rem,4vw,3rem)" }}>
        <div className="aurora" style={{ opacity: .45 }}><i className="b2" /></div>
        <div className="wrap">
          <Player image={c.media.liveThumb} tag="Live Stream" embed={embed} href="/sermons"
            style={{ maxWidth: 1040, marginInline: "auto" }} />
          {!embed && (
            <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--dim)", fontSize: "var(--t-sm)" }}>
              Add your YouTube or Facebook embed URL to <code>liveEmbed</code> in content/media.json
              (or through /admin) and this player goes live.
            </p>
          )}
          <div className="svcs" style={{ marginTop: "3.2rem" }}>
            <div className="glass tilt" data-anim="up">
              <div style={{ fontSize: ".66rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold)" }}>Next stream</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: "var(--t-lg)", color: "#fff", marginTop: ".7rem" }}>
                <NextService site={c.site} variant="plain" />
              </div>
              <p style={{ fontSize: "var(--t-sm)", marginTop: ".6rem", color: "var(--dim)" }}>All times are Europe/London.</p>
            </div>
            <div className="glass tilt" data-anim="up" style={{ transitionDelay: ".1s" }}>
              <div style={{ fontSize: ".66rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold)" }}>Prayer during service</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: "var(--t-lg)", color: "#fff", marginTop: ".7rem" }}>{c.site.prayerLine}</div>
              <p style={{ fontSize: "var(--t-sm)", marginTop: ".6rem", color: "var(--dim)" }}>Call in and someone will pray with you live.</p>
            </div>
            <div className="glass tilt" data-anim="up" style={{ transitionDelay: ".2s" }}>
              <div style={{ fontSize: ".66rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold)" }}>Missed it?</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: "var(--t-lg)", color: "#fff", marginTop: ".7rem" }}>Full archive</div>
              <p style={{ fontSize: "var(--t-sm)", marginTop: ".6rem" }}>
                <Link href="/sermons" style={{ color: "var(--gold-hi)" }}>Browse past services</Link></p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
