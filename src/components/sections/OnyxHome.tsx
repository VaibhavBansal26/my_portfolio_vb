"use client";

/**
 * OnyxHome — "Onyx Motion", the immersive homepage. A blend of three
 * languages: a WebGL particle nebula hero, cinematic pinned scenes for
 * the featured work, and an interactive gallery wall for the archive.
 * Mounted only while html.onyx is active; other atmospheres keep their
 * own homepages untouched.
 */

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  animate,
} from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FiArrowUpRight, FiArrowRight, FiFileText, FiExternalLink } from "react-icons/fi";
import { projects, research, stats } from "@/data/portfolio";

const TimesSquareSection = dynamic(() => import("@/components/sections/TimesSquareSection"), { ssr: false });

const VIOLET = "#a78bfa";
const CYAN = "#22d3ee";
const EASE = [0.22, 1, 0.36, 1] as const;
const GRADIENT_TEXT: React.CSSProperties = {
  background: `linear-gradient(92deg, ${VIOLET}, ${CYAN})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

/* ————————————————————————————————— WebGL nebula ————————————————— */

function NebulaPoints({ count = 1600 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const violet = new THREE.Color(VIOLET);
    const cyan = new THREE.Color(CYAN);
    for (let i = 0; i < count; i++) {
      // Flat-ish elliptical cloud with depth
      const r = Math.pow(Math.random(), 0.5) * 11;
      const a = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * r * 1.6;
      pos[i * 3 + 1] = Math.sin(a) * r * 0.9;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 7;
      const c = violet.clone().lerp(cyan, Math.random());
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state) => {
    const p = ref.current;
    if (!p) return;
    const t = state.clock.elapsedTime;
    p.rotation.z = t * 0.02;
    p.rotation.y = THREE.MathUtils.lerp(p.rotation.y, state.pointer.x * 0.35, 0.04);
    p.rotation.x = THREE.MathUtils.lerp(p.rotation.x, -state.pointer.y * 0.25, 0.04);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Nebula() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 9], fov: 55 }}
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: false, powerPreference: "low-power" }}
    >
      <NebulaPoints />
    </Canvas>
  );
}

/* ————————————————————————————————— Hero ————————————————————————— */

function LetterReveal({ text, delay = 0, outline = false }: { text: string; delay?: number; outline?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <span style={{ display: "block", overflow: "hidden", whiteSpace: "nowrap" }}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          initial={reduce ? false : { y: "115%", rotate: 6 }}
          animate={{ y: 0, rotate: 0 }}
          transition={{ duration: 0.7, delay: delay + i * 0.035, ease: EASE }}
          style={{
            display: "inline-block",
            ...(outline
              ? { WebkitTextStroke: "1.5px rgba(242,242,247,.55)", WebkitTextFillColor: "transparent", color: "transparent" }
              : {}),
          }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}

function ImmersiveHero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Each layer moves at a different speed — they peel apart as you scroll
  const fade     = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const labelY   = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -220]);
  const headlineY= useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -140]);
  const taglineY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);
  const ctaY     = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]);

  return (
    <section ref={ref} style={{ height: "100dvh", position: "relative", overflow: "hidden" }}>
      {!reduce && <Nebula />}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(80% 60% at 50% 50%, transparent 30%, rgba(6,6,10,.82) 90%)" }} />

      <motion.div
        style={{ opacity: fade, position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 24px" }}
      >
        {/* Layer 1 — label, fastest */}
        <motion.div
          style={{ y: labelY }}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-mono text-[10px] uppercase"
          aria-label="AI Engineer · New York · Est. 2020"
          role="text"
        >
          <span style={{ letterSpacing: ".5em", color: "var(--text-muted)" }}>
            AI Engineer · New York · Est. 2020
          </span>
        </motion.div>

        {/* Layer 2 — headline, medium speed */}
        <motion.h1
          className="font-display"
          style={{ y: headlineY, fontSize: "clamp(3rem,11vw,9rem)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.04em", textTransform: "uppercase", marginTop: 26 }}
        >
          <LetterReveal text="Vaibhav" delay={0.25} />
          <LetterReveal text="Bansal" delay={0.5} outline />
        </motion.h1>

        {/* Layer 3 — tagline, slower */}
        <motion.p
          style={{ y: taglineY }}
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.7, ease: EASE }}
          className="font-mono text-[12px]"
        >
          <span style={{ color: "var(--text-muted)", display: "block", marginTop: 30, maxWidth: 460, lineHeight: 1.8 }}>
            Building <span style={GRADIENT_TEXT}>intelligent systems</span> that ship —
            LLMs, RAG pipelines and full-stack products, 5+ years in production.
          </span>
        </motion.p>

        {/* Layer 4 — CTAs, slowest (anchored feeling) */}
        <motion.div
          style={{ y: ctaY }}
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.7, ease: EASE }}
        >
          <div style={{ display: "flex", gap: 14, marginTop: 34, flexWrap: "wrap", justifyContent: "center" }}>
            <motion.span whileHover={reduce ? undefined : { scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Link href="/portfolio" className="font-mono text-[10px] uppercase" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 999, background: `linear-gradient(92deg, ${VIOLET}, ${CYAN})`, color: "#06060a", fontWeight: 700, letterSpacing: ".22em", textDecoration: "none" }}>
                Explore work <FiArrowRight aria-hidden />
              </Link>
            </motion.span>
            <motion.span whileHover={reduce ? undefined : { scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Link href="/contact" className="font-mono text-[10px] uppercase" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 999, border: "1px solid var(--border-bright)", color: "var(--text)", letterSpacing: ".22em", textDecoration: "none", background: "rgba(6,6,10,.5)", backdropFilter: "blur(8px)" }}>
                Contact
              </Link>
            </motion.span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        animate={reduce ? undefined : { y: [0, 9, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="font-mono text-[9px] uppercase"
        style={{ position: "absolute", bottom: 24, left: 0, right: 0, textAlign: "center", letterSpacing: ".5em", color: "var(--text-muted)", zIndex: 1 }}
      >
        Scroll to enter
      </motion.div>
    </section>
  );
}

/* ——————————————————————— Featured: cinematic stacked scenes ————— */

function SceneCard({ p, i, total }: { p: (typeof projects)[number]; i: number; total: number }) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  // Exit: next scene slides over, this one recedes
  const { scrollYProgress: exitProg } = useScroll({ target: wrapRef, offset: ["end end", "end start"] });
  const scale = useTransform(exitProg, [0, 1], [1, reduce ? 1 : 0.9]);
  const dim   = useTransform(exitProg, [0, 1], [1, reduce ? 1 : 0.35]);

  // Full journey: drives parallax layers at different speeds
  const { scrollYProgress: journey } = useScroll({ target: wrapRef, offset: ["start end", "end start"] });
  // Image pans upward (slower than scroll = feels "heavy", cinematic)
  const imgY  = useTransform(journey, [0, 1], reduce ? ["0%", "0%"] : ["18%", "-18%"]);
  // Copy drifts at a gentler speed to create depth separation
  const copyY = useTransform(journey, [0, 1], reduce ? ["0%", "0%"] : ["6%", "-6%"]);

  return (
    <div ref={wrapRef} style={{ height: "80dvh", position: "relative" }}>
      <motion.div style={{ scale, opacity: dim, position: "sticky", top: 0, height: "80dvh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div className="max-w-6xl mx-auto px-6 w-full" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 40, alignItems: "center" }}>

          {/* Copy — drifts at medium speed */}
          <motion.div style={{ y: copyY }}>
            <div className="font-mono" style={{ fontSize: 13, marginBottom: 18 }}>
              <span style={{ color: VIOLET }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ color: "var(--text-muted)" }}> / {String(total).padStart(2, "0")} — {p.category}</span>
            </div>
            <h3 className="font-display" style={{ fontSize: "clamp(1.9rem,4vw,3.4rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.02 }}>
              {p.title}
            </h3>
            <p className="font-body" style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.75, marginTop: 18, maxWidth: 480, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {p.description}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
              {p.tech.slice(0, 5).map((t) => (
                <span key={t} className="font-mono text-[10px]" style={{ padding: "5px 13px", borderRadius: 999, border: "1px solid var(--border-bright)", color: "var(--text-muted)" }}>{t}</span>
              ))}
            </div>
            <Link href={`/projects/${p.id}`} className="font-mono text-[10px] uppercase" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 28, letterSpacing: ".24em", textDecoration: "none", ...GRADIENT_TEXT }}>
              Open case study <FiArrowUpRight aria-hidden style={{ color: CYAN }} />
            </Link>
          </motion.div>

          {/* Visual — screenshot pans as you scroll (inner parallax) */}
          <Link href={`/projects/${p.id}`} style={{ textDecoration: "none" }}>
            <motion.div
              whileHover={reduce ? undefined : { rotateX: 4, rotateY: -6, scale: 1.02 }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{ position: "relative", perspective: 900, transformStyle: "preserve-3d", borderRadius: 20, overflow: "hidden", border: "1px solid var(--border-bright)", boxShadow: `0 40px 90px rgba(0,0,0,.55), 0 0 60px rgba(124,58,237,.12)`, cursor: "pointer", background: "#0d0d16" }}
            >
              {/* Clip window — fixed height, image inside is taller and shifts */}
              <div style={{ overflow: "hidden", height: "min(46vh, 420px)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <motion.img
                  src={p.image}
                  alt={p.title}
                  loading={i === 0 ? "eager" : "lazy"}
                  style={{ y: imgY, width: "100%", height: "140%", objectFit: "cover", objectPosition: "top", display: "block" }}
                />
              </div>
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(167,139,250,.14), transparent 45%, rgba(34,211,238,.1))", pointerEvents: "none" }} />
            </motion.div>
          </Link>

        </div>
      </motion.div>
    </div>
  );
}

function FeaturedScenes() {
  const featured = projects.filter((p) => p.featured && p.image).slice(0, 5);
  return (
    <section style={{ position: "relative" }}>
      <div className="max-w-6xl mx-auto px-6" style={{ paddingTop: 40, paddingBottom: 10 }}>
        <span className="font-mono text-[10px] uppercase" style={{ letterSpacing: ".42em", ...GRADIENT_TEXT }}>
          Featured Work — five scenes
        </span>
      </div>
      {featured.map((p, i) => (
        <SceneCard key={p.id} p={p} i={i} total={featured.length} />
      ))}
    </section>
  );
}

/* ————————————————————————— Research spotlight ——————————————————— */

function ResearchSpotlight() {
  const reduce = useReducedMotion();
  const paper = research[0];
  return (
    <section style={{ padding: "110px 0" }}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ position: "relative", borderRadius: 24, padding: 2, background: `linear-gradient(130deg, ${VIOLET}, transparent 40%, ${CYAN})` }}
        >
          <div style={{ borderRadius: 22, background: "rgba(10,10,18,.96)", padding: "clamp(28px,5vw,54px)" }}>
            <div className="font-mono text-[10px] uppercase" style={{ letterSpacing: ".42em", ...GRADIENT_TEXT }}>
              Published Research — Springer Nature
            </div>
            <h3 className="font-display" style={{ fontSize: "clamp(1.5rem,3.2vw,2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, marginTop: 20 }}>
              {paper.title}
            </h3>
            <p className="font-mono text-[11px]" style={{ color: "var(--text-muted)", marginTop: 14, letterSpacing: ".08em" }}>
              {paper.journal} · {paper.volume} · {paper.year} · DOI {paper.doi}
            </p>
            <p className="font-body" style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.8, marginTop: 18, display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {paper.description}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
              {paper.tags.slice(0, 5).map((t) => (
                <span key={t} className="font-mono text-[10px]" style={{ padding: "5px 13px", borderRadius: 999, border: "1px solid var(--border-bright)", color: "var(--text-muted)" }}>{t}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 30, flexWrap: "wrap" }}>
              <a href={paper.url} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] uppercase" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px", borderRadius: 999, background: `linear-gradient(92deg, ${VIOLET}, ${CYAN})`, color: "#06060a", fontWeight: 700, letterSpacing: ".2em", textDecoration: "none" }}>
                <FiExternalLink aria-hidden /> Read paper
              </a>
              <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] uppercase" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px", borderRadius: 999, border: "1px solid var(--border-bright)", color: "var(--text)", letterSpacing: ".2em", textDecoration: "none" }}>
                <FiFileText aria-hidden /> PDF
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ————————————————————————— Gallery wall (archive) ——————————————— */

function GalleryRow({ items, reverse, duration }: { items: (typeof projects)[number][]; reverse: boolean; duration: number }) {
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  return (
    <div style={{ overflow: "hidden" }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <motion.div
        animate={reduce ? undefined : { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", gap: 18, width: "max-content", willChange: "transform", animationPlayState: paused ? "paused" : undefined }}
      >
        {[0, 1].map((copy) =>
          items.map((p) => (
            <Link key={`${copy}-${p.id}`} href={`/projects/${p.id}`} style={{ textDecoration: "none", color: "inherit" }} tabIndex={copy === 1 ? -1 : 0} aria-hidden={copy === 1}>
              <motion.div
                whileHover={reduce ? undefined : { y: -8, scale: 1.02 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{ width: 300, borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)", background: "#0d0d16", cursor: "pointer" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.title} loading="lazy" style={{ width: "100%", height: 160, objectFit: "cover", objectPosition: "top", display: "block", opacity: 0.9 }} />
                <div style={{ padding: "14px 16px" }}>
                  <div className="font-display" style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.25 }}>{p.title}</div>
                  <div className="font-mono text-[9px] uppercase" style={{ color: "var(--text-muted)", letterSpacing: ".18em", marginTop: 6 }}>
                    {p.category} · {p.year}
                  </div>
                </div>
              </motion.div>
            </Link>
          ))
        )}
      </motion.div>
    </div>
  );
}

function GalleryWall() {
  const withImages = projects.filter((p) => p.image);
  const rowA = withImages.slice(0, Math.min(7, withImages.length));
  const rowB = withImages.slice(7, 14).length >= 4 ? withImages.slice(7, 14) : withImages.slice(0, 7).reverse();
  return (
    <section style={{ padding: "40px 0 90px" }}>
      <div className="max-w-6xl mx-auto px-6" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 30 }}>
        <span className="font-mono text-[10px] uppercase" style={{ letterSpacing: ".42em", ...GRADIENT_TEXT }}>
          The Archive — {withImages.length}+ builds
        </span>
        <Link href="/portfolio" className="font-mono text-[10px] uppercase" style={{ color: "var(--text-muted)", letterSpacing: ".2em", textDecoration: "none" }}>
          View all <FiArrowUpRight aria-hidden style={{ display: "inline", verticalAlign: "middle", color: CYAN }} />
        </Link>
      </div>
      <div style={{ display: "grid", gap: 18 }}>
        <GalleryRow items={rowA} reverse={false} duration={48} />
        <GalleryRow items={rowB} reverse duration={56} />
      </div>
    </section>
  );
}

/* ————————————————————————— Animated counters ———————————————————— */

function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reduce) { ref.current.textContent = String(value); return; }
    const controls = animate(0, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => { if (ref.current) ref.current.textContent = String(Math.round(v)); },
    });
    return () => controls.stop();
  }, [inView, value, reduce]);
  return <span ref={ref}>0</span>;
}

function StatsCounters() {
  const reduce = useReducedMotion();
  return (
    <section className="max-w-6xl mx-auto px-6" style={{ paddingBottom: 60 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 18 }}>
        {stats.map((s: { label: string; value: number }, i: number) => (
          <motion.div
            key={s.label}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
            style={{ border: "1px solid var(--border)", borderRadius: 18, padding: "26px 24px", background: "rgba(13,13,22,.55)" }}
          >
            <div className="font-display" style={{ fontSize: "clamp(1.9rem,3.4vw,2.8rem)", fontWeight: 800, ...GRADIENT_TEXT }}>
              <CountUp value={s.value} />+
            </div>
            <div className="font-mono text-[10px] uppercase" style={{ letterSpacing: ".2em", color: "var(--text-muted)", marginTop: 6 }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default function OnyxHome() {
  return (
    <div>
      <ImmersiveHero />
      <FeaturedScenes />
      <ResearchSpotlight />
      <GalleryWall />
      <TimesSquareSection />
      <StatsCounters />
      {/* Global footer supplies the closing contact CTA */}
    </div>
  );
}
