"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiArrowUpRight } from "react-icons/fi";
import { SiLeetcode, SiNpm } from "react-icons/si";
import { personal } from "@/data/portfolio";
import LiveTelemetry from "@/components/ui/LiveTelemetry";
import { HandNote } from "@/components/ui/Scribble";

/** #5 Signature footer — a destination, not an afterthought. */
export default function Footer() {
  const [visitorTime, setVisitorTime] = useState("");
  const [myTime, setMyTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setVisitorTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setMyTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "America/New_York" }));
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="relative overflow-hidden" style={{ borderTop: "1px solid var(--border)" }}>
      {/* Giant CTA */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-10">
        <p className="font-mono text-[10px] tracking-[.3em] uppercase" style={{ color: "var(--reactor-dim)" }}>
          FRIDAY · CHANNEL OPEN
        </p>
        <Link href="/contact" className="group block mt-4" style={{ textDecoration: "none" }}>
          <motion.h2 whileHover={{ x: 10 }} transition={{ duration: .35, ease: [.22,1,.36,1] }}
            className="font-display font-extrabold"
            style={{ fontSize: "clamp(2.6rem,8vw,6.5rem)", lineHeight: .98, color: "var(--text)" }}>
            let&apos;s build<br />
            <span style={{ background: "linear-gradient(120deg,var(--hard-accent,#e8a838),var(--hard-accent-2,#f4c96a))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              something
            </span>
            <span className="inline-block ml-4 align-top opacity-40 group-hover:opacity-100 group-hover:translate-x-2 group-hover:-translate-y-2"
              style={{ transition: "all .3s", color: "var(--accent)", WebkitTextFillColor: "var(--accent)" }}>
              <FiArrowUpRight size={48} />
            </span>
          </motion.h2>
        </Link>
        <a href={`mailto:${personal.email}`}
          className="inline-block mt-6 font-mono text-sm hover-underline"
          style={{ color: "var(--text-muted)", textDecoration: "none" }}>
          {personal.email}
        </a>
        <span className="ml-4 align-middle">
          <HandNote rotate={-2} size={15}>i reply fast, FRIDAY makes sure</HandNote>
        </span>
      </div>

      {/* Clocks + links rule */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 py-6 font-mono text-[10px] tracking-[.15em] uppercase"
          style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}>
          <div suppressHydrationWarning>YOUR TIME <span style={{ color: "var(--text)" }}>{visitorTime || "—"}</span></div>
          <div suppressHydrationWarning>MY TIME (EST) <span style={{ color: "var(--text)" }}>{myTime || "—"}</span></div>
          <div className="flex gap-4 items-center mt-3 md:mt-0">
            {[
              { href: personal.github, icon: <FiGithub size={14} />, label: "GitHub" },
              { href: personal.linkedin, icon: <FiLinkedin size={14} />, label: "LinkedIn" },
              { href: personal.leetcode, icon: <SiLeetcode size={13} />, label: "LeetCode" },
              { href: personal.npmPackage, icon: <SiNpm size={14} />, label: "npm" },
            ].map(({ href, icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                {icon}
              </a>
            ))}
          </div>
          <div className="flex gap-5 mt-3 md:mt-0 md:justify-end">
            <Link href="/terminal" className="hover-underline" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Terminal</Link>
            <a href="/presskit.pdf" download className="hover-underline" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Press kit</a>
          </div>
        </div>
      </div>

      {/* Telemetry strip */}
      <div className="max-w-6xl mx-auto px-6 py-5" style={{ borderTop: "1px solid var(--border)" }}>
        <LiveTelemetry />
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-8 flex flex-wrap justify-between gap-2 font-mono text-[9px] tracking-[.2em] uppercase"
        style={{ color: "var(--text-muted)" }}>
        <span>© {new Date().getFullYear()} Vaibhav Bansal · Built with FRIDAY</span>
        <span>Designed in conversation, shipped in production</span>
      </div>
    </footer>
  );
}
