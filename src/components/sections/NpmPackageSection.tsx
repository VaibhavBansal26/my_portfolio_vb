"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { SiNpm } from "react-icons/si";
import { FiGithub, FiPackage, FiStar } from "react-icons/fi";
import { personal } from "@/data/portfolio";

export default function NpmPackageSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />

      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
        >
          {/* npm icon */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="flex-shrink-0 w-20 h-20 bg-[var(--accent)] flex items-center justify-center"
            style={{ boxShadow: "0 0 30px var(--accent-glow-strong)" }}
          >
            <SiNpm size={38} color="#050d1a" />
          </motion.div>

          {/* Content */}
          <div className="flex-1">
            <span className="section-label">Published Package</span>
            <h3 className="font-display text-2xl md:text-3xl font-extrabold mt-1">
              grapesjs-<span className="gradient-text">advance-components</span>
            </h3>
            <p className="text-[var(--text-muted)] text-sm mt-2 max-w-lg leading-relaxed">
              Open-source npm plugin extending GrapesJS with advanced drag-and-drop UI components.
              Enables richer web builder experiences with minimal configuration.
            </p>
            <div className="flex items-center gap-4 mt-3">
              <span className="skill-tag">JavaScript</span>
              <span className="skill-tag">GrapesJS</span>
              <span className="skill-tag">Open Source</span>
              <div className="flex items-center gap-1 ml-2">
                <FiStar size={12} className="text-[var(--accent)]" />
                <span className="font-mono text-[10px] text-[var(--text-muted)]">6 stars</span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 flex-shrink-0">
            <motion.a
              href={personal.npmPackage} target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-[#050d1a] font-mono text-xs tracking-wider uppercase font-bold"
              style={{ boxShadow: "0 0 16px var(--accent-glow)" }}
            >
              <FiPackage size={14} /> View on npm
            </motion.a>
            <Link
              href="https://github.com/VaibhavBansal26/grapesjs-advance-components"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 border border-[var(--border-bright)] text-[var(--text-muted)] font-mono text-xs tracking-wider uppercase hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
            >
              <FiGithub size={14} /> Source Code
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
