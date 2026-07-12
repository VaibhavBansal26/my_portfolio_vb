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

const ACTS_STUDIO = [
  "radial-gradient(100% 100% at 80% 10%, #3a0b0b 0%, #120808 36%, #070707 76%)",
  "radial-gradient(100% 100% at 12% 40%, #2b0b0d 0%, #0c0809 45%, #070707 100%)",
  "radial-gradient(100% 100% at 78% 52%, #401010 0%, #11090a 42%, #070707 100%)",
  "radial-gradient(100% 100% at 50% 100%, #30100d 0%, #0d0908 44%, #070707 100%)",
];

const ACTS_ARCANE = [
  "radial-gradient(110% 100% at 74% 24%, #18314d 0%, #0b182b 38%, #050b14 82%)",
  "radial-gradient(110% 100% at 20% 38%, #302643 0%, #111629 42%, #060b16 100%)",
  "radial-gradient(110% 100% at 76% 55%, #243950 0%, #101829 44%, #060b15 100%)",
  "radial-gradient(110% 100% at 42% 100%, #2d2037 0%, #101323 42%, #060b15 100%)",
];

const ACTS_KINGDOMS = [
  "radial-gradient(110% 100% at 72% 15%, #213446 0%, #0d1721 38%, #070a0f 82%)",
  "radial-gradient(110% 100% at 12% 46%, #43231a 0%, #181216 38%, #080b10 100%)",
  "radial-gradient(110% 100% at 80% 58%, #1d3441 0%, #0c151d 44%, #070a0f 100%)",
  "radial-gradient(110% 100% at 52% 100%, #392118 0%, #151116 40%, #070a0f 100%)",
];

const ACTS_IRONMAN = [
  "radial-gradient(100% 100% at 74% 20%, #43130e 0%, #170b0a 38%, #080707 82%)",
  "radial-gradient(100% 100% at 18% 46%, #3d180c 0%, #170d09 42%, #080707 100%)",
  "radial-gradient(100% 100% at 78% 55%, #15333a 0%, #0b1719 35%, #090707 100%)",
  "radial-gradient(100% 100% at 48% 100%, #47170d 0%, #180c09 42%, #080707 100%)",
];

const ACTS_AI = [
  "radial-gradient(110% 100% at 72% 18%, #0b3440 0%, #06171d 40%, #02080c 84%)",
  "radial-gradient(110% 100% at 16% 42%, #0b2e35 0%, #06151b 42%, #02080c 100%)",
  "radial-gradient(110% 100% at 78% 58%, #102842 0%, #07131f 42%, #02080c 100%)",
  "radial-gradient(110% 100% at 48% 100%, #0c3330 0%, #061716 40%, #02080c 100%)",
];

/* Onyx journey — near-black with slow violet/cyan undertones */
const ACTS_ONYX = [
  "radial-gradient(120% 90% at 50% 0%, #0b0b14 0%, #06060a 55%, #050508 100%)",
  "radial-gradient(120% 90% at 30% 10%, #100a1e 0%, #07070c 55%, #050508 100%)",
  "radial-gradient(120% 90% at 70% 10%, #071018 0%, #06060b 55%, #050508 100%)",
  "radial-gradient(120% 90% at 50% 0%, #0b0b14 0%, #06060a 55%, #050508 100%)",
];

/* Paper journey — near-static warm whites; the Swiss stage stays quiet */
const ACTS_SWISS = [
  "radial-gradient(120% 90% at 50% 0%, #fbfaf6 0%, #f5f4f0 55%, #efeee9 100%)",
  "radial-gradient(120% 90% at 50% 0%, #f7f6f1 0%, #f4f3ee 55%, #eeede8 100%)",
  "radial-gradient(120% 90% at 50% 0%, #f9f7f2 0%, #f5f4f0 55%, #efeee9 100%)",
  "radial-gradient(120% 90% at 50% 0%, #fbfaf6 0%, #f5f4f0 55%, #efeee9 100%)",
];

/* Polar night journey — teal glow → violet sky → deep green → polar blue */
const ACTS_AURORA = [
  "radial-gradient(110% 100% at 70% 16%, #0c3527 0%, #07141c 40%, #030a10 84%)",
  "radial-gradient(110% 100% at 18% 42%, #241d45 0%, #0b1322 42%, #030a10 100%)",
  "radial-gradient(110% 100% at 78% 56%, #0d3138 0%, #081420 42%, #030a10 100%)",
  "radial-gradient(110% 100% at 48% 100%, #16294a 0%, #091323 40%, #030a10 100%)",
];

export function BackgroundJourney() {
  const [activeTheme, setActiveTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const bgDark  = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], ACTS_DARK);
  const bgLight = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], ACTS_LIGHT);
  const bgStudio = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], ACTS_STUDIO);
  const bgArcane = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], ACTS_ARCANE);
  const bgKingdoms = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], ACTS_KINGDOMS);
  const bgIronman = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], ACTS_IRONMAN);
  const bgAi = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], ACTS_AI);
  const bgAurora = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], ACTS_AURORA);
  const bgSwiss = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], ACTS_SWISS);
  const bgOnyx = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], ACTS_ONYX);

  useEffect(() => {
    setMounted(true);
    // daypart + season ambient tint
    const h = new Date().getHours();
    const daypart = h < 6 ? "night" : h < 11 ? "morning" : h < 18 ? "day" : h < 22 ? "evening" : "night";
    document.documentElement.setAttribute("data-daypart", daypart);
    const check = () => {
      const root = document.documentElement;
      const theme = ["light", "studio", "arcane", "kingdoms", "ironman", "ai", "aurora", "swiss", "onyx"]
        .find((name) => root.classList.contains(name));
      setActiveTheme(theme ?? "dark");
    };
    check();
    const mo = new MutationObserver(check);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  if (!mounted) return null;
  const backgrounds = {
    dark: bgDark,
    light: bgLight,
    studio: bgStudio,
    arcane: bgArcane,
    kingdoms: bgKingdoms,
    ironman: bgIronman,
    ai: bgAi,
    aurora: bgAurora,
    swiss: bgSwiss,
    onyx: bgOnyx,
  };
  return (
    <motion.div aria-hidden className="vb-journey"
      style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none",
        background: backgrounds[activeTheme as keyof typeof backgrounds] ?? bgDark }} />
  );
}

/** Film grain — fixed, static texture. The cheap trick that kills "flat 2018 dark mode". */
export function Grain() {
  return (
    <div aria-hidden className="vb-grain" style={{
      position: "fixed", inset: 0, zIndex: 9990, pointerEvents: "none",
      opacity: 0.05, mixBlendMode: "overlay",
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: "180px 180px",
    }} />
  );
}
