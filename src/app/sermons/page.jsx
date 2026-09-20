import { getContent } from "@/lib/content";
import PageHero from "@/components/PageHero";
import Player from "@/components/Player";
import { SermonRow, FeatureCard } from "@/components/Cards";

export const metadata = { title: "Sermons — RCCG Glory of God Parish, Exeter" };

export default async function SermonsPage() {
  const c = await getContent();
  const latest = c.sermons[0];
  return (
    <>
      <PageHero crumb="Sermons" heading="The Word, Whenever You Need It" image={c.media.sermonsHero}
        lede="Every message preached at Glory House, streamed live and kept for you to revisit." />

      <section className="sec dark">
        <div className="aurora" style={{ opacity: .45 }}><i className="b3" /></div>
        <div className="wrap">
          <Player image={c.media.sermonThumb} tag="Latest Message" href="/live"
            style={{ maxWidth: 960, marginInline: "auto" }} />
          {latest && (
            <div style={{ textAlign: "center", marginTop: "2rem" }} data-anim="up">
              <h2 className="h-sec center" style={{ fontSize: "var(--t-xl)" }}>{latest.title}</h2>
              <p style={{ marginTop: ".7rem", color: "var(--dim)", letterSpacing: ".08em", fontSize: "var(--t-sm)" }}>
                {latest.speaker} &nbsp;•&nbsp; {latest.day} {latest.year}</p>
            </div>
          )}
        </div>
      </section>

      <section className="sec dark" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2 className="h-sec" data-anim="up" style={{ fontSize: "var(--t-xl)" }}>Sermon Archive</h2>
          <div style={{ marginTop: "1.8rem" }}>
            {c.sermons.map((s, i) => <SermonRow key={s.id} item={s} index={i} />)}
          </div>
        </div>
      </section>

      <section className="sec cream">
        <div className="wrap">
          <div className="center-head" data-anim="up">
            <p className="pill">From the parish</p>
            <h2 className="h-sec center">Latest Writing</h2>
          </div>
          <div className="fgrid">
            {c.blog.map((b, i) => (
              <FeatureCard key={b.slug} index={i}
                item={{ title: b.title, body: b.excerpt, tag: b.date, image: b.image, href: "/sermons" }} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
