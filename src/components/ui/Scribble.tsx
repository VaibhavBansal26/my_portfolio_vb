"use client";
import { motion } from "framer-motion";

/**
 * Intentional imperfection — hand-drawn marks over the machine interface.
 * The human side of the man+machine story.
 */

/** Wavy hand-drawn underline that draws itself in. */
export function ScribbleUnderline({ children, color = "var(--accent)" }: {
  children: React.ReactNode; color?: string;
}) {
  return (
    <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
      {children}
      <svg viewBox="0 0 220 14" preserveAspectRatio="none" aria-hidden
        style={{ position: "absolute", left: "-2%", bottom: -8, width: "104%", height: 12, overflow: "visible" }}>
        <motion.path
          d="M3 9 C 30 3, 55 12, 85 7 S 150 2, 178 8 S 208 11, 217 6"
          fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: true }} transition={{ duration: .8, delay: .5, ease: "easeOut" }} />
      </svg>
    </span>
  );
}

/** Hand-drawn circle around a word. */
export function ScribbleCircle({ children, color = "var(--reactor)" }: {
  children: React.ReactNode; color?: string;
}) {
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {children}
      <svg viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden
        style={{ position: "absolute", inset: "-22% -10%", width: "120%", height: "144%", overflow: "visible" }}>
        <motion.path
          d="M100 6 C 165 2, 196 22, 193 42 C 190 66, 140 78, 92 75 C 40 72, 6 58, 9 38 C 12 16, 60 4, 118 8"
          fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: true }} transition={{ duration: 1, delay: .6, ease: "easeOut" }} />
      </svg>
    </span>
  );
}

/** Curved doodle arrow. Flip with `flip` to point the other way. */
export function DoodleArrow({ color = "var(--accent)", flip = false, size = 56, style }: {
  color?: string; flip?: boolean; size?: number; style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} aria-hidden
      style={{ transform: flip ? "scaleX(-1)" : undefined, overflow: "visible", ...style }}>
      <motion.path
        d="M8 6 C 14 28, 26 44, 48 50 M48 50 L36 48 M48 50 L44 38"
        fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true }} transition={{ duration: .7, delay: .8, ease: "easeOut" }} />
    </svg>
  );
}

/** Handwritten margin note. */
export function HandNote({ children, rotate = -3, color = "var(--accent)", size = 17, style }: {
  children: React.ReactNode; rotate?: number; color?: string; size?: number; style?: React.CSSProperties;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: .5, delay: .9 }}
      style={{ fontFamily: "var(--font-hand)", fontSize: size, color,
        display: "inline-block", transform: `rotate(${rotate}deg)`, lineHeight: 1.3, ...style }}>
      {children}
    </motion.span>
  );
}
