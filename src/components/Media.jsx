/**
 * Every photo / video slot on the site.
 * Pass src from content/media.json (or any collection). If src is empty
 * an animated placeholder renders instead, so the layout never breaks.
 */
export default function Media({
  src = "", caption = "", className = "", style = {},
  kenBurns = false, zoomable = false, seed = 0, anim, video = false, as: Tag = "figure"
}) {
  const isVideo = video || /\.(mp4|webm|mov)(\?|$)/i.test(src);
  const cls = ["media", kenBurns ? "kb" : "", zoomable ? "zoomable" : "", className].filter(Boolean).join(" ");

  return (
    <Tag className={cls} style={{ margin: 0, ...style }} data-anim={anim}>
      {!src && (
        <span className="ph">
          <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <g stroke="#FFE6B0" strokeOpacity=".26" strokeWidth="1.2" fill="none">
              <path d={`M200 ${130 + (seed % 40)} V500 M120 500 V215 a80 80 0 0 1 160 0 V500`} />
              <path d="M50 500 V270 a150 150 0 0 1 300 0 V500" />
            </g>
            <circle cx="200" cy={150 + (seed % 30)} r="48" fill="none" stroke="#FFE6B0" strokeOpacity=".55" strokeWidth="1.3" />
            <circle cx="200" cy={150 + (seed % 30)} r="22" fill="#FFE6B0" fillOpacity=".4" />
          </svg>
        </span>
      )}
      {src && !isVideo && <img className="ready" src={src} alt={caption} loading="lazy" />}
      {src && isVideo && (
        <video className="ready" playsInline muted loop autoPlay preload="metadata">
          <source src={src} />
        </video>
      )}
      {caption ? <figcaption className="cap">{caption}</figcaption> : null}
    </Tag>
  );
}
