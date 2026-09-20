import { getContent } from "@/lib/content";
import PageHero from "@/components/PageHero";
import PrayerForm from "@/components/PrayerForm";
import Icon from "@/components/Icon";

export const metadata = {
  title: "Prayer Request — RCCG Glory of God Parish, Exeter",
  description: "Send a prayer request to the RCCG Glory of God Parish prayer team. Answered around the clock."
};

export default async function PrayerPage() {
  const c = await getContent();
  return (
    <>
      <PageHero crumb="Prayer Request" heading="Tell Us What To Pray About" image={c.media.prayerHero}
        lede="Our prayer band stands in the gap day and night. Nothing you send leaves the parish." />

      <section className="sec dark" style={{ paddingTop: "clamp(2.6rem,5vw,4rem)" }}>
        <div className="aurora" style={{ opacity: .4 }}><i className="b1" /></div>
        <div className="wrap prayer-wrap">
          <div data-anim="left">
            <p className="pill">How it works</p>
            <h2 className="h-sec">Someone Will Pray, <span className="it">And Someone Will Reply.</span></h2>
            <p className="lede">Every request that arrives here is read by the pastors and passed to the prayer band the
              same day. You will hear back within 24 hours.</p>

            <div style={{ marginTop: "2.2rem", display: "grid", gap: "1.1rem" }}>
              <div className="citem">
                <span className="ci"><Icon name="cross" /></span>
                <div><h4>Urgent tonight?</h4>
                  <a href={`tel:${c.site.prayerLineTel}`}>{c.site.prayerLine}</a>
                  <p>The prayer line is answered 24 hours a day, every day of the year.</p></div>
              </div>
              <div className="citem">
                <span className="ci"><Icon name="heart" /></span>
                <div><h4>Confidential requests</h4>
                  <p>Tick the confidential box and your request goes only to the pastors — never to the wider band.</p></div>
              </div>
              <div className="citem">
                <span className="ci"><Icon name="pin" /></span>
                <div><h4>Prefer to talk in person?</h4>
                  <p>{c.site.venue}, {c.site.address1}, {c.site.address2}. Come before or after any service.</p></div>
              </div>
            </div>
          </div>

          <div data-anim="right">
            <div className="glass" style={{ padding: "clamp(1.6rem,3.5vw,2.6rem)" }}>
              <p className="pill">Send a request</p>
              <PrayerForm compact />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
