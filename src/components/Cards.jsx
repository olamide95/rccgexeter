import Link from "next/link";
import Media from "./Media";
import Icon from "./Icon";

export function FeatureCard({ item, index = 0 }) {
  const Wrapper = item.href ? Link : "div";
  const props = item.href ? { href: item.href } : {};
  return (
    <Wrapper {...props} className="fcard" data-anim="up" style={{ transitionDelay: `${(index % 4) * 0.1}s` }}>
      <Media src={item.image} zoomable seed={index * 11} />
      <div className="fbody">
        {item.icon ? <span className="ico"><Icon name={item.icon} /></span> : null}
        <h3 style={item.icon ? undefined : { marginTop: ".2rem" }}>{item.title}</h3>
        <p>{item.body}</p>
        <span className="go">{item.tag}</span>
      </div>
    </Wrapper>
  );
}

export function MinistryCard({ item, index = 0 }) {
  return (
    <Link href="/contact" className="mcard" data-anim="zoom" style={{ transitionDelay: `${(index % 4) * 0.09}s` }}>
      <Media src={item.image} seed={index * 13} />
      <Icon name={item.icon} className="mi" />
      <h3>{item.title}</h3>
      <p>{item.body}</p>
    </Link>
  );
}

export function EventCard({ item, index = 0 }) {
  return (
    <Link href="/events" className="ecard" data-anim="up" style={{ transitionDelay: `${(index % 4) * 0.08}s` }}>
      <span className="edate"><span className="dd">{item.day}</span><span className="mm">{item.month}</span></span>
      <Media src={item.image} className="ethumb" seed={index * 19} />
      <span><h3>{item.title}</h3><span className="em">{item.body}</span></span>
      <span className="ea">{item.time}</span>
    </Link>
  );
}

export function SermonRow({ item, index = 0 }) {
  return (
    <Link href="/live" className="srow" data-anim="up" style={{ transitionDelay: `${(index % 5) * 0.06}s` }}>
      <Media src={item.image} className="sthumb" seed={index * 29} />
      <span className="sd">{item.day}<br />{item.year}</span>
      <span><span className="st">{item.title}</span><span className="sb">{item.speaker}</span></span>
      <span className="sp"><svg viewBox="0 0 24 24"><path d="M6 3l15 9-15 9z" /></svg></span>
    </Link>
  );
}
