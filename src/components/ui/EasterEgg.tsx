"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TARGET = "vaibhav";
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  angle: (i / 30) * Math.PI * 2,
  r: 80 + Math.random() * 120,
  size: 3 + Math.random() * 6,
  delay: Math.random() * 0.4,
}));

export default function EasterEgg() {
  const [typed, setTyped] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore if user is in an input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      const next = (typed + e.key).slice(-TARGET.length);
      setTyped(next);
      if (next === TARGET) {
        setShow(true);
        setTyped("");
        setTimeout(() => setShow(false), 4500);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [typed]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "fixed", inset: 0, zIndex: 9000,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,.85)", backdropFilter: "blur(16px)",
            pointerEvents: "none",
          }}>

          {/* Burst particles */}
          {PARTICLES.map(p => (
            <motion.div key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
              animate={{
                x: Math.cos(p.angle) * p.r,
                y: Math.sin(p.angle) * p.r,
                opacity: [1, 1, 0],
                scale: [0, 1.4, 0.8],
              }}
              transition={{ duration: 1.2, delay: p.delay, ease: "easeOut" }}
              style={{
                position: "absolute", width: p.size, height: p.size,
                borderRadius: "50%", background: "#e8a838",
                boxShadow: `0 0 ${p.size * 3}px #e8a838`,
              }} />
          ))}

          {/* Main card */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotateY: 90 }}
            transition={{ duration: 0.6, ease: [.22, 1, .36, 1] }}
            style={{
              textAlign: "center", padding: "40px 56px",
              border: "1px solid rgba(232,168,56,.5)",
              background: "rgba(14,14,14,.95)",
              boxShadow: "0 0 80px rgba(232,168,56,.25), 0 0 160px rgba(232,168,56,.08)",
              maxWidth: 500,
            }}>

            {/* Pulsing amber ring */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              style={{
                width: 90, height: 90, borderRadius: "50%",
                border: "2px solid #e8a838",
                margin: "0 auto 20px",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 30px rgba(232,168,56,.4)",
              }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 800, color: "#e8a838" }}>VB</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#e8a838", letterSpacing: ".3em", textTransform: "uppercase", marginBottom: 10 }}>
                🎉 Easter Egg Unlocked
              </p>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: "#f0ece4", marginBottom: 12, lineHeight: 1.2 }}>
                You found me,<br/>
                <span style={{ color: "#e8a838" }}>Vaibhav Bansal</span>
              </h2>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: "#7a7265", lineHeight: 1.7, marginBottom: 18 }}>
                Software Engineer · AI Engineer · United States<br/>
                5+ years building production AI systems.<br/>
                Open to opportunities 🚀
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                {["Python","React","LangChain","RAG","Docker","AWS"].map((s, i) => (
                  <motion.span key={s}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.07 }}
                    style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, border: "1px solid rgba(232,168,56,.35)", color: "#e8a838", padding: "3px 10px", background: "rgba(232,168,56,.06)" }}>
                    {s}
                  </motion.span>
                ))}
              </div>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: "#333", marginTop: 20, letterSpacing: ".1em" }}>
                hint: type "vaibhav" anywhere on the page
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
