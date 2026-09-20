export default function Marquee({ items = [] }) {
  const all = items.concat(items);
  return (
    <div className="marq">
      <div className="marq-track">
        {all.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}
