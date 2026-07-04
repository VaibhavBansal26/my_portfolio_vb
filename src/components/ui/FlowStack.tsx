"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * FRIDAY · Continuous flow system — no section splits.
 *
 * <Flow>      wraps a section: as it exits the top of the viewport it gently
 *             scales down, dims and drifts up while the next section arrives —
 *             sections melt into each other instead of stacking like boxes.
 *
 * <BackgroundJourney>  one fixed layer whose gradient slowly evolves with
 *             global scroll — warm black → reactor teal-black → deep indigo →
 *             warm black. The page feels like a single scene with acts,
 *             not a list of widgets.
 */
export function Flow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["end 85%", "end 15%"] });
  const scale   = useTransform(scrollYProgress, [0, 1], [1, 0.97]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);
  const y       = useTransform(scrollYProgress, [0, 1], [0, -24]);

  return (
    <motion.div ref={ref} style={reduce ? undefined : { scale, opacity, y }}>
      {children}
    </motion.div>
  );
}

const ACTS_DARK = [
  "radial-gradient(120% 90% at 50% 0%, #15100a 0%, #0e0e0e 55%, #0c0c0c 100%)",
  "radial-gradient(120% 90% at 50% 0%, #0a1417 0%, #0d0f10 55%, #0c0c0c 100%)",
  "radial-gradient(120% 90% at 50% 0%, #0e0d18 0%, #0e0e12 55%, #0c0c0c 100%)",
  "radial-gradient(120% 90% at 50% 0%, #14100b 0%, #0e0e0e 55%, #0c0c0c 100%)",
];

/* Warm paper journey — sunlit ivory → cool mist → lavender paper → ivory */
const ACTS_LIGHT = [
  "radial-gradient(120% 90% at 50% 0%, #fdf8ee 0%, #faf7f2 55%, #f6f1e8 100%)",
  "radial-gradient(120% 90% at 50% 0%, #eef6f6 0%, #f6f6f1 55%, #f4f1ea 100%)",
  "radial-gradient(120% 90% at 50% 0%, #f4f1fa 0%, #f7f4f1 55%, #f5f0e9 100%)",
  "radial-gradient(120% 90% at 50% 0%, #fcf7ec 0%, #faf7f2 55%, #f6f1e8 100%)",
];

export function BackgroundJourney() {
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const bgDark  = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], ACTS_DARK);
  const bgLight = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], ACTS_LIGHT);

  useEffect(() => {
    setMounted(true);
    // daypart + season ambient tint
    const h = new Date().getHours();
    const daypart = h < 6 ? "night" : h < 11 ? "morning" : h < 18 ? "day" : h < 22 ? "evening" : "night";
    document.documentElement.setAttribute("data-daypart", daypart);
    const check = () => setDark(!document.documentElement.classList.contains("light"));
    check();
    const mo = new MutationObserver(check);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  if (!mounted) return null;
  return (
    <motion.div aria-hidden className="vb-journey"
      style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none",
        background: dark ? bgDark : bgLight }} />
  );
}

/** Film grain — fixed, static texture. The cheap trick that kills "flat 2018 dark mode". */
export function Grain() {
  return (
    <div aria-hidden style={{
      position: "fixed", inset: 0, zIndex: 9990, pointerEvents: "none",
      opacity: 0.05, mixBlendMode: "overlay",
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: "180px 180px",
    }} />
  );
}
