import { useEffect, useRef } from "react";
import { RM } from "../data";

/* 3D universe background, 360 degrees, driven by cursor and scroll */
export default function Sky() {
  const cvRef = useRef(null);
  const curRef = useRef(null);

  useEffect(() => {
    const cv = cvRef.current;
    const x = cv.getContext("2d");
    const D = Math.min(devicePixelRatio || 1, 2), TAU = 6.2832;
    let W, H, F, pts = [];

    const mk = () => {
      W = innerWidth; H = innerHeight; F = Math.max(W, H) * 0.85;
      cv.width = W * D; cv.height = H * D;
      cv.style.width = W + "px"; cv.style.height = H + "px";
      x.setTransform(D, 0, 0, D, 0, 0);
      const n = W < 700 ? 800 : 1500;
      pts = Array.from({ length: n + 8 }, (_, i) => {
        const u = Math.random() * 2 - 1, t = Math.random() * TAU, q = Math.sqrt(1 - u * u);
        return {
          x: q * Math.cos(t), y: u, z: q * Math.sin(t),
          r: Math.random() < 0.05 ? 1.7 : Math.random() * 0.8 + 0.35,
          a: Math.random() * TAU, s: Math.random() * 0.03 + 0.005,
          ring: i >= n, pop: i < n && Math.random() < 0.12,
          c: Math.random() < 0.5 ? "166,108,255" : "255,255,255",
        };
      });
      pts.forEach((s) => {
        s.d = s.pop ? 0.14 + Math.random() * 0.22 : 1;
        s.d0 = s.d; s.ph = Math.random() * TAU;
        if (s.pop) s.r = 1.1 + Math.random() * 0.9;
      });
    };
    mk();
    addEventListener("resize", mk);

    let vp = 0, ox = 0, oy = 0, mx = 0.5, my = 0.5, yaw = 0, pit = 0, vy = 0, last = scrollY;
    const onMove = (e) => { mx = e.clientX / innerWidth; my = e.clientY / innerHeight; };
    addEventListener("pointermove", onMove);

    const draw = () => {
      const ca = Math.cos(yaw), sa = Math.sin(yaw), cb = Math.cos(pit), sb = Math.sin(pit);
      x.clearRect(0, 0, W, H); x.fillStyle = "#fff";
      for (const s of pts) {
        const x1 = s.x * ca + s.z * sa, z1 = -s.x * sa + s.z * ca,
          y2 = s.y * cb - z1 * sb, z2 = s.y * sb + z1 * cb;
        let dd = s.d;
        if (s.pop && !RM) dd = s.d0 + 0.04 * Math.sin((s.ph += 0.012));
        const zv = z2 * dd;
        if (zv < (s.pop ? 0.03 : 0.12)) continue;
        const px = W / 2 + ((x1 * dd - ox) / zv) * F * 0.5,
          py = H / 2 + ((y2 * dd - oy) / zv) * F * 0.5;
        if (px < -20 || px > W + 20 || py < -20 || py > H + 20) continue;
        const k = s.pop ? Math.min(0.05 / zv, 3) + 0.5 : 0.6 + 0.8 * Math.min(z2, 1);
        if (s.ring) {
          x.globalAlpha = 0.6; x.strokeStyle = `rgb(${s.c})`; x.lineWidth = 1.2;
          x.beginPath(); x.arc(px, py, 6 * k + 3, 0, TAU); x.stroke();
        } else {
          if (!RM) s.a += s.s;
          x.globalAlpha = (0.35 + 0.65 * Math.abs(Math.sin(s.a))) * Math.min(1, z2 * 1.6);
          if (s.pop) {
            x.globalAlpha = 0.95; x.shadowBlur = 14;
            x.shadowColor = `rgb(${s.c})`; x.fillStyle = `rgb(${s.c})`;
          }
          x.beginPath(); x.arc(px, py, s.r * k, 0, TAU); x.fill();
          if (s.pop) { x.shadowBlur = 0; x.fillStyle = "#fff"; }
        }
      }
    };

    if (RM) {
      draw();
      return () => {
        removeEventListener("resize", mk);
        removeEventListener("pointermove", onMove);
      };
    }

    /* cursor ring */
    const cur = curRef.current;
    cur.style.cssText =
      "position:fixed;left:0;top:0;width:26px;height:26px;margin:-13px 0 0 -13px;border:1.5px solid #a66cff;border-radius:50%;pointer-events:none;z-index:50;opacity:0;transition:opacity .3s";
    let cx = 0, cy = 0, tx = 0, ty = 0;
    const onCur = (e) => { tx = e.clientX; ty = e.clientY; cur.style.opacity = 1; };
    const fine = matchMedia("(pointer:fine)").matches;
    if (fine) addEventListener("pointermove", onCur);

    let raf;
    const f = () => {
      raf = requestAnimationFrame(f);
      const ds = scrollY - last; last = scrollY;
      const target = (mx - 0.5) * 0.009 + 0.00025 + ds * 0.002; /* cursor sets spin direction and speed; scroll adds turns */
      vy += (target - vy) * 0.08; yaw += vy;
      vp += ((my - 0.5) * 0.009 + 0.00012 + ds * 0.0008 - vp) * 0.08; pit += vp;
      ox += ((mx - 0.5) * 0.1 - ox) * 0.05; oy += ((my - 0.5) * 0.07 - oy) * 0.05;
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      cur.style.transform = `translate(${cx}px,${cy}px)`;
      draw();
    };
    f();

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", mk);
      removeEventListener("pointermove", onMove);
      if (fine) removeEventListener("pointermove", onCur);
    };
  }, []);

  return (
    <>
      <canvas id="sky" ref={cvRef} aria-hidden="true" />
      {!RM && <div ref={curRef} aria-hidden="true" />}
    </>
  );
}
