"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { experience, academicExperience, stats } from "@/data/portfolio";

/**
 * #21(9) career.sim — replay the career as a fast-forwarded terminal
 * sequence. Triggered from the FRIDAY console (⌘K).
 */
export default function SimulationMode() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const onStart = () => { setOpen(true); setLines([]); };
    window.addEventListener("vb-sim-start", onStart);
    return () => window.removeEventListener("vb-sim-start", onStart);
  }, []);

  useEffect(() => {
    if (!open) return;
    const all = [
      "$ friday run career.sim --speed 100x",
      "[SIM] Initializing timeline…",
      ...[...experience].reverse().flatMap(e => [
        `[${e.period}] ▶ ${e.role} @ ${e.company}`,
        `         └─ ${(e.tech ?? []).slice(0, 5).join(" · ")}`,
      ]),
      ...[...academicExperience].reverse().map(e => `[${e.period}] ▶ ${e.role} @ ${e.company}`),
      "[SIM] Aggregating output…",
      ...stats.map(s => `[OK]  ${s.label}: ${s.value}+`),
      "[SIM] Publishing research… DONE (Springer Nature)",
      "[SIM] Deploying to Times Square… DONE (somehow)",
      "[SIM] Simulation complete. Current status: OPEN TO OPPORTUNITIES",
      "$ _",
    ];
    let i = 0;
    timer.current = setInterval(() => {
      setLines(p => [...p, all[i]]);
      i++;
      if (i >= all.length && timer.current) clearInterval(timer.current);
    }, 240);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[290] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,.85)", backdropFilter: "blur(8px)" }}>
          <motion.div initial={{ scale: .95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .95, y: 16 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-2xl"
            style={{ background: "#060708", border: "1px solid var(--hud-line)", maxHeight: "76vh",
              display: "flex", flexDirection: "column" }}>
            <div className="flex items-center justify-between px-4 py-2"
              style={{ borderBottom: "1px solid var(--border)" }}>
              <span className="font-mono text-[9px] tracking-[.25em] uppercase" style={{ color: "var(--reactor-dim)" }}>
                FRIDAY · CAREER.SIM
              </span>
              <button onClick={() => setOpen(false)} className="font-mono text-[10px]"
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                ✕ esc
              </button>
            </div>
            <div className="p-4 font-mono overflow-auto" style={{ fontSize: 12, lineHeight: 1.9 }}>
              {lines.filter(Boolean).map((l, i) => (
                <div key={i} style={{
                  color: l.startsWith("[OK]") ? "#34d399"
                    : l.startsWith("[SIM]") ? "var(--reactor)"
                    : l.startsWith("$") ? "var(--accent)"
                    : l.includes("▶") ? "var(--text)" : "var(--text-muted)",
                }}>{l}</div>
              ))}
              <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: .9, repeat: Infinity }}
                style={{ display: "inline-block", width: 8, height: 13, background: "var(--accent)" }} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
