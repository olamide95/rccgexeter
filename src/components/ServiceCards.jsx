import Media from "./Media";

export default function ServiceCards({ site }) {
  const cards = [...(site?.services || [])].map((s) => ({ ...s, key: `svc-${s.day}` }));
  const prayer = site?.prayerCard;
  return (
    <div className="svcs">
      {cards.map((s, i) => (
        <div className="svc tilt" key={s.key} data-day={s.day} data-anim="flip"
          style={{ transitionDelay: `${i * 0.13}s` }}>
          <Media src={s.image} />
          <div className="sin">
            <div className="day">{s.dayName}</div>
            <div className="time">{s.time}<small>{s.meridiem}</small></div>
            <div className="nm">{s.name}</div>
            <p className="ds">{s.description}</p>
          </div>
        </div>
      ))}
      {prayer && (
        <div className="svc tilt" data-anim="flip" style={{ transitionDelay: "0.26s" }}>
          <Media src={prayer.image} />
          <div className="sin">
            <div className="day">{prayer.dayName}</div>
            <div className="time">{prayer.time}<small>{prayer.meridiem}</small></div>
            <div className="nm">{prayer.name}</div>
            <p className="ds">{prayer.description} Call {site?.prayerLine}.</p>
          </div>
        </div>
      )}
    </div>
  );
}
