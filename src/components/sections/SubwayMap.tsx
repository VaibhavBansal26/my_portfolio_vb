"use client";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

/**
 * #19(7) Career subway map — roles as transit lines, skills as stations.
 * Lines draw themselves in on view.
 */
const LINES = [
  { name: "WIPRO LINE", color: "#38bdf8", d: "M40 150 H 300",
    stations: [{ x: 40, y: 150, l: "Java" }, { x: 170, y: 150, l: "Spring" }, { x: 300, y: 150, l: "SQL" }] },
  { name: "DASHCLICKS LINE", color: "#34d399", d: "M300 150 C 380 150 380 90 460 90 H 700",
    stations: [{ x: 460, y: 90, l: "React" }, { x: 580, y: 90, l: "Node" }, { x: 700, y: 90, l: "GrapesJS · npm" }] },
  { name: "BUFFALO LINE", color: "#c084fc", d: "M300 150 C 380 150 380 210 460 210 H 700",
    stations: [{ x: 460, y: 210, l: "ML" }, { x: 580, y: 210, l: "RAG · LLMs" }, { x: 700, y: 210, l: "Research" }] },
  { name: "NEXT", color: "#e8a838", d: "M700 90 C 780 90 780 150 850 150 M700 210 C 780 210 780 150 850 150",
    stations: [{ x: 850, y: 150, l: "Your team?" }] },
];

export default function SubwayMap() {
  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <span className="section-label">Transit Map</span>
          <h2 className="font-display font-extrabold mt-2 mb-10" style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)" }}>
            the career line
          </h2>
        </Reveal>
        <div style={{ overflowX: "auto" }}>
          <svg viewBox="0 0 900 300" style={{ minWidth: 700, width: "100%", display: "block" }}>
            {LINES.map((line, li) => (
              <g key={line.name}>
                <motion.path d={line.d} fill="none" stroke={line.color} strokeWidth="5" strokeLinecap="round"
                  initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }} transition={{ duration: 1.1, delay: li * 0.4, ease: "easeInOut" }} />
                {line.stations.map((s, si) => (
                  <motion.g key={s.l}
                    initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }} transition={{ delay: li * 0.4 + 0.5 + si * 0.18, type: "spring" }}>
                    <circle cx={s.x} cy={s.y} r="9" fill="var(--bg)" stroke={line.color} strokeWidth="3" />
                    <text x={s.x} y={s.y - 18} textAnchor="middle"
                      style={{ font: "10px 'JetBrains Mono', monospace", fill: "var(--text-muted)", letterSpacing: ".08em" }}>
                      {s.l}
                    </text>
                  </motion.g>
                ))}
                <motion.text x={li === 3 ? 800 : 40} y={li === 0 ? 178 : li === 1 ? 64 : li === 2 ? 240 : 130}
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  transition={{ delay: li * 0.4 + 0.3 }}
                  style={{ font: "700 9px 'JetBrains Mono', monospace", fill: line.color, letterSpacing: ".2em" }}>
                  {line.name}
                </motion.text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
