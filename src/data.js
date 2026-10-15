/* ===== Edit your content here ===== */
export const NAME = "Divyansh Gupta";          // <- put your real name here (also drives the intro animation)
export const EMAIL = "you@example.com";   // <- your email (used by the contact form + link)

export const roles = ["web apps", "clean interfaces", "useful tools", "things that ship"];

export const exp = [
  {
    t: "Senior Coordinator",
    o: "Training and Placement Cell, IIIT Nagpur",
    d: "Add dates",
    p: "Coordinate training and placement drives between students, recruiters and faculty, handling scheduling, communication and logistics.",
  },
  {
    t: "Web Developer Member",
    o: "Elevate",
    d: "Add dates",
    p: "Build and maintain web features for the Elevate team, working with other members to ship clean, responsive interfaces.",
  },
];

export const projects = [
  {
    n: "Civic Seva",
    y: "2026",
    c: "Full stack",
    p: "Civic Seva is a web-based platform designed to help citizens report civic issues such as potholes, garbage, water leakage, and streetlight failures. It enables users to submit complaints, track their status, and improve communication between citizens and local authorities.",
    tags: "React, Node.js,Express, MongoDB",
    live: "#",
    gh: "#",
  },
  {
    n: "Pramman AI",
    y: "2026",
    c: "AI",
    p: "Pramaan AI is an AI-powered platform designed to simplify document verification and authenticity checking. It helps users analyze documents, identify potential fraud or manipulation, and improve the reliability of digital verification using AI technologies.",
    tags: "AI, Python, React ,Node.js,MongoDB",
    live: "#",
    gh: "#",
  },
];

export const skills = {
  Languages: ["C++", "Java", "JavaScript"],
  Frontend: ["React", "Tailwind CSS",  "GSAP"],
  Backend: ["Node.js", "Express", "FastAPI"],
  Databases: ["MongoDB",  "MySQL"],
  Tools: ["Git", "GitHub", "Vercel"],
};

export const certs = [
  { t: "Hackathon finalist", p: "Top 100 of 1000+ teams. Describe what you built.", l: "#" },
  { t: "Data analytics simulation", p: "Short line on what you learned.", l: "#" },
  { t: "SQL intermediate", p: "Joins, unions and subqueries.", l: "#" },
];

export const RM =
  typeof matchMedia !== "undefined" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;

/* how long the name intro plays before the hero animates in */
export const INTRO_MS = RM ? 0 : (0.25 + NAME.length * 0.09 + 0.6 + 0.7) * 1000 + 300;
