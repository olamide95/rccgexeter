import Link from "next/link";
import { getContent } from "@/lib/content";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Media from "@/components/Media";
import Band from "@/components/Band";
import Divider from "@/components/Divider";
import Player from "@/components/Player";
import Gallery from "@/components/Gallery";
import Testimonies from "@/components/Testimonies";
import ServiceCards from "@/components/ServiceCards";
import { FeatureCard, MinistryCard, EventCard } from "@/components/Cards";

export default async function HomePage() {
  const c = await getContent();
  const home = c.pages.home || {};
  const [lead, ...rest] = (home.welcomeHeading || "").split(home.welcomeHighlight || "\u0000");

  return (
    <>
      <Hero media={c.media} copy={home} site={c.site} />
      <Marquee items={c.site.marquee || []} />

      {/* welcome */}
      <section className="sec dark">
        <div className="aurora" style={{ opacity: .5 }}><i className="b2" /></div>
        <div className="wrap split wide-l">
          <div data-anim="left">
            <p className="pill">Welcome home</p>
            <h2 className="h-sec">
              {lead}<span className="shine it">{home.welcomeHighlight}</span>{rest.join("")}
            </h2>
            {(home.welcomeBody || []).map((p, i) => (
              <p key={i} className={i === 0 ? "lede" : ""} style={i ? { marginTop: "1.2rem", lineHeight: 1.9 } : undefined}>{p}</p>
            ))}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "2.2rem" }}>
              <Link className="btn btn-gold" href="/about">Our Story</Link>
              <Link className="btn btn-glass" href="/leadership">Meet The Pastors</Link>
            </div>
          </div>
          <div className="collage" data-anim="wipe">
            <span className="frame" />
            <Media src={c.media.welcome} className="big arch" kenBurns zoomable caption="Sunday worship at Glory House" />
            <Media src={c.media.welcome2} className="small rounded" zoomable />
          </div>
        </div>
      </section>

      {/* stats over a parallax band */}
      <Band image={c.media.band1}>
        <div className="stats" data-anim="up">
          {(c.site.stats || []).map((s, i) => (
            <div className="stat" key={i}>
              <div className="n"><span className="count" data-to={s.value}>0</span>{s.suffix}</div>
              <div className="l">{s.label}</div>
            </div>
          ))}
        </div>
      </Band>

      {/* services */}
      <section className="sec dark">
        <div className="aurora" style={{ opacity: .4 }}><i className="b1" /><i className="b3" /></div>
        <div className="wrap">
          <div className="center-head" data-anim="up">
            <p className="pill">Service times</p>
            <h2 className="h-sec center">Two Gatherings <span className="it">Every Week</span></h2>
            <Divider />
            <p className="lede">Doors open half an hour before every service. No dress code, no sign-in — simply come as you are.</p>
          </div>
          <ServiceCards site={c.site} />
        </div>
      </section>

      {/* start here */}
      <section className="sec cream">
        <div className="wrap">
          <div className="center-head" data-anim="up">
            <p className="pill">Start here</p>
            <h2 className="h-sec center">However You Arrived, <span className="it">There Is A Next Step</span></h2>
          </div>
          <div className="fgrid">
            {(c.pages.startHere || []).map((it, i) => <FeatureCard key={i} item={it} index={i} />)}
          </div>
        </div>
      </section>

      {/* confession */}
      <Band image={c.media.band2}>
        <div className="quoteblk" data-anim="zoom">
          <span className="bigmark">&ldquo;</span>
          <p className="q">{home.confession}</p>
          <p className="qr">{home.confessionRef}</p>
        </div>
      </Band>

      {/* ministries */}
      <section className="sec dark">
        <div className="aurora" style={{ opacity: .4 }}><i className="b2" /></div>
        <div className="wrap">
          <div className="center-head" data-anim="up">
            <p className="pill">Our ministries</p>
            <h2 className="h-sec center">A Place For <span className="shine it">Everyone</span> In Your House</h2>
          </div>
          <div className="mgrid">
            {c.ministries.slice(0, 4).map((m, i) => <MinistryCard key={m.slug} item={m} index={i} />)}
          </div>
          <div style={{ textAlign: "center", marginTop: "2.8rem" }} data-anim="up">
            <Link className="btn btn-glass btn-lg" href="/ministries">See All Ministries</Link>
          </div>
        </div>
      </section>

      {/* sermons */}
      <section className="sec cream">
        <div className="wrap split">
          <Player image={c.media.sermonThumb} tag="Live Sunday" href="/live" />
          <div data-anim="right">
            <p className="pill">Sermons &amp; media</p>
            <h2 className="h-sec">Missed Sunday? <span className="it">Catch Up In Full.</span></h2>
            <p className="lede">Every service is streamed live from 10:00am and kept in the archive afterwards — so you
              can watch again, or send it to someone who needs it today.</p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "2.2rem" }}>
              <Link className="btn btn-royal" href="/live">Watch Live</Link>
              <Link className="btn btn-outline" href="/sermons">Browse Archive</Link>
            </div>
          </div>
        </div>
      </section>

      {/* gallery */}
      <section className="sec dark">
        <div className="aurora" style={{ opacity: .4 }}><i className="b1" /></div>
        <div className="wrap">
          <div className="center-head" data-anim="up">
            <p className="pill">Life at Glory House</p>
            <h2 className="h-sec center">Moments From <span className="it">Our Family</span></h2>
          </div>
          <Gallery items={c.gallery.slice(0, 4)} />
          <div style={{ textAlign: "center", marginTop: "2.6rem" }} data-anim="up">
            <Link className="btn btn-glass btn-lg" href="/gallery">Open Full Gallery</Link>
          </div>
        </div>
      </section>

      {/* testimonies */}
      <section className="sec royal">
        <div className="aurora" style={{ opacity: .42 }}><i className="b1" /></div>
        <div className="wrap">
          <div className="center-head" data-anim="up">
            <p className="pill">Testimonies</p>
            <h2 className="h-sec center">What God Has Done</h2>
          </div>
          <Testimonies items={c.testimonies} />
        </div>
      </section>

      {/* events */}
      <section className="sec dark">
        <div className="wrap">
          <div className="center-head" data-anim="up">
            <p className="pill">What&apos;s on</p>
            <h2 className="h-sec center">Coming Up At The Parish</h2>
          </div>
          <div className="elist">
            {c.events.slice(0, 4).map((e, i) => <EventCard key={e.id} item={e} index={i} />)}
          </div>
          <div style={{ textAlign: "center", marginTop: "2.6rem" }} data-anim="up">
            <Link className="btn btn-gold btn-lg" href="/events">Full Calendar</Link>
          </div>
        </div>
      </section>

      <section className="ctaband">
        <div className="aurora"><i className="b3" /></div>
        <div className="wrap" data-anim="zoom" style={{ position: "relative", zIndex: 5 }}>
          <h2>We Would Love To Meet You <span className="it">This Sunday.</span></h2>
          <p className="lede" style={{ marginInline: "auto", textAlign: "center" }}>
            {c.site.venue}, {c.site.address1}, {c.site.address2} — 10:00am.</p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginTop: "2.4rem" }}>
            <Link className="btn btn-gold btn-lg" href="/contact">Get In Touch</Link>
            <a className="btn btn-glass btn-lg" href={c.site.mapsUrl} target="_blank" rel="noopener noreferrer">Directions</a>
          </div>
        </div>
      </section>
    </>
  );
}
