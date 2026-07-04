"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

export type Persona = "recruiter" | "engineer" | "browsing";
export const PERSONA_KEY = "vb_persona";
export const PERSONA_EVENT = "vb-persona-change";

export function setPersona(p: Persona) {
  try { localStorage.setItem(PERSONA_KEY, p); } catch {}
  window.dispatchEvent(new CustomEvent(PERSONA_EVENT, { detail: p }));
}

export function getPersona(): Persona | null {
  try { return (localStorage.getItem(PERSONA_KEY) as Persona) || null; } catch { return null; }
}

/**
 * FRIDAY · Adaptive mode — asks once who's visiting, then the homepage
 * reorders itself. The portfolio IS the AI demo.
 */
export default function PersonaPicker() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (getPersona()) return;              // already chose
    try { if (sessionStorage.getItem("vb_persona_dismissed")) return; } catch {}
    const t = setTimeout(() => setShow(true), 4500);  // after boot sequence settles
    return () => clearTimeout(t);
  }, []);

  const choose = (p: Persona) => { setPersona(p); setShow(false); };
  const dismiss = () => {
    try { sessionStorage.setItem("vb_persona_dismissed", "1"); } catch {}
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
          transition={{ duration: .45, ease: [.22,1,.36,1] }}
          role="dialog" aria-label="Tailor this page"
          className="fixed left-1/2 -translate-x-1/2 z-[150]"
          style={{ bottom: 24, background: "rgba(12,13,15,.92)", backdropFilter: "blur(14px)",
            border: "1px solid var(--hud-line)", padding: "12px 16px",
            display: "flex", alignItems: "center", gap: 12, maxWidth: "calc(100vw - 32px)", flexWrap: "wrap" }}>
          <span className="font-mono text-[10px] tracking-[.2em] uppercase" style={{ color: "var(--reactor-dim)" }}>
            FRIDAY · tailor this page — you are…
          </span>
          {([["recruiter","Hiring"],["engineer","Engineer"],["browsing","Just browsing"]] as [Persona,string][]).map(([p,label]) => (
            <button key={p} onClick={() => choose(p)}
              className="font-mono text-[11px] uppercase tracking-wider"
              style={{ padding: "7px 14px", background: "transparent", cursor: "pointer",
                border: "1px solid var(--border-bright)", color: "var(--text)", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--reactor)"; e.currentTarget.style.color = "var(--reactor)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-bright)"; e.currentTarget.style.color = "var(--text)"; }}>
              {label}
            </button>
          ))}
          <button onClick={dismiss} aria-label="Dismiss"
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4 }}>
            <FiX size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
