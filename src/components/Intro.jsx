import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { NAME, RM } from "../data";

export default function Intro() {
  const [gone, setGone] = useState(RM);
  const [go, setGo] = useState(false);
  const cols = 14, rows = 8;
  const n = NAME.length;

  const delays = useMemo(
    () =>
      Array.from({ length: cols * rows }, (_, k) =>
        ((k % cols) * 0.04 + (rows - Math.floor(k / cols)) * 0.05 + Math.random() * 0.08).toFixed(2)
      ),
    []
  );

  useLayoutEffect(() => {
    if (RM) return;
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = ""; };
  }, []);

  useEffect(() => {
    if (RM) return;
    const hold = (0.25 + n * 0.09 + 0.6 + 0.7) * 1000;
    const t1 = setTimeout(() => setGo(true), hold);
    const t2 = setTimeout(() => {
      setGone(true);
      document.documentElement.style.overflow = "";
    }, hold + 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [n]);

  if (gone) return null;

  return (
    <div id="intro" className={go ? "go" : ""} aria-hidden="true">
      <div
        className="cells"
        style={{
          gridTemplateColumns: `repeat(${cols},1fr)`,
          gridTemplateRows: `repeat(${rows},1fr)`,
        }}
      >
        {delays.map((d, k) => (
          <i key={k} style={{ transitionDelay: `${d}s` }} />
        ))}
      </div>
      <div className="nm">
        {[...NAME].map((c, i) => (
          <span className="m" key={i}>
            <span style={{ animationDelay: `${(0.25 + i * 0.09).toFixed(2)}s` }}>
              {c === " " ? "\u00a0" : c}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
