"use client";
import { motion, useReducedMotion } from "framer-motion";

/**
 * FRIDAY · Hologram-materialize reveal.
 * Content scrolls into view → de-blurs and rises, like a HUD panel forming.
 */
export function Reveal({
  children,
  delay = 0,
  y = 40,
  blur = false,   // blur is repaint-heavy — only enable on SMALL elements
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  blur?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : (blur ? { opacity: 0, y, filter: "blur(8px)" } : { opacity: 0, y })}
      whileInView={blur ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger a list of children as they enter the viewport. */
export function RevealStagger({
  children,
  className,
  step = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  step?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: step } } }}
    >
      {children}
    </motion.div>
  );
}

export const revealItem = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};
