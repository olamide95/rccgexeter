import Link from "next/link";
import { getContent } from "@/lib/content";
import PageHero from "@/components/PageHero";
import Media from "@/components/Media";

export const metadata = { title: "Leadership — RCCG Glory of God Parish, Exeter" };

export default async function LeadershipPage() {
  const c = await getContent();
  const l = c.pages.leadership || {};
  const pp = l.parishPastors || {};
  const go = l.generalOverseer || {};

  return (
    <>
      <PageHero crumb="Leadership" heading={l.heading} lede={l.lede} image={c.media.leadershipHero} />

      <section className="sec dark">
        <div className="aurora" style={{ opacity: .4 }}><i className="b2" /></div>
        <div className="wrap split">
          <Media src={c.media.pastorOdewunmi} className="arch" kenBurns zoomable anim="wipe"
            caption={pp.name} style={{ aspectRatio: "3/4", maxWidth: 440 }} />
          <div data-anim="right">
            <p className="pill">Parish pastors</p>
            <h2 className="h-sec">{pp.name}</h2>
            <p className="lede" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.55rem", color: "var(--gold-hi)", lineHeight: 1.5 }}>
              &ldquo;{pp.quote}&rdquo;</p>
            {(pp.body || []).map((p, i) => <p key={i} style={{ marginTop: "1.25rem", lineHeight: 1.95 }}>{p}</p>)}
            <Link className="btn btn-gold" style={{ marginTop: "2.2rem" }} href="/contact">Book A Conversation</Link>
          </div>
        </div>
      </section>

      <section className="sec light">
        <div className="wrap split">
          <div data-anim="left">
            <p className="pill">General Overseer, RCCG Worldwide</p>
            <h2 className="h-sec">{go.name}</h2>
            <p className="lede">{go.lede}</p>
            {(go.body || []).map((p, i) => <p key={i} style={{ marginTop: "1.2rem", lineHeight: 1.95 }}>{p}</p>)}
          </div>
          <Media src={c.media.pastorAdeboye} className="arch" kenBurns zoomable anim="wipe"
            caption="Pastor E. A. Adeboye" style={{ aspectRatio: "3/4", maxWidth: 440, marginInline: "auto" }} />
        </div>
      </section>

      <section className="sec dark">
        <div className="wrap">
          <div className="center-head" data-anim="up">
            <p className="pill">Parish team</p>
            <h2 className="h-sec center">Serving Alongside</h2>
          </div>
          <div className="lead">
            {c.team.map((t, i) => (
              <article className="lcard" key={i} data-anim="up" style={{ transitionDelay: `${(i % 2) * 0.1}s` }}>
                <Media src={t.image} className="arch" zoomable seed={i * 23} />
                <div>
                  <p className="lrole">{t.role}</p>
                  <h3 className="lname">{t.name}</h3>
                  <p className="lbody">{t.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
