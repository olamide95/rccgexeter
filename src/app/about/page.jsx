import { getContent } from "@/lib/content";
import PageHero from "@/components/PageHero";
import Media from "@/components/Media";
import Band from "@/components/Band";
import Accordion from "@/components/Accordion";
import { FeatureCard } from "@/components/Cards";

export const metadata = { title: "About Us — RCCG Glory of God Parish, Exeter" };

export default async function AboutPage() {
  const c = await getContent();
  const a = c.pages.about || {};
  return (
    <>
      <PageHero crumb="About Us" heading={a.heading} lede={a.lede} image={c.media.aboutHero} />

      <section className="sec light">
        <div className="wrap split">
          <div data-anim="left">
            <p className="pill">Our story</p>
            <h2 className="h-sec">{a.storyHeading}</h2>
            {(a.storyBody || []).map((p, i) => (
              <p key={i} className={i === 0 ? "lede" : ""} style={i ? { marginTop: "1.2rem", lineHeight: 1.95 } : undefined}>{p}</p>
            ))}
          </div>
          <div className="collage" data-anim="wipe">
            <span className="frame" />
            <Media src={c.media.aboutStory} className="big arch" kenBurns zoomable caption="Glory House, Northernhay Street" />
            <Media src={c.media.about2} className="small rounded" zoomable />
          </div>
        </div>
      </section>

      <section className="sec dark">
        <div className="aurora" style={{ opacity: .5 }}><i className="b2" /><i className="b3" /></div>
        <div className="wrap">
          <div className="center-head" data-anim="up">
            <p className="pill">Our mandate</p>
            <h2 className="h-sec center">Three Things This Church <span className="it">Exists To Do</span></h2>
          </div>
          <div className="fgrid">
            {(a.mandate || []).map((m, i) => (
              <FeatureCard key={i} index={i} item={{ title: m.title, body: m.body, tag: m.label, image: m.image }} />
            ))}
          </div>
        </div>
      </section>

      <section className="sec cream">
        <div className="wrap narrow">
          <div className="center-head" data-anim="up">
            <p className="pill">Statement of faith</p>
            <h2 className="h-sec center">What We Believe</h2>
          </div>
          <Accordion items={a.faith || []} />
        </div>
      </section>

      <Band image={c.media.band1}>
        <div className="quoteblk" data-anim="zoom">
          <span className="bigmark">&ldquo;</span>
          <p className="q">Commissioned to meet the physical needs of the inhabitants of Exeter and its environs,
            regardless of past or present experiences and situations.</p>
          <p className="qr">Our Commission</p>
        </div>
      </Band>
    </>
  );
}
