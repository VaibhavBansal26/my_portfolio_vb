"use client";
import { motion, useReducedMotion } from "framer-motion";

/**
 * FRIDAY · HUD section boundary — a reactor-cyan line draws across,
 * with a mono telemetry label, as the user crosses into a new section.
 */
export default function SectionDivider({ index, label }: { index: string; label: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="max-w-6xl mx-auto px-6 py-2" aria-hidden="true">
      <div style={{ position: "relative", height: 24, display: "flex", alignItems: "center" }}>
        <motion.div
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute", left: 0, right: 0, height: 1, transformOrigin: "left",
            background: "linear-gradient(to right, var(--reactor-dim), var(--hud-line), transparent)",
          }}
        />
        <motion.span
          initial={reduce ? false : { opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="font-mono"
          style={{
            position: "relative", fontSize: 9, letterSpacing: "0.3em",
            textTransform: "uppercase", color: "var(--reactor-dim)",
            background: "var(--bg)", paddingRight: 14,
          }}
        >
          ▸ SEC {index} — {label} · LOADED
        </motion.span>
      </div>
    </div>
  );
}
