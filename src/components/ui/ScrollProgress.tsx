"use client";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * FRIDAY · Scroll progress — pure motion values, zero React re-renders.
 * Top hairline bar + arc-reactor gauge (bottom-left, desktop).
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  const coreOpacity = useTransform(scrollYProgress, [0, 1], [0.25, 1]);

  return (
    <>
      {/* Top hairline */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 9999 }}>
        <motion.div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, var(--accent), var(--reactor))",
          scaleX, transformOrigin: "left",
        }} />
      </div>

      {/* Arc-reactor gauge */}
      <div className="hidden md:flex" aria-hidden="true" style={{
        position: "fixed", bottom: 22, left: 22, zIndex: 90,
        width: 44, height: 44, alignItems: "center", justifyContent: "center",
        borderRadius: "50%", background: "rgba(10,12,14,.55)", backdropFilter: "blur(8px)",
        border: "1px solid var(--hud-line)",
      }}>
        <svg width="38" height="38" viewBox="0 0 38 38" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="19" cy="19" r="14" fill="none" stroke="var(--hud-line)" strokeWidth="2" />
          <motion.circle cx="19" cy="19" r="14" fill="none" stroke="var(--reactor)" strokeWidth="2"
            strokeLinecap="round" style={{ pathLength: scrollYProgress }} />
        </svg>
        <motion.div style={{
          position: "absolute", width: 8, height: 8, borderRadius: "50%",
          background: "var(--reactor)", opacity: coreOpacity,
          boxShadow: "0 0 10px var(--reactor)",
        }} />
      </div>
    </>
  );
}
