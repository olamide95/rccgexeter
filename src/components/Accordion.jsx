export default function Accordion({ items = [], style }) {
  return (
    <div className="acc" data-anim="up" style={style}>
      {items.map((it, i) => (
        <div className="acc-item" key={i}>
          <button className="acc-btn" type="button">{it.q}</button>
          <div className="acc-body"><p>{it.a}</p></div>
        </div>
      ))}
    </div>
  );
}
