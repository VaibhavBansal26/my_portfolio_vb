"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const TICKER = "★ VAIBHAV BANSAL  ·  SOFTWARE ENGINEER  ·  AI ENGINEER  ·  UNITED STATES  ·  TIMES SQUARE NYC 2024  ·  AI ENGINEER FOR HIRE  ·  EX-WIPRO  ·  ";

const CODE_LINES = [
  { text: "$ deploy", color: "#e8a838", parts: [
    { t:"$ ", c:"#7a7265" }, { t:"deploy", c:"#e8a838" },
    { t:" --target=", c:"#7a7265" }, { t:"timessquare", c:"#98c379" },
    { t:" --city=", c:"#7a7265" }, { t:"nyc", c:"#98c379" },
  ]},
  { text: "", color: "" },
  { text: "✓ Connecting to NYC grid...", color: "#555", parts: [
    { t:"✓ ", c:"rgba(232,168,56,.4)" }, { t:"Connecting to NYC grid...", c:"#555" }
  ]},
  { text: "✓ Billboard slot acquired", color: "#e8a838", parts: [
    { t:"✓ ", c:"rgba(232,168,56,.6)" }, { t:"Billboard slot ", c:"rgba(232,168,56,.5)" }, { t:"acquired", c:"#f0ece4" }
  ]},
  { text: "✓ Engineer  Vaibhav Bansal", color: "#e8a838", parts: [
    { t:"✓ ", c:"rgba(232,168,56,.6)" }, { t:"Engineer  ", c:"rgba(232,168,56,.5)" }, { t:"Vaibhav Bansal", c:"#f0ece4", bold:true }
  ]},
  { text: "✓ Location  Times Square, NYC", color: "#e8a838", parts: [
    { t:"✓ ", c:"rgba(232,168,56,.6)" }, { t:"Location  ", c:"rgba(232,168,56,.5)" }, { t:"Times Square, NYC", c:"#f0ece4", bold:true }
  ]},
  { text: "", color: "" },
  { text: "★ DEPLOYED · 2024", color: "#e8a838", star: true },
];

function CodeLine({ line, delay, inView }: { line: typeof CODE_LINES[0]; delay: number; inView: boolean }) {
  const parts = (line as any).parts as {t:string;c:string;bold?:boolean}[] | undefined;
  const isStar = (line as any).star as boolean | undefined;
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.3, ease: "easeOut" }}
      style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, lineHeight: "28px", minHeight: line.text ? undefined : 10 }}>
      {isStar ? (
        <span style={{ color: "#e8a838", fontWeight: 800, letterSpacing: ".06em",
          textShadow: "0 0 12px rgba(232,168,56,.5)" }}>{line.text}</span>
      ) : parts ? (
        parts.map((p,i) => (
          <span key={i} style={{ color: p.c, fontWeight: p.bold ? 700 : 400 }}>{p.t}</span>
        ))
      ) : (
        <span style={{ color: line.color }}>{line.text}</span>
      )}
    </motion.div>
  );
}

