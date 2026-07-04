"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion, useMotionValueEvent } from "framer-motion";
import { HandNote } from "@/components/ui/Scribble";

const VIDEO = "https://res.cloudinary.com/vaibhav-codexpress/video/upload/v1717225096/VaibhavBansal_TimeSquare_h3gbbc.mp4";

/**
 * Times Square — cinematic full-bleed moment.
 * Giant outlined type behind the real billboard footage;
 * the video scales up as you scroll through (media-zoom pattern).
 */
export default function TimesSquareSection() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.88, 1]);
  const typeX = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);
  const [scrub, setScrub] = useState(false);

  /* #6 scroll-scrub — when enabled, scroll position drives the frame */
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const vid = videoRef.current;
    if (!scrub || !vid || !vid.duration || reduce) return;
    const t = Math.max(0, Math.min(1, (v - 0.15) / 0.7)) * vid.duration;
    if (Math.abs(vid.currentTime - t) > 0.06) vid.currentTime = t;
  });

  const toggleScrub = () => {
    const vid = videoRef.current; if (!vid) return;
    setScrub(s => {
      const next = !s;
      if (next) { vid.pause(); } else { vid.play().catch(() => {}); }
      return next;
    });
  };

  const toggleSound = () => {
    const v = videoRef.current; if (!v) return;
    v.muted = !v.muted; setMuted(v.muted);
  };

  return (
    <section ref={ref} className="py-28 relative overflow-hidden">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 mb-4 flex items-end justify-between">
        <div>
          <span className="section-label">NYC Moment</span>
          <h2 className="font-display font-extrabold mt-2" style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)" }}>
            one night on the{" "}
            <span style={{ background: "linear-gradient(120deg,#e8a838,#f4c96a)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              big screen
            </span>
          </h2>
        </div>
        <HandNote rotate={3} size={17} style={{ marginBottom: 8 }}>actually me, actually there ↓</HandNote>
      </div>

      {/* Stage */}
      <div className="relative" style={{ minHeight: "min(86vh, 780px)", display: "flex",
        alignItems: "center", justifyContent: "center" }}>

        {/* Giant outlined type behind the footage */}
        <motion.div aria-hidden className="absolute inset-0 flex flex-col justify-center pointer-events-none select-none"
          style={reduce ? {} : { x: typeX }}>
          {["TIMES", "SQUARE"].map(word => (
            <span key={word} className="font-display font-extrabold"
              style={{ fontSize: "clamp(5rem,17vw,15rem)", lineHeight: .92, whiteSpace: "nowrap",
                color: "transparent", WebkitTextStroke: "1px var(--border-bright)",
                textAlign: word === "TIMES" ? "left" : "right",
                paddingLeft: word === "TIMES" ? "4%" : 0, paddingRight: word === "SQUARE" ? "4%" : 0 }}>
              {word}
            </span>
          ))}
        </motion.div>

        {/* The footage — portrait, scroll-zoom */}
        <motion.div style={reduce ? { position: "relative", zIndex: 2 } : { position: "relative", zIndex: 2, scale }}>
          <div style={{ position: "relative", overflow: "hidden",
            boxShadow: "0 60px 140px rgba(0,0,0,.6)" }}>
            <video ref={videoRef} src={VIDEO} autoPlay muted loop playsInline
              style={{ height: "min(72vh, 660px)", width: "auto", maxWidth: "92vw",
                display: "block", objectFit: "cover" }} />
            {/* Scrub toggle */}
            <button onClick={toggleScrub} aria-label="Toggle scroll scrubbing"
              className="font-mono"
              style={{ position: "absolute", right: 12, bottom: 52, zIndex: 3,
                fontSize: 9, letterSpacing: ".15em", textTransform: "uppercase",
                padding: "8px 16px", cursor: "pointer",
                background: "rgba(5,5,5,.72)", backdropFilter: "blur(8px)",
                border: "1px solid var(--hud-line)", color: scrub ? "var(--accent)" : "var(--reactor)" }}>
              {scrub ? "◉ Scroll-scrub on" : "◎ Scroll-scrub"}
            </button>
            {/* Sound toggle */}
            <button onClick={toggleSound} aria-label={muted ? "Enable sound" : "Mute"}
              className="font-mono"
              style={{ position: "absolute", right: 12, bottom: 12, zIndex: 3,
                fontSize: 9, letterSpacing: ".15em", textTransform: "uppercase",
                padding: "8px 16px", cursor: "pointer",
                background: "rgba(5,5,5,.72)", backdropFilter: "blur(8px)",
                border: "1px solid var(--hud-line)", color: "var(--reactor)" }}>
              {muted ? "● Sound on" : "○ Mute"}
            </button>
            {/* live chip */}
            <div className="font-mono" style={{ position: "absolute", left: 12, top: 12, zIndex: 3,
              display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
              background: "rgba(5,5,5,.72)", backdropFilter: "blur(8px)",
              fontSize: 8, letterSpacing: ".2em", color: "var(--text)" }}>
              <motion.span animate={{ opacity: [1, .2, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff4444", display: "inline-block" }} />
              BILLBOARD FOOTAGE
            </div>
          </div>
        </motion.div>
      </div>

      {/* Metadata rule */}
      <div className="max-w-6xl mx-auto px-6 mt-6">
        <div className="flex flex-wrap gap-x-10 gap-y-2 py-4 font-mono text-[9px] tracking-[.25em] uppercase"
          style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}>
          <span>Manhattan · NYC</span>
          <span>2024</span>
          <span>Digital billboard</span>
          <span style={{ color: "var(--accent)" }}>Featured: Vaibhav Bansal</span>
        </div>
      </div>
    </section>
  );
}
