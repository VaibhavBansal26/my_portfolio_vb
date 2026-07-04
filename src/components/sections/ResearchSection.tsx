"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { research, personal } from "@/data/portfolio";
import { Reveal } from "@/components/ui/Reveal";
import ScrambleText from "@/components/ui/ScrambleText";
import ElasticDivider from "@/components/ui/ElasticDivider";

/**
 * Published Research — editorial publication feature.
 * Big confident type, hairline metadata rules, zero gadget chrome.
 */
export default function ResearchSection() {
  const paper = research[0];

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">

        <Reveal>
          <div className="flex items-baseline justify-between">
            <span className="section-label">Published Research</span>
            <span className="font-mono text-[10px] tracking-[.2em] uppercase"
              style={{ color: "var(--text-muted)" }}>№ 01 — Springer · VIT</span>
          </div>
        </Reveal>

        {/* Title as the artwork */}
        <Reveal delay={0.08}>
          <h2 className="font-display font-extrabold mt-8"
            style={{ fontSize: "clamp(1.7rem,3.6vw,3rem)", lineHeight: 1.15,
              maxWidth: "18ch", color: "var(--text)" }}>
            {paper.title}
          </h2>
        </Reveal>

        {/* Abstract — editorial pull quote */}
        <Reveal delay={0.16}>
          <div className="mt-10 md:grid" style={{ gridTemplateColumns: "80px 1fr", gap: 24 }}>
            <span aria-hidden className="hidden md:block font-display font-extrabold"
              style={{ fontSize: 110, lineHeight: .7, color: "var(--accent)", opacity: .25 }}>"</span>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: "var(--text-muted)",
              maxWidth: 640, fontStyle: "italic" }}>
              {paper.description}
            </p>
          </div>
        </Reveal>

        {/* Hairline metadata rule */}
        <Reveal delay={0.22}>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4"
            style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
            {[
              ["Year", "2020"],
              ["Venue", "Springer Nature"],
              ["Domain", "Deep Learning · NLP"],
              ["ORCID", "0000-0002-5433-0385"],
            ].map(([label, val], i) => (
              <div key={label} className="py-5 px-1 md:px-5"
                style={{ borderLeft: i > 0 ? "1px solid var(--border)" : "none" }}>
                <p className="font-mono text-[8px] tracking-[.25em] uppercase"
                  style={{ color: "var(--text-muted)" }}>{label}</p>
                <p className="font-display font-bold mt-1" style={{ fontSize: 13, color: "var(--text)" }}>
                  <ScrambleText text={val} />
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Tags + CTA */}
        <Reveal delay={0.28}>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link href={paper.orcid} target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 font-mono font-bold text-xs uppercase tracking-wider"
              style={{ padding: "13px 26px", background: "var(--accent)", color: "var(--bg)", textDecoration: "none" }}>
              Read the paper
              <motion.span className="inline-block group-hover:translate-x-1" style={{ transition: "transform .25s" }}>↗</motion.span>
            </Link>
            <Link href={personal.orcid} target="_blank" rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-wider hover-underline"
              style={{ color: "var(--text-muted)", textDecoration: "none" }}>
              ORCID profile
            </Link>
            <div className="flex flex-wrap gap-2 md:ml-auto">
              {paper.tags.slice(0, 4).map(tag => (
                <span key={tag} className="font-mono text-[8px] tracking-[.15em] uppercase"
                  style={{ padding: "4px 10px", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
        <div className="mt-16"><ElasticDivider /></div>
      </div>
    </section>
  );
}
