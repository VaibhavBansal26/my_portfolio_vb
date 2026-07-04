"use client";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiGithub, FiArrowUpRight, FiMapPin } from "react-icons/fi";
import { SiLeetcode, SiNpm } from "react-icons/si";
import { stats, personal } from "@/data/portfolio";
import { HandNote } from "@/components/ui/Scribble";

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: .55, ease: [.22,1,.36,1] as const } },
};

function Tile({ children, className = "", href, external }: {
  children: React.ReactNode; className?: string; href?: string; external?: boolean;
}) {
  const inner = (
    <motion.div variants={item}
      className={`hud-corners relative overflow-hidden group h-full ${className}`}
      style={{ border: "1px solid var(--border)", background: "var(--bg-card)",
        padding: 24, transition: "border-color .25s, transform .25s" }}
      whileHover={{ y: -3 }}>
      {children}
      {href && (
        <FiArrowUpRight size={14} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100"
          style={{ color: "var(--reactor)", transition: "opacity .2s" }} />
      )}
    </motion.div>
  );
  if (!href) return inner;
  return external
    ? <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none", display:"block", height:"100%" }}>{inner}</a>
    : <Link href={href} style={{ textDecoration:"none", display:"block", height:"100%" }}>{inner}</Link>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[9px] tracking-[.25em] uppercase" style={{ color:"var(--text-muted)" }}>{children}</p>;
}

/**
 * FRIDAY · Bento — system metrics as an interactive tile grid.
 * Replaces the flat stats strip.
 */
export default function BentoSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  const [years, projects, repos, leet] = stats.map(s => s.value);

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <motion.div ref={ref}
        initial="hidden" animate={inView ? "show" : "hidden"}
        variants={{ hidden:{}, show:{ transition:{ staggerChildren:.07 } } }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
        style={{ gridAutoRows: "minmax(120px, auto)" }}>

        {/* Big tile — experience */}
        <Tile className="col-span-2 row-span-2 flex flex-col justify-between">
          <Label>Experience</Label>
          <div>
            <p className="font-display font-extrabold" style={{ fontSize:"clamp(4rem,8vw,7rem)", lineHeight:1, color:"var(--text)" }}>
              {inView ? <CountUp end={years} duration={2} /> : "0"}<span style={{ color:"var(--accent)" }}>+</span>
            </p>
            <p className="mt-2 text-sm" style={{ color:"var(--text-muted)", maxWidth:300 }}>
              years shipping production AI &amp; full-stack systems — Wipro, DashClicks, SUNY Buffalo research.
            </p>
          </div>
          <p className="hud-telemetry">SYS·EXP · STATUS: ACTIVE</p>
        </Tile>

        {/* GitHub */}
        <Tile className="col-span-1 flex flex-col justify-between" href={personal.github} external>
          <div className="flex items-center justify-between">
            <Label>GitHub</Label><FiGithub size={14} style={{ color:"var(--text-muted)" }} />
          </div>
          <p className="font-display font-extrabold" style={{ fontSize:36, color:"var(--text)" }}>
            {inView ? <CountUp end={repos} duration={2} /> : "0"}+
          </p>
          <p className="font-mono text-[10px]" style={{ color:"var(--text-muted)" }}>public repos</p>
        </Tile>

        {/* LeetCode */}
        <Tile className="col-span-1 flex flex-col justify-between" href={personal.leetcode} external>
          <div className="flex items-center justify-between">
            <Label>LeetCode</Label><SiLeetcode size={13} style={{ color:"var(--text-muted)" }} />
          </div>
          <p className="font-display font-extrabold" style={{ fontSize:36, color:"var(--text)" }}>
            {inView ? <CountUp end={leet} duration={2} /> : "0"}+
          </p>
          <p className="font-mono text-[10px]" style={{ color:"var(--text-muted)" }}>problems solved</p>
        </Tile>

        {/* npm */}
        <Tile className="col-span-1 flex flex-col justify-between" href={personal.npmPackage} external>
          <div className="flex items-center justify-between">
            <Label>npm</Label><SiNpm size={15} style={{ color:"#cb3837" }} />
          </div>
          <p className="font-mono text-[11px] leading-snug" style={{ color:"var(--text)" }}>grapesjs-advance-components</p>
          <p className="font-mono text-[10px]" style={{ color:"var(--reactor-dim)" }}>published · open source</p>
        </Tile>

        {/* Projects */}
        <Tile className="col-span-1 flex flex-col justify-between" href="/portfolio">
          <Label>Projects</Label>
          <p className="font-display font-extrabold" style={{ fontSize:36, color:"var(--text)" }}>
            {inView ? <CountUp end={projects} duration={2} /> : "0"}+
          </p>
          <p className="font-mono text-[10px]" style={{ color:"var(--text-muted)" }}>built &amp; deployed →</p>
        </Tile>

        {/* The human */}
        <Tile className="col-span-2 flex items-center gap-5" href="/about">
          <div className="relative flex-shrink-0 rounded-full overflow-hidden" style={{ width:72, height:72, border:"1px solid var(--border-bright)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={personal.avatar} alt="Vaibhav Bansal"
              style={{ width:"100%", height:"100%", objectFit:"cover", filter:"grayscale(.4)", transition:"filter .3s" }}
              onMouseEnter={e=>((e.currentTarget as HTMLImageElement).style.filter="grayscale(0)")}
              onMouseLeave={e=>((e.currentTarget as HTMLImageElement).style.filter="grayscale(.4)")} />
          </div>
          <div>
            <Label>The Human</Label>
            <p className="mt-1 font-display font-bold" style={{ fontSize:16, color:"var(--text)" }}>Vaibhav Bansal</p>
            <HandNote rotate={-2} size={15}>the one FRIDAY works for →</HandNote>
          </div>
        </Tile>

        {/* Availability strip */}
        <Tile className="col-span-2 flex items-center justify-between" href="/contact">
          <div>
            <Label>Status</Label>
            <p className="mt-2 font-display font-bold text-lg" style={{ color:"var(--text)" }}>Open to opportunities</p>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px]" style={{ color:"var(--text-muted)" }}>
            <FiMapPin size={12} /> United States
            <motion.span animate={{ opacity:[1,.2,1] }} transition={{ duration:2, repeat:Infinity }}
              className="w-2 h-2 rounded-full inline-block ml-2" style={{ background:"#22c55e" }} />
          </div>
        </Tile>

      </motion.div>
    </section>
  );
}
