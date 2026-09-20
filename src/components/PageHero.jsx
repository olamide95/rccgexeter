import Media from "./Media";

export default function PageHero({ crumb, heading, lede, image }) {
  return (
    <section className="phero">
      <Media src={image} kenBurns />
      <div className="veil" />
      <div className="aurora" style={{ zIndex: 3, opacity: .5 }}><i className="b1" /><i className="b2" /></div>
      <div className="wrap" style={{ position: "relative", zIndex: 5 }}>
        <p className="crumb"><a href="/">Home</a> &nbsp;/&nbsp; {crumb}</p>
        <h1 className="splitme">{heading}</h1>
        {lede ? <p className="lede" data-anim="up">{lede}</p> : null}
      </div>
    </section>
  );
}
