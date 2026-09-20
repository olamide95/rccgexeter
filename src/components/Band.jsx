import Media from "./Media";

/** Full-bleed parallax image band. Children render over it. */
export default function Band({ image, children }) {
  return (
    <section className="band">
      <Media src={image} className="px" />
      <div className="veil" />
      <div className="bin">{children}</div>
    </section>
  );
}
