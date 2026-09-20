"use client";
import { useEffect, useState } from "react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function londonNow() {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false
    }).formatToParts(new Date());
    const map = {};
    parts.forEach((p) => { map[p.type] = p.value; });
    const idx = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(map.weekday.slice(0, 3));
    return { day: idx < 0 ? new Date().getDay() : idx, h: Number(map.hour) % 24, m: Number(map.minute) };
  } catch {
    const d = new Date();
    return { day: d.getDay(), h: d.getHours(), m: d.getMinutes() };
  }
}

export function computeNext(services) {
  const now = londonNow();
  const nowMin = now.day * 1440 + now.h * 60 + now.m;
  let best = null, live = null;
  (services || []).forEach((s) => {
    const start = s.day * 1440 + s.hour * 60 + s.minute;
    if (nowMin >= start && nowMin < start + (s.minutes || 90)) live = s;
    let d = start - nowMin;
    while (d < 0) d += 10080;
    if (!best || d < best.delta) best = { svc: s, delta: d };
  });
  return { best, live };
}

export default function NextService({ site, variant = "bar" }) {
  const [state, setState] = useState({ label: "Next Gathering", value: "" });

  useEffect(() => {
    const tick = () => {
      const { best, live } = computeNext(site?.services);
      document.querySelectorAll(".svc[data-day]").forEach((el) => {
        el.classList.toggle("now", Boolean(live) && Number(el.dataset.day) === live.day);
      });
      if (live) {
        setState({ label: "Happening right now", value: `${live.name} is under way — join the live stream` });
        return;
      }
      if (!best) return;
      const d = best.delta;
      const dd = Math.floor(d / 1440), hh = Math.floor((d % 1440) / 60), mm = d % 60;
      const when = dd >= 1 ? `${dd} ${dd === 1 ? "day" : "days"} ${hh} ${hh === 1 ? "hour" : "hours"}`
        : hh >= 1 ? `${hh} ${hh === 1 ? "hour" : "hours"} ${mm} ${mm === 1 ? "minute" : "minutes"}`
        : `${mm} ${mm === 1 ? "minute" : "minutes"}`;
      setState({
        label: "Next Gathering",
        value: `${DAYS[best.svc.day]} ${best.svc.label} — in ${when}`
      });
    };
    tick();
    const t = setInterval(tick, 30000);
    return () => clearInterval(t);
  }, [site]);

  if (variant === "plain") return <>{state.value}</>;

  return (
    <div className="livebar fs dl4">
      <div className="livebar-in">
        <span className="livedot" />
        <div>
          <div className="lb">{state.label}</div>
          <div className="lv">{state.value}</div>
        </div>
        <div className="lp">{site?.venue}, {site?.address1}, {site?.address2} —{" "}
          <a href={site?.mapsUrl} target="_blank" rel="noopener noreferrer">Get Directions</a></div>
      </div>
    </div>
  );
}
