"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * All the global motion: scroll reveals, character-split headings,
 * counters, 3D tilt, cursor glow, parallax bands, scroll progress.
 * Re-runs whenever the route changes.
 */
export default function Effects() {
  const pathname = usePathname();

  useEffect(() => {
    const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* character-split headings */
    document.querySelectorAll(".splitme:not([data-split])").forEach((h) => {
      h.dataset.split = "1";
      const base = Number(h.dataset.delay || 250);
      let idx = 0, out = "";
      h.textContent.trim().split(/\s+/).forEach((w) => {
        out += '<span style="display:inline-block;white-space:nowrap">';
        w.split("").forEach((c) => {
          out += `<span class="char" style="transition-delay:${base + idx * 26}ms">${c}</span>`;
          idx++;
        });
        out += `</span><span class="char" style="transition-delay:${base + idx * 26}ms">&nbsp;</span>`;
        idx++;
      });
      h.innerHTML = out;
    });
    const playSplit = () =>
      document.querySelectorAll(".splitme .char").forEach((c) => c.classList.add("seen"));
    const splitTimer = setTimeout(playSplit, 120);

    /* counters */
    let counted = false;
    const startCounts = () => {
      if (counted) return;
      counted = true;
      document.querySelectorAll(".count").forEach((el) => {
        const to = Number(el.dataset.to);
        if (RM) { el.textContent = String(to); return; }
        let t0 = null;
        const step = (ts) => {
          if (!t0) t0 = ts;
          const p = Math.min((ts - t0) / 1900, 1);
          el.textContent = String(Math.floor(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    };

    /* reveal on scroll */
    let io = null;
    const targets = document.querySelectorAll("[data-anim]:not(.seen)");
    if (!RM && "IntersectionObserver" in window) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("seen");
          io.unobserve(e.target);
          if (e.target.classList.contains("stats")) startCounts();
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
      targets.forEach((el) => io.observe(el));
    } else {
      targets.forEach((el) => el.classList.add("seen"));
      startCounts();
    }

    /* scroll: progress bar, back-to-top, parallax bands */
    const prog = document.getElementById("prog");
    const totop = document.getElementById("totop");
    const pxEls = [...document.querySelectorAll(".band .media.px")];
    const onScroll = () => {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (prog) prog.style.width = `${h > 0 ? (y / h) * 100 : 0}%`;
      if (totop) totop.classList.toggle("show", y > 760);
      if (RM) return;
      pxEls.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        const im = el.querySelector("img");
        if (im) im.style.transform = `translateY(${p * -46}px) scale(1.02)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* cursor glow */
    const cg = document.getElementById("cglow");
    const onMove = (e) => { if (cg) { cg.style.left = `${e.clientX}px`; cg.style.top = `${e.clientY}px`; } };
    const fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
    if (!RM && fine) document.addEventListener("mousemove", onMove, { passive: true });

    /* 3D tilt */
    const onTilt = (e) => {
      const t = e.target.closest(".tilt");
      if (!t) return;
      const r = t.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      t.style.transform =
        `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-12px) scale(1.02)`;
    };
    const offTilt = (e) => { const t = e.target.closest(".tilt"); if (t) t.style.transform = ""; };
    if (!RM && fine) {
      document.addEventListener("mousemove", onTilt, { passive: true });
      document.addEventListener("mouseout", offTilt, { passive: true });
    }

    /* accordions */
    const accHandlers = [];
    document.querySelectorAll(".acc-item").forEach((item) => {
      const btn = item.querySelector(".acc-btn");
      const body = item.querySelector(".acc-body");
      const handler = () => {
        const open = item.classList.contains("open");
        item.parentElement.querySelectorAll(".acc-item").forEach((o) => {
          o.classList.remove("open");
          o.querySelector(".acc-body").style.maxHeight = null;
        });
        if (!open) { item.classList.add("open"); body.style.maxHeight = `${body.scrollHeight}px`; }
      };
      btn.addEventListener("click", handler);
      accHandlers.push([btn, handler]);
    });

    /* floating light motes in the hero */
    const mw = document.getElementById("motes");
    if (mw && !RM && !mw.dataset.built) {
      mw.dataset.built = "1";
      let f = "";
      for (let i = 0; i < 30; i++) {
        const sz = (Math.random() * 4.2 + 1.5).toFixed(1);
        const l = (Math.random() * 100).toFixed(1);
        const d = (Math.random() * 18 + 13).toFixed(1);
        const de = (Math.random() * 18).toFixed(1);
        const o = (Math.random() * 0.5 + 0.28).toFixed(2);
        f += `<span class="mote" style="width:${sz}px;height:${sz}px;left:${l}%;bottom:-14px;opacity:${o};animation-duration:${d}s;animation-delay:-${de}s"></span>`;
      }
      mw.innerHTML = f;
    }

    return () => {
      clearTimeout(splitTimer);
      if (io) io.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousemove", onTilt);
      document.removeEventListener("mouseout", offTilt);
      accHandlers.forEach(([btn, h]) => btn.removeEventListener("click", h));
    };
  }, [pathname]);

  return null;
}
