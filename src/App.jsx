import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NAME, EMAIL, RM, INTRO_MS, roles, exp, projects, skills, certs } from "./data";
import Chips from "./components/Chips.jsx";
import Intro from "./components/Intro.jsx";
import Sky from "./components/Sky.jsx";
import Education from "./components/Education.jsx";

gsap.registerPlugin(ScrollTrigger);

const projCats = ["All", ...new Set(projects.map((p) => p.c))];
const skillCats = ["All", ...Object.keys(skills)];

export default function App() {
  const heroRef = useRef(null);
  const resumeRef = useRef(null);
  const [roleIdx, setRoleIdx] = useState(0);
  const [pf, setPf] = useState("All");
  const [sf, setSf] = useState("All");
  const [msg, setMsg] = useState("");

  /* role rotator */
  useEffect(() => {
    if (RM) return;
    const id = setInterval(() => setRoleIdx((i) => (i + 1) % roles.length), 2200);
    return () => clearInterval(id);
  }, []);

  /* GSAP: progress bar, hero intro, count-up, parallax, scroll reveals */
  useEffect(() => {
    if (RM) return;
    const ctx = gsap.context(() => {
      gsap.to("#bar", { scaleX: 1, ease: "none", scrollTrigger: { scrub: 0.2, start: 0, end: "max" } });

      gsap
        .timeline({ delay: INTRO_MS / 1000, defaults: { ease: "power3.out" } })
        .from(".status", { opacity: 0, y: 12, duration: 0.5 })
        .from(".ch", { opacity: 0, yPercent: 80, rotate: 6, stagger: 0.04, duration: 0.7 }, "-=.2")
        .from(".role,.lead", { opacity: 0, y: 16, stagger: 0.1, duration: 0.5 }, "-=.3")
        .from(".btns .btn", { opacity: 0, y: 14, stagger: 0.08, duration: 0.4 }, "-=.2")
        .from(".stats div", { opacity: 0, y: 20, stagger: 0.1, duration: 0.5 }, "-=.2");

      document.querySelectorAll(".stats strong").forEach((el) => {
        const v = parseInt(el.textContent), s = el.textContent.replace(/[0-9]/g, ""), o = { n: 0 };
        gsap.to(o, {
          n: v, duration: 1.4, delay: INTRO_MS / 1000 + 0.9, ease: "power2.out",
          onUpdate: () => (el.textContent = Math.round(o.n) + s),
        });
      });

      gsap.to(".hero .wrap", {
        yPercent: -8, ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
      });

      gsap.utils.toArray("section h2").forEach((el) =>
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%" },
          opacity: 0, x: -30, duration: 0.7, ease: "power3.out",
        })
      );

      const rv = ".about p,.tl li,.cert";
      gsap.set(rv, { opacity: 0, y: 30 });
      ScrollTrigger.batch(rv, {
        start: "top 90%", once: true,
        onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, stagger: 0.12, duration: 0.6, ease: "power3.out" }),
      });
    });
    return () => ctx.revert();
  }, []);

  /* project list re-animates when the filter changes */
  useEffect(() => {
    if (RM) return;
    const t = gsap.from("#pl li", { opacity: 0, y: 18, stagger: 0.06, duration: 0.45, clearProps: "all" });
    return () => t.kill();
  }, [pf]);

  /* blueprint grid follows pointer */
  const onHeroMove = (e) => {
    const hero = heroRef.current, r = hero.getBoundingClientRect();
    hero.style.setProperty("--mx", e.clientX - r.left + "px");
    hero.style.setProperty("--my", e.clientY - r.top + "px");
  };

  /* contact form opens the visitor's email app (no backend needed) */
  const onSubmit = (e) => {
    e.preventDefault();
    const d = new FormData(e.target);
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Portfolio message from " + d.get("n"))}&body=${encodeURIComponent(d.get("m") + "\n\n" + d.get("e"))}`;
    setMsg(`Opening your email app. If nothing happens, write to ${EMAIL}.`);
  };

  const shownProjects = projects.filter((p) => pf === "All" || p.c === pf);
  const shownSkills = sf === "All" ? Object.values(skills).flat() : skills[sf];

  return (
    <>
      <Sky />
      <Intro />
      {!RM && <div id="bar"></div>}

      <header className="nav">
        <div className="wrap">
          <a className="logo" href="#top">{NAME}</a>
          <a className="l" href="#about">About</a>
          <a className="l" href="#education">Education</a>
          <a className="l" href="#experience">Experience</a>
          <a className="l" href="#projects">Projects</a>
          <a className="l" href="#skills">Skills</a>
          <a className="l" href="#contact">Contact</a>
        </div>
      </header>

      <main id="top">
        <div className="hero" id="hero" ref={heroRef} onPointerMove={onHeroMove}>
          <div className="wrap">
            <span className="status"><i></i>Open to internships and full-time roles</span>
            <h1 aria-label={NAME}>
              {RM
                ? NAME
                : [...NAME].map((c, i) => (
                    <span className="ch" aria-hidden="true" key={i}>{c === " " ? "\u00a0" : c}</span>
                  ))}
            </h1>
            <div className="role" aria-live="polite">I build <b id="rot">{roles[roleIdx]}</b></div>
            <p className="lead">Computer science student who likes turning rough ideas into fast, accessible products. Replace this line with one sentence about what you build and who it helps.</p>
            <div className="btns">
              <a className="btn p" href="#projects">See my projects</a>
              <a className="btn" href="#contact">Get in touch</a>
              <button className="btn" id="resumeBtn" onClick={() => resumeRef.current.showModal()}>View resume</button>
            </div>
            <div className="stats">
              <div><strong>3+</strong><span>Years coding</span></div>
              <div><strong>4</strong><span>Projects shipped</span></div>
              <div><strong>0</strong><span>Internships</span></div>
            </div>
          </div>
        </div>

        <section id="about"><div className="wrap">
          <h2>About me</h2>
          <div className="about">
            <p>I'm a student developer who learns by shipping. I enjoy the full path from a blank file to a deployed site, with extra care for performance and accessibility.</p>
            <p>Outside code I tinker with electronics, enter hackathons and write notes on what I learn. Swap this paragraph for your own story.</p>
          </div>
        </div></section>

        <Education />

        <section id="experience"><div className="wrap">
          <h2>Experience</h2>
          <ol className="tl" id="exp">
            {exp.map((e) => (
              <li key={e.t + e.o}>
                <h3>{e.t}, {e.o}</h3>
                <div className="when">{e.d}</div>
                <p>{e.p}</p>
              </li>
            ))}
          </ol>
        </div></section>

        <section id="projects"><div className="wrap">
          <h2>Projects</h2>
          <Chips id="pf" label="Filter projects" items={projCats} active={pf} onPick={setPf} />
          <ul className="proj" id="pl">
            {shownProjects.map((p) => (
              <li key={p.n}>
                <span className="yr">{p.y}</span>
                <div><h3>{p.n}</h3><p>{p.p}</p><div className="tags">{p.tags}</div></div>
                <span className="lnk">
                  {p.live ? <a href={p.live}>Live site</a> : null}
                  <a href={p.gh}>GitHub</a>
                </span>
              </li>
            ))}
          </ul>
        </div></section>

        <section id="skills"><div className="wrap">
          <h2>Skills</h2>
          <Chips id="sf" label="Filter skills" items={skillCats} active={sf} onPick={setSf} />
          <div className="skills" id="sl">
            {shownSkills.map((s) => <span className="skill" key={s}>{s}</span>)}
          </div>
        </div></section>

        <section id="certs"><div className="wrap">
          <h2>Certifications and wins</h2>
          <div className="certs" id="cl">
            {certs.map((c) => (
              <div className="cert" key={c.t}>
                <h3>{c.t}</h3><p>{c.p}</p><a href={c.l}>View credential</a>
              </div>
            ))}
          </div>
        </div></section>

        <section id="contact"><div className="wrap">
          <h2>Let's work together</h2>
          <div className="contact">
            <div>
              <p>Have a role, project or question? Send a message and I'll reply within two days.</p>
              <ul className="links">
                <li><a href="https://github.com/">GitHub</a></li>
                <li><a href="https://linkedin.com/">LinkedIn</a></li>
                <li><a href="https://leetcode.com/">LeetCode</a></li>
                <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              </ul>
            </div>
            <form id="f" onSubmit={onSubmit}>
              <label>Name<input name="n" required autoComplete="name" /></label>
              <label>Email<input name="e" type="email" required autoComplete="email" /></label>
              <label>Message<textarea name="m" required></textarea></label>
              <button className="btn p" type="submit">Send message</button>
              <p id="msg" role="status">{msg}</p>
            </form>
          </div>
        </div></section>
      </main>


      <dialog
        id="resume"
        ref={resumeRef}
        style={{ border: "1px solid var(--line)", borderRadius: 12, background: "var(--panel)", color: "var(--ink)", maxWidth: 420 }}
      >


        <form method="dialog"><button className="btn p">Close</button></form>
      </dialog>
    </>
  );
}
