"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useTheme } from "next-themes";
import { FiAperture, FiArrowRight, FiCheck, FiCpu, FiGrid, FiMoon, FiSun, FiX, FiZap } from "react-icons/fi";
import {
  GiArtificialIntelligence,
  GiCandleFlame,
  GiCloak,
  GiFilmProjector,
  GiFilmStrip,
  GiIronMask,
  GiMagicPortal,
  GiOrbWand,
  GiPolarStar,
  GiSnowflake1,
  GiSwordInStone,
  GiThroneKing,
} from "react-icons/gi";
import type { IconType } from "react-icons";

export const ATMOSPHERE_EVENT = "vb:open-atmospheres";

type Atmosphere = {
  id: "dark" | "light" | "studio" | "arcane" | "kingdoms" | "ironman" | "ai" | "aurora" | "swiss" | "onyx";
  name: string;
  eyebrow: string;
  description: string;
  icon: IconType;
  swatches: [string, string, string];
};

const ATMOSPHERES: Atmosphere[] = [
  {
    id: "dark",
    name: "Default",
    eyebrow: "Portfolio",
    description: "The original calm gold-and-cyan system.",
    icon: FiMoon,
    swatches: ["#0e0e0e", "#e8a838", "#4fd8eb"],
  },
  {
    id: "light",
    name: "Light",
    eyebrow: "Editorial",
    description: "Warm paper, crisp type, daylight clarity.",
    icon: FiSun,
    swatches: ["#faf7f2", "#b8770a", "#0891b2"],
  },
  {
    id: "studio",
    name: "Director’s Cut",
    eyebrow: "Cinema",
    description: "Studio lights, camera silhouettes, red-screen drama.",
    icon: GiFilmProjector,
    swatches: ["#090707", "#ef3d35", "#ff9f6e"],
  },
  {
    id: "arcane",
    name: "Portal Chapters",
    eyebrow: "Arcane",
    description: "Wand light, cloak shadows, and enchanted portals.",
    icon: GiMagicPortal,
    swatches: ["#07111f", "#d8b46b", "#86b7da"],
  },
  {
    id: "kingdoms",
    name: "Kingdoms",
    eyebrow: "Epic fantasy",
    description: "A frozen throne room with steel, fire, and snow.",
    icon: GiThroneKing,
    swatches: ["#080c12", "#c7d0dc", "#79b9d7"],
  },
  {
    id: "ironman",
    name: "Armor Protocol",
    eyebrow: "Powered suit",
    description: "Red-gold armor, reactor light, and assistant telemetry.",
    icon: GiIronMask,
    swatches: ["#0b0808", "#e6a83a", "#52d8eb"],
  },
  {
    id: "ai",
    name: "Neural Field",
    eyebrow: "Artificial intelligence",
    description: "A quieter cyan neural grid built for the work.",
    icon: GiArtificialIntelligence,
    swatches: ["#030b0f", "#5eead4", "#38bdf8"],
  },
  {
    id: "onyx",
    name: "Onyx Motion",
    eyebrow: "Fresh drop",
    description: "Kinetic type wall, cursor light, horizontal work reel.",
    icon: FiZap,
    swatches: ["#06060a", "#a78bfa", "#22d3ee"],
  },
  {
    id: "swiss",
    name: "Swiss Editorial",
    eyebrow: "Complete redesign",
    description: "Paper, hairline grids, grotesk type, one red accent.",
    icon: FiGrid,
    swatches: ["#f5f4f0", "#101010", "#e2261f"],
  },
  {
    id: "aurora",
    name: "Aurora",
    eyebrow: "Polar night",
    description: "Northern lights drifting over a quiet star field.",
    icon: GiPolarStar,
    swatches: ["#050d14", "#4ade9d", "#a78bfa"],
  },
];

