import Link from "next/link";

export default function NotFound() {
  return (
    <section className="phero" style={{ minHeight: "70vh" }}>
      <div className="aurora"><i className="b1" /><i className="b3" /></div>
      <div className="wrap" style={{ position: "relative", zIndex: 5 }}>
        <p className="crumb">Page not found</p>
        <h1 className="splitme">That Page Has Moved On</h1>
        <p className="lede" style={{ marginInline: "auto" }}>
          The link you followed no longer exists — but Sunday is still 10:00am.</p>
        <Link className="btn btn-gold btn-lg" style={{ marginTop: "2rem" }} href="/">Back Home</Link>
      </div>
    </section>
  );
}
