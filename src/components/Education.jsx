import { useEffect, useRef } from "react";

const items = [
  { dt: "2023", h: "St Joseph School, ICSE (Class 10)", p: "Completed ICSE with 95%.", },
  { dt: "2025", h: "St Joseph School, ISC (Class 12)", p: "Completed ISC with 94.7%.",  },
  { dt: "2025-Present", h: "IIIT Nagpur", p: "Studying Computer Science. Add your branch and one thing you enjoy about it.",},
  { dt: "Present", h: "Training and Placement Cell, IIIT Nagpur", p: "Senior Coordinator, managing training and placement drives for students.", },
];

/* a sun that travels down the timeline as you scroll */
export default function Education() {
  const secRef = useRef(null);
  const stgRef = useRef(null);
  const sunRef = useRef(null);
  const finRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const sec = secRef.current, stg = stgRef.current, sun = sunRef.current,
      fin = finRef.current, line = lineRef.current;
    const cards = [...sec.querySelectorAll(".ec")];
    const N = cards.length,
      L = (a, b, t) => a + (b - a) * t,
      cl = (v) => Math.max(0, Math.min(1, v));

    function upd() {
      const r = sec.getBoundingClientRect(),
        p = cl(-(r.top - 60) / (r.height - innerHeight)),
        seg = p * (N + 1),
        f1 = cl(seg - N);
      const y = L(L(16, 84, cl(seg / N)), 50, f1),
        lx = line.offsetLeft + 1,
        cx = L(lx, stg.clientWidth / 2, f1);
      sun.style.top = y + "%"; sun.style.left = cx + "px";
      sun.style.transform = `translate(-50%,-50%) scale(${1 + f1 * 5.5})`;
      line.style.opacity = 0.7 * (1 - f1);
      fin.style.top = y + "%"; fin.style.left = cx + "px";
      fin.style.opacity = cl((f1 - 0.5) * 2);
      cards.forEach((c, i) => {
        const f = seg - i,
          o = f < 0 || f > 1 ? 0 : Math.min(f / 0.2, 1, (1 - f) / 0.2);
        c.style.top = y + "%"; c.style.opacity = o;
        c.style.transform = `translateY(calc(-50% + ${(1 - o) * 18}px))`;
      });
    }
    addEventListener("scroll", upd, { passive: true });
    addEventListener("resize", upd);
    upd();
    return () => {
      removeEventListener("scroll", upd);
      removeEventListener("resize", upd);
    };
  }, []);

  return (
    <section id="education" aria-label="Education" ref={secRef}>
      <div className="stage" ref={stgRef}>
        <h2 className="eh">Education</h2>
        <div id="eline" ref={lineRef}></div>
        <div id="sun" ref={sunRef}></div>
        <div id="fin" ref={finRef}>Always shine brightly like the Sun</div>
        {items.map((it) => (
          <article className="ec" key={it.h}>
            <div className="dt">{it.dt}</div>
            <h3>{it.h}</h3>
            <p>{it.p}</p>
            <div className="bd"><span>{it.e}</span></div>
          </article>
        ))}
      </div>
    </section>
  );
}