const SNOW = [
  { left: 3, size: 11, duration: 14, delay: -2, drift: 38 },
  { left: 9, size: 16, duration: 18, delay: -11, drift: -28 },
  { left: 15, size: 9, duration: 12, delay: -5, drift: 30 },
  { left: 22, size: 13, duration: 17, delay: -15, drift: -36 },
  { left: 29, size: 18, duration: 21, delay: -7, drift: 26 },
  { left: 36, size: 10, duration: 15, delay: -12, drift: -32 },
  { left: 43, size: 14, duration: 19, delay: -3, drift: 42 },
  { left: 50, size: 8, duration: 13, delay: -9, drift: -24 },
  { left: 57, size: 17, duration: 22, delay: -17, drift: 32 },
  { left: 64, size: 11, duration: 16, delay: -4, drift: -38 },
  { left: 71, size: 15, duration: 20, delay: -13, drift: 28 },
  { left: 78, size: 9, duration: 14, delay: -6, drift: -34 },
  { left: 85, size: 18, duration: 23, delay: -18, drift: 36 },
  { left: 91, size: 12, duration: 17, delay: -8, drift: -30 },
  { left: 97, size: 8, duration: 13, delay: -10, drift: 22 },
];

const CANDLES = [
  { left: 7, top: 72, size: 22, duration: 4.8, delay: -.8 },
  { left: 18, top: 26, size: 16, duration: 5.6, delay: -2.4 },
  { left: 33, top: 80, size: 19, duration: 4.4, delay: -1.2 },
  { left: 48, top: 18, size: 14, duration: 6.2, delay: -3.1 },
  { left: 64, top: 70, size: 20, duration: 5.2, delay: -2.0 },
  { left: 78, top: 28, size: 15, duration: 5.8, delay: -4.0 },
  { left: 91, top: 76, size: 18, duration: 4.6, delay: -1.7 },
];

