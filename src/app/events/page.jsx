import { getContent } from "@/lib/content";
import PageHero from "@/components/PageHero";
import Accordion from "@/components/Accordion";
import { EventCard } from "@/components/Cards";

export const metadata = { title: "Events — RCCG Glory of God Parish, Exeter" };

export default async function EventsPage() {
  const c = await getContent();
  return (
    <>
      <PageHero crumb="Events" heading="What's On At Glory House" image={c.media.eventsHero}
        lede="Services, conventions, outreach days and the quieter gatherings in between." />
      <section className="sec dark">
        <div className="aurora" style={{ opacity: .4 }}><i className="b3" /></div>
        <div className="wrap">
          <div className="elist">
            {c.events.map((e, i) => <EventCard key={e.id} item={e} index={i} />)}
          </div>
        </div>
      </section>
      <section className="sec cream">
        <div className="wrap split">
          <div data-anim="left">
            <p className="pill">Weekly rhythm</p>
            <h2 className="h-sec">The Shape Of <span className="it">Our Week</span></h2>
            <p className="lede">Beyond the calendar, these are the gatherings you can count on every single week.</p>
          </div>
          <div data-anim="right">
            <Accordion items={c.pages.weeklyRhythm || []} style={{ marginTop: 0 }} />
          </div>
        </div>
      </section>
    </>
  );
}
