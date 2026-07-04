"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * #8 Proactive FRIDAY — one contextual nudge per session when the visitor
 * dwells on a section. Click opens the chatbot; dismiss kills it.
 */
const NUDGES: Record<string, string> = {
  "#vb-stop-research": "Reading the research? I can give you the 30-second summary.",
  "#vb-stop-projects": "Want me to pick the three projects most relevant to you?",
};

export default function ProactiveFriday() {
  const [msg, setMsg] = useState<string | null>(null);
  const used = useRef(false);

  useEffect(() => {
    try { if (sessionStorage.getItem("vb_nudged")) return; } catch {}
    const timers = new Map<Element, ReturnType<typeof setTimeout>>();
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const sel = Object.keys(NUDGES).find(s => e.target.matches(s));
        if (!sel) return;
        if (e.isIntersecting && !used.current) {
          timers.set(e.target, setTimeout(() => {
            if (used.current) return;
            used.current = true;
            try { sessionStorage.setItem("vb_nudged", "1"); } catch {}
            setMsg(NUDGES[sel]);
            setTimeout(() => setMsg(null), 12000);
          }, 4000)); // 4s dwell
        } else {
          const t = timers.get(e.target);
          if (t) clearTimeout(t);
        }
      });
    }, { threshold: 0.5 });

    // attach after hydration settles
    const attach = setTimeout(() => {
      Object.keys(NUDGES).forEach(s => { const el = document.querySelector(s); if (el) io.observe(el); });
    }, 2000);
    return () => { io.disconnect(); clearTimeout(attach); timers.forEach(clearTimeout); };
  }, []);

  return (
    <AnimatePresence>
      {msg && (
        <motion.button
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
          onClick={() => { setMsg(null); window.dispatchEvent(new CustomEvent("vb-chat-open")); }}
          className="fixed z-[120] text-left font-mono"
          style={{ right: 20, bottom: 96, maxWidth: 280, padding: "12px 16px", cursor: "pointer",
            background: "rgba(10,12,14,.94)", backdropFilter: "blur(10px)",
            border: "1px solid var(--hud-line)", color: "var(--text)" }}>
          <span className="block text-[8px] tracking-[.25em] uppercase mb-1" style={{ color: "var(--reactor-dim)" }}>
            FRIDAY
          </span>
          <span style={{ fontSize: 11, lineHeight: 1.5 }}>{msg}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