function ThemeDecorations({ active }: { active: string }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const ySlow = useTransform(scrollYProgress, [0, 1], ["0vh", "28vh"]);
  const yFast = useTransform(scrollYProgress, [0, 1], ["0vh", "-34vh"]);
  const sceneY = useTransform(scrollYProgress, [0, 1], ["-3vh", "4vh"]);
  const armorScaleTarget = useTransform(scrollYProgress, [0, 0.65], [1.01, 1.035]);
  const armorSideTarget = useTransform(scrollYProgress, [0, 0.18, 0.44, 0.58], [.52, .48, .08, 0]);
  const armorFrontTarget = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.68], [0, .02, .45, .54]);
  const springConfig = { stiffness: 90, damping: 28, mass: .75 };
  const armorScale = useSpring(armorScaleTarget, springConfig);
  const armorSideOpacity = useSpring(armorSideTarget, springConfig);
  const armorFrontOpacity = useSpring(armorFrontTarget, springConfig);
  const turn = useTransform(scrollYProgress, [0, 1], [0, 32]);

  if (active === "dark" || active === "light") return null;

  const shared = {
    "aria-hidden": true,
    focusable: false,
  } as const;

  return (
    <div className={`theme-decor theme-decor--${active}`} aria-hidden>
      <motion.div
        className="theme-scene"
        style={reduce ? undefined : { y: sceneY, scale: 1.06 }}
      />
      {active === "ironman" && (
        <>
          <motion.div
            className="theme-armor-frame theme-armor-frame--side"
            style={reduce
              ? { opacity: .46 }
              : { y: sceneY, scale: armorScale, opacity: armorSideOpacity }}
          />
          <motion.div
            className="theme-armor-frame theme-armor-frame--front"
            style={reduce
              ? { opacity: 0 }
              : { y: sceneY, scale: armorScale, opacity: armorFrontOpacity }}
          />
        </>
      )}
      {active === "studio" && (
        <>
          <motion.div className="theme-prop theme-prop--left" style={reduce ? undefined : { y: ySlow, rotate: turn }}>
            <GiFilmProjector {...shared} />
          </motion.div>
          <motion.div className="theme-prop theme-prop--right" style={reduce ? undefined : { y: yFast }}>
            <GiFilmStrip {...shared} />
          </motion.div>
          <div className="theme-light-beam theme-light-beam--one" />
          <div className="theme-light-beam theme-light-beam--two" />
        </>
      )}

      {active === "arcane" && (
        <>
          <div className="theme-candles" aria-hidden>
            {CANDLES.map((candle, index) => (
              <motion.span
                key={index}
                style={{ left: `${candle.left}%`, top: `${candle.top}%`, fontSize: candle.size }}
                animate={reduce ? undefined : {
                  y: [0, -28, 0],
                  x: [0, index % 2 ? 8 : -8, 0],
                  opacity: [.28, .9, .28],
                }}
                transition={{
                  duration: candle.duration,
                  delay: candle.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <GiCandleFlame />
              </motion.span>
            ))}
          </div>
          <motion.div className="theme-prop theme-prop--left" style={reduce ? undefined : { y: ySlow, rotate: turn }}>
            <GiOrbWand {...shared} />
          </motion.div>
          <motion.div className="theme-prop theme-prop--right" style={reduce ? undefined : { y: yFast }}>
            <GiCloak {...shared} />
          </motion.div>
          <motion.div className="theme-sigil" style={reduce ? undefined : { rotate: turn }}>
            <GiMagicPortal {...shared} />
          </motion.div>
        </>
      )}

      {active === "kingdoms" && (
        <>
          <div className="theme-snow" aria-hidden>
            {SNOW.map((flake, index) => (
              <motion.span
                key={index}
                style={{ left: `${flake.left}%`, fontSize: flake.size }}
                initial={{ y: "-12vh" }}
                animate={reduce ? undefined : {
                  y: "112vh",
                  x: [0, flake.drift, flake.drift * -.35, 0],
                  rotate: 360,
                }}
                transition={{
                  duration: flake.duration,
                  delay: flake.delay,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <GiSnowflake1 />
              </motion.span>
            ))}
          </div>
          <motion.div className="theme-prop theme-prop--left" style={reduce ? undefined : { y: ySlow }}>
            <GiSwordInStone {...shared} />
          </motion.div>
          <motion.div className="theme-prop theme-prop--right" style={reduce ? undefined : { y: yFast }}>
            <GiThroneKing {...shared} />
          </motion.div>
          <div className="theme-embers" />
        </>
      )}

      {active === "ironman" && (
        <>
          <motion.div className="theme-prop theme-prop--right theme-prop--reactor" style={reduce ? undefined : { y: yFast, rotate: turn }}>
            <FiAperture {...shared} />
          </motion.div>
          <div className="theme-telemetry">
            <span>ARMOR // ONLINE</span>
            <span>REACTOR // STABLE</span>
            <span>ASSIST // READY</span>
            <span>TYPE IRONMAN // RÉSUMÉ</span>
          </div>
        </>
      )}

      {active === "onyx" && (
        <>
          <div className="theme-onyx-nebula" />
          <div className="theme-onyx-vignette" />
        </>
      )}

      {active === "swiss" && (
        <>
          <div className="theme-swiss-grid" />
          <div className="theme-swiss-baseline" />
          <div className="theme-swiss-disc" />
          <div className="theme-swiss-folio">Vaibhav Bansal · Portfolio · Grid 12</div>
        </>
      )}

      {active === "aurora" && (
        <>
          <div className="theme-aurora-ribbon theme-aurora-ribbon--one" />
          <div className="theme-aurora-ribbon theme-aurora-ribbon--two" />
          <div className="theme-aurora-stars" />
          <motion.div className="theme-prop theme-prop--right" style={reduce ? undefined : { y: yFast, rotate: turn }}>
            <GiPolarStar {...shared} />
          </motion.div>
        </>
      )}

      {active === "ai" && (
        <>
          <motion.div className="theme-prop theme-prop--left" style={reduce ? undefined : { y: ySlow, rotate: turn }}>
            <GiArtificialIntelligence {...shared} />
          </motion.div>
          <motion.div className="theme-prop theme-prop--right" style={reduce ? undefined : { y: yFast }}>
            <FiCpu {...shared} />
          </motion.div>
          <div className="theme-neural-grid" />
        </>
      )}
    </div>
  );
}

export default function ThemeSwitcher() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  const active = useMemo(() => theme || resolvedTheme || "dark", [theme, resolvedTheme]);

  useEffect(() => {
    setMounted(true);
    const show = () => setOpen(true);
    window.addEventListener(ATMOSPHERE_EVENT, show);
    return () => window.removeEventListener(ATMOSPHERE_EVENT, show);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!mounted || active !== "ironman") {
      setResumeOpen(false);
      return;
    }

    let sequence = "";
    const onType = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, [contenteditable='true']")) return;
      if (event.key === "Escape") {
        setResumeOpen(false);
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey || event.key.length !== 1) return;
      sequence = `${sequence}${event.key.toLowerCase()}`.slice(-7);
      if (sequence === "ironman") {
        setResumeOpen(true);
        sequence = "";
      }
    };

    window.addEventListener("keydown", onType);
    return () => window.removeEventListener("keydown", onType);
  }, [active, mounted]);

  if (!mounted) return null;

  const choose = (id: Atmosphere["id"]) => {
    setTheme(id);
    setOpen(false);
  };

  return (
    <>
      <ThemeDecorations active={active} />

      <AnimatePresence>
        {open && (
          <motion.div
            className="atmosphere-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="atmosphere-title"
              className="atmosphere-dialog"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="atmosphere-dialog__header">
                <div>
                  <span className="atmosphere-kicker">Portfolio atmosphere</span>
                  <h2 id="atmosphere-title">Choose your world</h2>
                  <p>The work stays the same. The stage transforms.</p>
                </div>
                <button className="atmosphere-close" onClick={() => setOpen(false)} aria-label="Close atmosphere chooser">
                  <FiX />
                </button>
              </div>

              <div className="atmosphere-grid">
                {ATMOSPHERES.map((item) => {
                  const Icon = item.icon;
                  const selected = active === item.id;
                  return (
                    <button
                      key={item.id}
                      className={`atmosphere-option${selected ? " is-selected" : ""}`}
                      onClick={() => choose(item.id)}
                      aria-pressed={selected}
                    >
                      <span className="atmosphere-option__icon"><Icon /></span>
                      <span className="atmosphere-option__copy">
                        <small>{item.eyebrow}</small>
                        <strong>{item.name}</strong>
                        <span>{item.description}</span>
                      </span>
                      <span className="atmosphere-option__swatches" aria-hidden>
                        {item.swatches.map((color) => <i key={color} style={{ background: color }} />)}
                      </span>
                      {selected && <FiCheck className="atmosphere-option__check" />}
                    </button>
                  );
                })}
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {resumeOpen && active === "ironman" && (
          <motion.div
            className="iron-resume-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setResumeOpen(false);
            }}
          >
            <motion.div
              className="iron-resume-trail"
              initial={{ x: "115vw", opacity: 0 }}
              animate={{ x: "-115vw", opacity: [0, 1, 0] }}
              transition={{ duration: .72, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden
            />
            <motion.section
              className="iron-resume-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="iron-resume-title"
              initial={{ x: "115vw", rotate: 2.5, opacity: 0 }}
              animate={{ x: 0, rotate: 0, opacity: 1 }}
              exit={{ x: "115vw", rotate: -2, opacity: 0 }}
              transition={{ type: "spring", stiffness: 115, damping: 19 }}
            >
              <button
                className="iron-resume-close"
                onClick={() => setResumeOpen(false)}
                aria-label="Close resume"
              >
                <FiX />
              </button>
              <span className="iron-resume-kicker">ARMOR PROTOCOL · FILE ACQUIRED</span>
              <h2 id="iron-resume-title">Vaibhav Bansal</h2>
              <p className="iron-resume-role">Software Engineer · AI Engineer</p>
              <p className="iron-resume-summary">
                5+ years building scalable software, AI products, RAG systems,
                cloud platforms, and production data pipelines.
              </p>
              <div className="iron-resume-stats">
                <span><strong>5+</strong> years</span>
                <span><strong>50+</strong> projects</span>
                <span><strong>95+</strong> repositories</span>
              </div>
              <a href="/resume" className="iron-resume-action">
                Open full résumé <FiArrowRight />
              </a>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
