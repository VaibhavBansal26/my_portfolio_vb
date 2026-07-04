"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { personal } from "@/data/portfolio";

/**
 * #17(5) GitHub contribution city — the last 26 weeks of real commit
 * activity as an isometric skyline. Falls back to hiding if API fails.
 */
type Week = { total: number };

export default function GitHubCity() {
  const [weeks, setWeeks] = useState<Week[] | null>(null);

  useEffect(() => {
    fetch("https://github-contributions-api.jogruber.de/v4/VaibhavBansal26?y=last")
      .then(r => r.json())
      .then(data => {
        const days: { date: string; count: number }[] = data?.contributions ?? [];
        if (!days.length) return;
        const recent = days.slice(-182); // 26 weeks
        const ws: Week[] = [];
        for (let i = 0; i < recent.length; i += 7)
          ws.push({ total: recent.slice(i, i + 7).reduce((s, d) => s + d.count, 0) });
        setWeeks(ws);
      })
      .catch(() => {});
  }, []);

  if (!weeks) return null; // real data or nothing

  const max = Math.max(...weeks.map(w => w.total), 1);
  const BW = 26, ISO = 0.5;

  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="section-label">Commit Skyline</span>
              <h2 className="font-display font-extrabold mt-2" style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)" }}>
                26 weeks of shipping
              </h2>
            </div>
            <a href={personal.github} target="_blank" rel="noopener noreferrer"
              className="font-mono text-[10px] tracking-[.2em] uppercase hover-underline"
              style={{ color: "var(--text-muted)", textDecoration: "none" }}>
              live from GitHub ↗
            </a>
          </div>
        </Reveal>
        <div style={{ overflowX: "auto", marginTop: 36 }}>
          <svg viewBox={`0 0 ${weeks.length * BW + 120} 300`} style={{ minWidth: 760, width: "100%", display: "block" }}>
            {weeks.map((w, i) => {
              const hgt = 16 + (w.total / max) * 190;
              const x = 40 + i * BW, yBase = 260 - i * 1.2;
              const top = yBase - hgt;
              const c = w.total / max;
              const face = `rgba(232,168,56,${.25 + c * .65})`;
              const side = `rgba(232,168,56,${.12 + c * .3})`;
              return (
                <motion.g key={i}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.025, duration: .5 }}>
                  <polygon points={`${x},${top} ${x + BW * .7},${top} ${x + BW * .7},${yBase} ${x},${yBase}`} fill={face} />
                  <polygon points={`${x + BW * .7},${top} ${x + BW * .7 + BW * .3},${top - BW * ISO * .6} ${x + BW * .7 + BW * .3},${yBase - BW * ISO * .6} ${x + BW * .7},${yBase}`} fill={side} />
                  <polygon points={`${x},${top} ${x + BW * .3},${top - BW * ISO * .6} ${x + BW * .7 + BW * .3},${top - BW * ISO * .6} ${x + BW * .7},${top}`} fill={`rgba(244,201,106,${.3 + c * .6})`} />
                  {w.total > 0 && (
                    <text x={x + BW * .35} y={top - 12} textAnchor="middle"
                      style={{ font: "8px 'JetBrains Mono',monospace", fill: "var(--text-muted)" }}>
                      {w.total}
                    </text>
                  )}
                </motion.g>
              );
            })}
            <text x="40" y="290" style={{ font: "9px 'JetBrains Mono',monospace", fill: "var(--text-muted)", letterSpacing: ".2em" }}>
              ← 26 WEEKS AGO
            </text>
            <text x={weeks.length * BW - 40} y="290" style={{ font: "9px 'JetBrains Mono',monospace", fill: "var(--accent)", letterSpacing: ".2em" }}>
              THIS WEEK
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
