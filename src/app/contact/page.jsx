import { getContent } from "@/lib/content";
import PageHero from "@/components/PageHero";
import PrayerForm from "@/components/PrayerForm";
import Icon from "@/components/Icon";

export const metadata = { title: "Contact — RCCG Glory of God Parish, Exeter" };

export default async function ContactPage() {
  const c = await getContent();
  const s = c.site;
  return (
    <>
      <PageHero crumb="Contact" heading="We Would Love To Hear From You" image={c.media.contactHero}
        lede="Prayer requests, first visits, joining a ministry or a question about giving — this reaches the right person." />

      <section className="sec dark" style={{ paddingTop: "clamp(2.6rem,5vw,4rem)" }}>
        <div className="wrap">
          <div className="cstrip">
            <div className="citem" data-anim="up">
              <span className="ci"><Icon name="pin" /></span>
              <div><h4>Visit Us</h4><p>{s.venue}<br />{s.address1}<br />{s.address2}</p></div>
            </div>
            <div className="citem" data-anim="up" style={{ transitionDelay: ".1s" }}>
              <span className="ci"><Icon name="phone" /></span>
              <div><h4>Call Us</h4>
                <a href={`tel:${s.prayerLineTel}`}>{s.prayerLine} — 24/7 prayer line</a><br />
                <a href={`tel:${s.officeTel}`}>{s.office} — parish office</a></div>
            </div>
            <div className="citem" data-anim="up" style={{ transitionDelay: ".2s" }}>
              <span className="ci"><Icon name="mail" /></span>
              <div><h4>Service Times</h4>
                <p>Sunday 10:00am<br />Wednesday 6:00pm<br />Doors open 30 minutes before</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec dark" style={{ paddingTop: 0 }}>
        <div className="aurora" style={{ opacity: .4 }}><i className="b1" /></div>
        <div className="wrap split">
          <div data-anim="left">
            <p className="pill">Send a message</p>
            <h2 className="h-sec">We Reply <span className="it">Within 24 Hours</span></h2>
            <p className="lede">Everything you write stays between you, the pastors and the prayer band.</p>
            <div className="mapbox" style={{ marginTop: "2.4rem" }} data-anim="up">
              <svg viewBox="0 0 640 400" role="img" aria-label="Map showing Glory House on Northernhay Street, Exeter">
                <rect width="640" height="400" fill="#0B0E33" />
                <g stroke="#2E3192" strokeWidth="16" fill="none" strokeLinecap="square" opacity=".9">
                  <path d="M-20 130 H660" /><path d="M-20 300 H660" /><path d="M140 -20 V420" /><path d="M460 -20 V420" /></g>
                <g stroke="#191052" strokeWidth="7" fill="none">
                  <path d="M-20 215 H660" /><path d="M300 -20 V420" /><path d="M-20 55 H660" /><path d="M560 -20 V420" /></g>
                <path d="M40 40 h150 v70 H40z" fill="#1C3A5E" opacity=".75" />
                <path d="M400 310 h180 v80 H400z" fill="#1C3A5E" opacity=".75" />
                <circle cx="300" cy="215" r="46" fill="#E8B44A" fillOpacity=".18">
                  <animate attributeName="r" values="34;58;34" dur="3.2s" repeatCount="indefinite" />
                  <animate attributeName="fill-opacity" values=".32;.04;.32" dur="3.2s" repeatCount="indefinite" /></circle>
                <circle cx="300" cy="215" r="17" fill="#E8B44A" /><circle cx="300" cy="215" r="7" fill="#05061C" />
                <text x="328" y="204" fontFamily="Outfit,sans-serif" fontSize="15" fill="#FFE6B0" fontWeight="500">Glory House</text>
                <text x="328" y="225" fontFamily="Outfit,sans-serif" fontSize="12" fill="#B7BBE6">37 Northernhay Street</text>
                <text x="48" y="88" fontFamily="Outfit,sans-serif" fontSize="12" fill="#7E86C8">Northernhay Gardens</text>
                <text x="410" y="358" fontFamily="Outfit,sans-serif" fontSize="12" fill="#7E86C8">Cathedral Green</text>
              </svg>
              <div className="mpin">
                <span>Exeter Central station — 4 minutes on foot</span>
                <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer">Open in Maps</a>
              </div>
            </div>
          </div>
          <PrayerForm />
        </div>
      </section>
    </>
  );
}
