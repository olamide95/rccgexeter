import Link from "next/link";
import { getContent } from "@/lib/content";
import PageHero from "@/components/PageHero";
import { MinistryCard } from "@/components/Cards";

export const metadata = { title: "Ministries — RCCG Glory of God Parish, Exeter" };

export default async function MinistriesPage() {
  const c = await getContent();
  return (
    <>
      <PageHero crumb="Ministries" heading="Find Your People" image={c.media.ministriesHero}
        lede="Every ministry here is open. You do not need an invitation — only an interest." />
      <section className="sec dark">
        <div className="aurora" style={{ opacity: .4 }}><i className="b1" /></div>
        <div className="wrap">
          <div className="mgrid">
            {c.ministries.map((m, i) => <MinistryCard key={m.slug} item={m} index={i} />)}
          </div>
        </div>
      </section>
      <section className="ctaband">
        <div className="aurora"><i className="b3" /></div>
        <div className="wrap" data-anim="zoom" style={{ position: "relative", zIndex: 5 }}>
          <h2>Not Sure Where <span className="it">You Fit?</span></h2>
          <p className="lede" style={{ marginInline: "auto", textAlign: "center" }}>
            Tell us a little about yourself and we will point you to the ministry that suits you best.</p>
          <Link className="btn btn-gold btn-lg" style={{ marginTop: "2.2rem" }} href="/contact">Talk To Us</Link>
        </div>
      </section>
    </>
  );
}
