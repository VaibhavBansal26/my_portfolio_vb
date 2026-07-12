"use client";

/**
 * EditorialHome — the complete homepage redesign shown when the
 * "Swiss Editorial" atmosphere is active. Not a restyle: a different
 * page built on the scroll-expansion hero + framer-motion choreography.
 * International style: one column, hairlines, indexed lists, one red.
 */

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { FiArrowUpRight, FiArrowRight, FiArrowDown } from "react-icons/fi";
import { projects, stats } from "@/data/portfolio";

const RED = "#e2261f";
const EASE = [0.22, 1, 0.36, 1] as const;

const MANIFESTO = [
  "I design and ship",
  "intelligent systems —",
  "LLMs, RAG pipelines,",
  "full-stack products.",
];

const CAPABILITIES = [
  {
    index: "A",
    title: "AI Engineering",
    items: ["LLM applications", "RAG pipelines", "LangChain · Agents", "MLOps · Evaluation"],
  },
  {
    index: "B",
    title: "Full-Stack",
    items: ["React · Next.js", "Python · FastAPI", "Node.js · TypeScript", "Design systems"],
  },
  {
    index: "C",
    title: "Data & Cloud",
    items: ["AWS · Azure", "Spark · Kafka", "Snowflake · Airflow", "CI/CD · Docker"],
  },
];

/* Per-line masked rise — the editorial reveal. The observer sits on the
   outer (never-clipped) wrapper; the inner span animates via variants,
   because a fully-clipped element never intersects and would stay hidden. */
function RevealLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <span style={{ display: "block" }}>{children}</span>;
  return (
    <motion.span
      style={{ display: "block", overflow: "hidden" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.span
        style={{ display: "block" }}
        variants={{ hidden: { y: "110%" }, visible: { y: 0 } }}
        transition={{ duration: 0.7, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

function WorkIndex() {
  const reduce = useReducedMotion();
  const featured = projects.filter((p) => p.featured).slice(0, 6);
  return (
    <section style={{ borderTop: "1px solid var(--border-bright)" }}>
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 48 }}>
          <RevealLine>
            <span className="font-mono text-[10px] uppercase" style={{ letterSpacing: ".42em", color: RED }}>
              Index — Selected Work
            </span>
          </RevealLine>
          <span className="font-mono text-[10px]" style={{ color: "var(--text-muted)", letterSpacing: ".2em" }}>
            ({featured.length})
          </span>
        </div>

        <div>
          {featured.map((p, i) => (
            <motion.div
              key={p.id}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
            >
              <Link href={`/projects/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <motion.div
                  className="group"
                  whileHover="hover"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(48px,80px) 1fr auto",
                    alignItems: "baseline",
                    gap: 24,
                    padding: "28px 0",
                    borderBottom: "1px solid var(--border-bright)",
                    cursor: "pointer",
                  }}
                >
                  <span className="font-mono" style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 16, minWidth: 0 }}>
                    <motion.h3
                      className="font-display"
                      variants={{ hover: { x: reduce ? 0 : 14 } }}
                      transition={{ duration: 0.25, ease: EASE }}
                      style={{
                        fontSize: "clamp(1.4rem,3.4vw,2.6rem)",
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.05,
                      }}
                    >
                      {p.title}
                    </motion.h3>
                    <motion.span
                      aria-hidden
                      variants={{ hover: { opacity: 1, x: 0 } }}
                      initial={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.25 }}
                      style={{ color: RED, flexShrink: 0 }}
                    >
                      <FiArrowUpRight size={22} />
                    </motion.span>
                  </div>
                  <div className="font-mono text-[10px] uppercase hidden sm:block" style={{ color: "var(--text-muted)", letterSpacing: ".18em", textAlign: "right" }}>
                    {p.category} · {p.year}
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: 40 }}>
          <Link
            href="/portfolio"
            className="font-mono text-[11px] uppercase inline-flex items-center gap-2 hover-underline"
            style={{ color: RED, letterSpacing: ".24em", textDecoration: "none" }}
          >
            Full archive <FiArrowRight aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Capabilities() {
  const reduce = useReducedMotion();
  return (
    <section style={{ borderTop: "1px solid var(--border-bright)" }}>
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <RevealLine>
          <span className="font-mono text-[10px] uppercase" style={{ letterSpacing: ".42em", color: RED }}>
            Capabilities
          </span>
        </RevealLine>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 0,
            marginTop: 48,
            borderLeft: "1px solid var(--border-bright)",
          }}
        >
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.index}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
              style={{ borderRight: "1px solid var(--border-bright)", padding: "32px 28px 40px" }}
            >
              <div className="font-mono" style={{ fontSize: 11, color: RED, marginBottom: 20 }}>
                ({cap.index})
              </div>
              <h3 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 18 }}>
                {cap.title}
              </h3>
              <ul style={{ listStyle: "none", display: "grid", gap: 8 }}>
                {cap.items.map((item) => (
                  <li key={item} className="font-mono text-[11px]" style={{ color: "var(--text-muted)", letterSpacing: ".06em" }}>
                    — {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsStrip() {
  const reduce = useReducedMotion();
  return (
    <section style={{ borderTop: "1px solid var(--border-bright)" }}>
      <div
        className="max-w-6xl mx-auto px-6"
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}
      >
        {stats.map((s: { label: string; value: number }, i: number) => (
          <motion.div
            key={s.label}
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            style={{ padding: "40px 0", borderRight: i < stats.length - 1 ? "1px solid var(--border-bright)" : "none", paddingLeft: i === 0 ? 0 : 28 }}
          >
            <div className="font-display" style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 800, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>
              {s.value}+
            </div>
            <div className="font-mono text-[10px] uppercase" style={{ color: "var(--text-muted)", letterSpacing: ".22em", marginTop: 6 }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* Rotating circular text badge — classic editorial device, pure SVG */
function OrbitBadge() {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 120 120"
      width={128}
      height={128}
      aria-hidden
      animate={reduce ? undefined : { rotate: 360 }}
      transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      style={{ display: "block" }}
    >
      <defs>
        <path id="orbit-path" d="M 60,60 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="none" stroke="var(--border-bright)" strokeWidth="1" />
      <circle cx="60" cy="60" r="4" fill={RED} />
      <text style={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "var(--text)" }}>
        {/* textLength pins the ring text to the exact circumference so the
            start and end never overlap */}
        <textPath href="#orbit-path" textLength={287} lengthAdjust="spacingAndGlyphs">
          AI ENGINEER · FULL-STACK · NEW YORK ·
        </textPath>
      </text>
    </motion.svg>
  );
}

/* Poster hero — typographic, original; no photography */
function PosterHero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yName = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const yMeta = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -30]);

  return (
    <section ref={ref} style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Top meta rule */}
      <div className="max-w-6xl mx-auto px-6 w-full" style={{ paddingTop: 110 }}>
        <motion.div
          style={{ y: yMeta, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-bright)", paddingBottom: 14 }}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="font-mono text-[10px] uppercase" style={{ letterSpacing: ".42em" }}>
            Portfolio — N°5
          </span>
          <span className="font-mono text-[10px] uppercase" style={{ letterSpacing: ".42em", color: RED }}>
            Open to opportunities
          </span>
          <span className="font-mono text-[10px] uppercase hidden sm:inline" style={{ letterSpacing: ".42em" }}>
            New York, US
          </span>
        </motion.div>
      </div>

      {/* Name — the poster */}
      <div className="max-w-6xl mx-auto px-6 w-full" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
        <motion.h1
          className="font-display"
          style={{ y: yName, fontSize: "clamp(3.4rem,13vw,11rem)", fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.92, textTransform: "uppercase" }}
        >
          <RevealLine>Vaibhav</RevealLine>
          <RevealLine delay={0.09}>
            <span
              style={{
                WebkitTextStroke: "2px var(--text)",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              Bansal
            </span>
            <span style={{ color: RED }}>.</span>
          </RevealLine>
        </motion.h1>

        {/* Orbit badge anchored to the composition, not the viewport edge */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          className="hidden md:block"
          style={{ position: "absolute", right: 24, top: "18%" }}
        >
          <OrbitBadge />
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 28, marginTop: 40 }}
        >
          <p className="font-mono text-[11px]" style={{ maxWidth: 420, lineHeight: 1.8, letterSpacing: ".04em", color: "var(--text-muted)" }}>
            Engineer of intelligent systems. LLMs, RAG pipelines and full-stack
            products — designed, shipped and running in production for 5+ years.
          </p>
          <Link
            href="/portfolio"
            className="font-mono text-[10px] uppercase"
            style={{
              padding: "14px 26px",
              background: "var(--text)",
              color: "var(--bg)",
              letterSpacing: ".24em",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            View work <FiArrowRight aria-hidden />
          </Link>
        </motion.div>
      </div>

      {/* Discipline marquee along the hero's base */}
      <div style={{ borderTop: "1px solid var(--border-bright)", overflow: "hidden", padding: "14px 0" }}>
        <motion.div
          animate={reduce ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          style={{ display: "flex", gap: 0, width: "max-content", willChange: "transform" }}
          aria-hidden
        >
          {[0, 1].map((copy) => (
            <div key={copy} style={{ display: "flex" }}>
              {["LLM Applications", "RAG Pipelines", "Full-Stack Engineering", "Data Platforms", "MLOps", "Design Systems"].map((d) => (
                <span key={d} className="font-mono text-[11px] uppercase" style={{ letterSpacing: ".3em", padding: "0 34px", whiteSpace: "nowrap" }}>
                  {d} <span style={{ color: RED, marginLeft: 34 }}>—</span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        animate={reduce ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", bottom: 64, right: 28, color: RED }}
        className="hidden md:block"
      >
        <FiArrowDown size={18} />
      </motion.div>
    </section>
  );
}

function Manifesto() {
  return (
    <section style={{ borderTop: "1px solid var(--border-bright)" }}>
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <span className="font-mono text-[10px] uppercase" style={{ letterSpacing: ".42em", color: RED }}>
          Manifesto
        </span>
        <h2
          className="font-display"
          style={{ fontSize: "clamp(1.9rem,5vw,4rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.06, marginTop: 24 }}
        >
          {MANIFESTO.map((line, i) => (
            <RevealLine key={line} delay={i * 0.07}>
              {line.includes("—") ? (
                <>
                  {line.replace(" —", "")}
                  <span style={{ color: RED }}> —</span>
                </>
              ) : (
                line
              )}
            </RevealLine>
          ))}
        </h2>
        <p className="font-mono text-[11px]" style={{ color: "var(--text-muted)", marginTop: 32, maxWidth: 480, lineHeight: 1.8, letterSpacing: ".04em" }}>
          5+ years in production. M.S. Data Science, SUNY Buffalo. Previously Wipro &amp; DashClicks. Featured on a Times Square billboard.
        </p>
      </div>
    </section>
  );
}

export default function EditorialHome() {
  return (
    <div>
      <PosterHero />
      <Manifesto />
      <WorkIndex />
      <Capabilities />
      <StatsStrip />
      {/* The global Footer supplies the closing contact CTA */}
    </div>
  );
}
