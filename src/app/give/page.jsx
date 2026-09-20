import Link from "next/link";
import { getContent } from "@/lib/content";
import PageHero from "@/components/PageHero";
import Divider from "@/components/Divider";
import { FeatureCard } from "@/components/Cards";

export const metadata = { title: "Give — RCCG Glory of God Parish, Exeter" };

export default async function GivePage() {
  const c = await getContent();
  const g = c.pages.give || {};
  const bank = c.site.giving || {};
  const cards = [
    { t: "Account Name", v: bank.accountName, d: "Bank transfer or standing order" },
    { t: "Sort Code", v: bank.sortCode, d: "UK domestic transfers" },
    { t: "Account Number", v: bank.accountNumber, d: "Please add your name as the reference" },
    { t: "Gift Aid", v: bank.giftAid, d: "UK taxpayers can add 25p to every £1 given" }
  ];

  return (
    <>
      <PageHero crumb="Give" heading={g.heading} lede={g.lede} image={c.media.giveHero} />
      <section className="sec dark">
        <div className="aurora" style={{ opacity: .45 }}><i className="b1" /></div>
        <div className="wrap">
          <div className="center-head" data-anim="up">
            <p className="pill">Ways to give</p>
            <h2 className="h-sec center">Give Once, Or Set Up <span className="it">A Standing Order</span></h2>
            <Divider />
          </div>
          <div className="gcards">
            {cards.map((c2, i) => (
              <div className="gcard tilt" key={i} data-anim="up" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="gt">{c2.t}</div>
                <div className="gv">{c2.v}</div>
                <div className="gd">{c2.d}</div>
              </div>
            ))}
          </div>
          {bank.note ? (
            <p style={{ textAlign: "center", marginTop: "2.6rem", color: "var(--dim)", fontSize: "var(--t-sm)" }} data-anim="up">
              {bank.note}</p>
          ) : null}
        </div>
      </section>

      <section className="sec cream">
        <div className="wrap">
          <div className="center-head" data-anim="up">
            <p className="pill">Where it goes</p>
            <h2 className="h-sec center">Every Gift Does <span className="it">Something Specific</span></h2>
          </div>
          <div className="fgrid">
            {(g.uses || []).map((u, i) => (
              <FeatureCard key={i} index={i} item={{ title: u.title, body: u.body, tag: u.tag, image: u.image }} />
            ))}
          </div>
        </div>
      </section>

      <section className="ctaband">
        <div className="aurora"><i className="b3" /></div>
        <div className="wrap" data-anim="zoom" style={{ position: "relative", zIndex: 5 }}>
          <h2>Questions About Giving <span className="it">Or Gift Aid?</span></h2>
          <Link className="btn btn-gold btn-lg" style={{ marginTop: "2rem" }} href="/contact">Ask The Parish Office</Link>
        </div>
      </section>
    </>
  );
}