export default function TimesSquareSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: .1 });
  const [ticker, setTicker] = useState(0);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanPos, setScanPos] = useState(20);
  const [scanDir, setScanDir] = useState(1);
  const [mouse, setMouse] = useState({ x: .5, y: .5 });

  useEffect(() => {
    const t = setInterval(() => setTicker(p => p - .5), 16);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setScanPos(p => {
        const n = p + scanDir * .8;
        if (n > 85 || n < 10) setScanDir(d => -d);
        return Math.max(10, Math.min(85, n));
      });
    }, 16);
    return () => clearInterval(t);
  }, [scanDir]);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  };

  const toggleSound = () => {
    if (videoRef.current) { videoRef.current.muted = !videoRef.current.muted; setMuted(m => !m); }
  };

  const dx = mouse.x - .5, dy = mouse.y - .5;

  return (
    <section ref={ref} onMouseMove={onMouseMove}
      className="py-20 relative overflow-hidden"
      style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>

      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 65% 50%,rgba(232,168,56,.06) 0%,transparent 60%)" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(232,168,56,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(232,168,56,.02) 1px,transparent 1px)", backgroundSize: "56px 56px" }} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: .5 }}>
            <span className="section-label">NYC Moment</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: .6, delay: .1 }} className="font-display font-extrabold mt-2"
            style={{ fontSize: "clamp(2rem,4vw,3.2rem)" }}>
            My Work on the{" "}
            <span style={{ background: "linear-gradient(120deg,#e8a838,#f4c96a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Big Screen
            </span>
          </motion.h2>
        </div>

        {/* Two columns */}
        <div style={{ display: "flex", flexDirection: "row", gap: 52, alignItems: "flex-start", width: "100%" }}>

          {/* LEFT */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: .6, delay: .2 }}
            style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Terminal — styled to match the reference screenshot */}
            <div style={{ background: "#080808", border: "1px solid #1e1e1e", position: "relative", overflow: "hidden" }}>
              {/* Title bar */}
              <div style={{ padding: "10px 14px", borderBottom: "1px solid #111", display: "flex", gap: 6, alignItems: "center", background: "#0a0a0a" }}>
                {["#ff5f57", "#febc2e", "#28c840"].map(c => (
                  <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
                ))}
                <span style={{ marginLeft: 10, fontSize: 9, color: "#555", fontFamily: "'JetBrains Mono',monospace", letterSpacing: ".05em" }}>
                  deploy.sh — bash
                </span>
                {/* Right side label */}
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 8, color: "rgba(232,168,56,.4)", fontFamily: "'JetBrains Mono',monospace" }}>OPTION D</span>
                  <motion.div animate={{ opacity: [1, .3, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
                    style={{ width: 5, height: 5, borderRadius: "50%", background: "#e8a838" }} />
                </div>
              </div>

              {/* Code body */}
              <div style={{ padding: "18px 20px", paddingBottom: 22 }}>
                {CODE_LINES.map((line, i) => (
                  <CodeLine key={i} line={line} delay={.5 + i * .13} inView={inView} />
                ))}
                <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}
                  style={{ display: "inline-block", width: 8, height: 14, background: "#e8a838", verticalAlign: "text-bottom", marginTop: 4 }} />
              </div>

              {/* Corner accents */}
              <div style={{ position: "absolute", top: -1, left: -1, width: 14, height: 14, borderTop: "2px solid #e8a838", borderLeft: "2px solid #e8a838" }} />
              <div style={{ position: "absolute", bottom: -1, right: -1, width: 14, height: 14, borderBottom: "2px solid #e8a838", borderRight: "2px solid #e8a838" }} />
            </div>

            {/* Stats 2×2 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Featured at", value: "Times Square" },
                { label: "Location", value: "Manhattan, NYC" },
                { label: "Year", value: "2024" },
                { label: "Type", value: "Digital Billboard" },
              ].map(({ label, value }, i) => (
                <motion.div key={label}
                  initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: .9 + i * .09 }}
                  style={{ border: "1px solid var(--border)", padding: "12px 14px", position: "relative", background: "var(--surface)" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 2, background: "#e8a838" }} />
                  <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 7, color: "var(--text-muted)", letterSpacing: ".2em", textTransform: "uppercase", margin: "0 0 4px 10px" }}>{label}</p>
                  <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: "var(--text)", margin: "0 0 0 10px" }}>{value}</p>
                </motion.div>
              ))}
            </div>

            {/* Ticker */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", overflow: "hidden", padding: "8px 0" }}>
              <div style={{ display: "flex", alignItems: "center", paddingLeft: 12, marginBottom: 4, gap: 6 }}>
                <motion.div animate={{ opacity: [1, .2, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                  style={{ width: 5, height: 5, borderRadius: "50%", background: "#e8a838", boxShadow: "0 0 6px #e8a838" }} />
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 7, color: "var(--text-muted)", letterSpacing: ".15em" }}>LIVE</span>
              </div>
              <div style={{ overflow: "hidden" }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#e8a838", letterSpacing: ".08em", display: "inline-block", whiteSpace: "nowrap", transform: `translateX(${ticker % -650}px)` }}>
                  {TICKER}{TICKER}{TICKER}
                </span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — bigger phone, clear video */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: .6, delay: .3 }}
            style={{ flexShrink: 0, width: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>

            <div style={{ position: "relative", width: 300, height: 520 }}>
              {/* Dashed orbit ring — back layer parallax */}
              <div style={{ position: "absolute", inset: -28, borderRadius: 42, border: "1px dashed rgba(232,168,56,.2)", pointerEvents: "none", transform: `translate(${dx * 26}px,${dy * 18}px)`, transition: "transform .12s ease-out" }} />

              {/* Spinning conic ring */}
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                style={{ position: "absolute", inset: -10, borderRadius: 30, padding: 2, background: "conic-gradient(from 0deg,#e8a838,transparent 30%,#b87d20 55%,transparent 80%,#e8a838)" }}>
                <div style={{ width: "100%", height: "100%", borderRadius: 28, background: "var(--bg)" }} />
              </motion.div>

              {/* Phone mid layer */}
              <div style={{ position: "absolute", inset: 0, transform: `translate(${dx * 16}px,${dy * 11}px)`, transition: "transform .15s ease-out" }}>
                {/* Pulsing glow */}
                <motion.div animate={{ opacity: [.3, .7, .3], scale: [1, 1.02, 1] }} transition={{ duration: 3, repeat: Infinity }}
                  style={{ position: "absolute", inset: -4, borderRadius: 28, border: "1.5px solid rgba(232,168,56,.5)", boxShadow: "0 0 40px rgba(232,168,56,.2)" }} />

                {/* Phone body — bigger: 270×500 */}
                <div style={{ width: 268, height: 490, background: "#050505", borderRadius: 26, border: "2.5px solid #e8a838", overflow: "hidden", boxShadow: "0 0 80px rgba(232,168,56,.3), 0 40px 100px rgba(0,0,0,.9)" }}>
                  {/* Notch */}
                  <div style={{ height: 11, background: "#030303", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 52, height: 4, background: "#111", borderRadius: 2 }} />
                  </div>
                  {/* Video — clear, no blur */}
                  <div style={{ position: "relative", height: 452, overflow: "hidden", background: "#000" }}>
                    <video ref={videoRef}
                      src="https://res.cloudinary.com/vaibhav-codexpress/video/upload/v1717225096/VaibhavBansal_TimeSquare_h3gbbc.mp4"
                      autoPlay muted loop playsInline
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", imageRendering: "crisp-edges" }} />
                    {/* Scan sweep */}
                    <div style={{ position: "absolute", left: 0, right: 0, height: 1.5, top: `${scanPos}%`, background: "linear-gradient(to right,transparent,rgba(232,168,56,.5),transparent)", pointerEvents: "none", zIndex: 3 }} />

                    {/* Corner brackets */}
                    {[{ top: 8, left: 8 }, { top: 8, right: 8 }, { bottom: 8, left: 8 }, { bottom: 8, right: 8 }].map((pos, i) => (
                      <div key={i} style={{ position: "absolute", width: 14, height: 14, ...pos, zIndex: 4, borderTop: i < 2 ? "1.5px solid rgba(232,168,56,.6)" : undefined, borderBottom: i >= 2 ? "1.5px solid rgba(232,168,56,.6)" : undefined, borderLeft: i % 2 === 0 ? "1.5px solid rgba(232,168,56,.6)" : undefined, borderRight: i % 2 === 1 ? "1.5px solid rgba(232,168,56,.6)" : undefined }} />
                    ))}
                  </div>
                  {/* Home bar */}
                  <div style={{ height: 27, background: "#030303", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 60, height: 3, background: "#1a1a1a", borderRadius: 2 }} />
                  </div>
                </div>
              </div>

              {/* Badges front layer */}
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10, transform: `translate(${dx * 6}px,${dy * 4}px)`, transition: "transform .18s ease-out" }}>
                <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#e8a838", color: "#0e0e0e", fontFamily: "'JetBrains Mono',monospace", fontSize: 7, fontWeight: 800, padding: "3px 14px", letterSpacing: ".15em", whiteSpace: "nowrap", boxShadow: "0 0 14px rgba(232,168,56,.5)" }}>
                  NYC 2024
                </div>
                <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .8 }}
                  style={{ position: "absolute", right: -20, top: 60, background: "rgba(10,10,10,.95)", border: "1px solid rgba(232,168,56,.5)", padding: "8px 12px", fontFamily: "'JetBrains Mono',monospace" }}>
                  <p style={{ fontSize: 9, color: "#e8a838", marginBottom: 2 }}>AI Engineer</p>
                  <p style={{ fontSize: 8, color: "#7a7265" }}>5+ Years Exp</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }}
                  style={{ position: "absolute", left: -20, bottom: 80, background: "rgba(10,10,10,.95)", border: "1px solid rgba(232,168,56,.5)", padding: "8px 12px", fontFamily: "'JetBrains Mono',monospace" }}>
                  <p style={{ fontSize: 9, color: "#e8a838", marginBottom: 2 }}>SUNY Buffalo</p>
                  <p style={{ fontSize: 8, color: "#7a7265" }}>M.S. Data Science</p>
                </motion.div>
              </div>
            </div>

            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
              onClick={toggleSound} whileHover={{ scale: 1.04 }} whileTap={{ scale: .96 }}
              style={{ background: "transparent", border: "1px solid rgba(232,168,56,.35)", color: "#e8a838", fontFamily: "'JetBrains Mono',monospace", fontSize: 9, padding: "8px 22px", cursor: "pointer", letterSpacing: ".15em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}>
              {muted ? "🔇 Enable Sound" : "🔊 Mute"}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
