"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * #20(8) Autopilot — "Let FRIDAY drive": narrated auto-scroll tour.
 * Any user scroll/keypress grabs the wheel back. Voice via speechSynthesis.
 */
const STOPS: { selector: string; say: string }[] = [
  { selector: "body", say: "Hi, I'm FRIDAY. Let me show you around Vaibhav's work. Sit back." },
  { selector: "#vb-stop-bento",      say: "Five plus years in production. Ninety five repositories. Two hundred LeetCode problems. The numbers check out." },
  { selector: "#vb-stop-projects",   say: "Selected work. Hover any row for a live preview — these systems are deployed, not demos." },
  { selector: "#vb-stop-research",   say: "Published research with Springer Nature. Deep learning, applied during the pandemic." },
  { selector: "#vb-stop-times",      say: "And yes — that is actually him on a Times Square billboard." },
  { selector: "footer",              say: "Channel's open, boss. The email is right there. Tour complete." },
];

function speak(text: string): Promise<void> {
  return new Promise(resolve => {
    if (!window.speechSynthesis) { setTimeout(resolve, 2600); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.pitch = 0.9; u.rate = 0.98; u.volume = 0.9;
    const voices = window.speechSynthesis.getVoices();
    u.voice = voices.find(v => v.lang === "en-IE") ||
              voices.find(v => v.name === "Google UK English Female") ||
              voices.find(v => v.lang === "en-GB") || voices[0] || null;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

export default function FridayTour() {
  const [driving, setDriving] = useState(false);
  const [caption, setCaption] = useState("");
  const abort = useRef(false);

  const stop = useCallback(() => {
    abort.current = true;
    window.speechSynthesis?.cancel();
    setDriving(false); setCaption("");
  }, []);

  const start = useCallback(async () => {
    if (driving) return;
    abort.current = false;
    setDriving(true);
    for (const s of STOPS) {
      if (abort.current) return;
      const el = document.querySelector(s.selector);
      if (el && s.selector !== "body") el.scrollIntoView({ behavior: "smooth", block: "center" });
      if (s.selector === "body") window.scrollTo({ top: 0, behavior: "smooth" });
      setCaption(s.say);
      await speak(s.say);
      if (abort.current) return;
      await new Promise(r => setTimeout(r, 400));
    }
    setDriving(false); setCaption("");
  }, [driving]);

  // user grabs the wheel
  useEffect(() => {
    if (!driving) return;
    const grab = () => stop();
    window.addEventListener("wheel", grab, { passive: true });
    window.addEventListener("touchmove", grab, { passive: true });
    window.addEventListener("keydown", grab);
    return () => {
      window.removeEventListener("wheel", grab);
      window.removeEventListener("touchmove", grab);
      window.removeEventListener("keydown", grab);
    };
  }, [driving, stop]);

  useEffect(() => {
    const onStart = () => start();
    window.addEventListener("vb-tour-start", onStart);
    return () => window.removeEventListener("vb-tour-start", onStart);
  }, [start]);

  return (
    <AnimatePresence>
      {driving && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          className="fixed left-1/2 -translate-x-1/2 z-[140] flex items-center gap-3"
          style={{ bottom: 80, maxWidth: "min(560px, calc(100vw - 40px))",
            background: "rgba(10,12,14,.92)", backdropFilter: "blur(12px)",
            border: "1px solid var(--hud-line)", padding: "12px 18px" }}>
          <motion.span animate={{ opacity: [1, .3, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
            className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "var(--reactor)" }} />
          <p className="font-mono text-[11px]" style={{ color: "var(--text)" }}>{caption}</p>
          <button onClick={stop} className="font-mono text-[9px] uppercase tracking-wider flex-shrink-0"
            style={{ padding: "5px 10px", border: "1px solid var(--border-bright)",
              background: "transparent", color: "var(--text-muted)", cursor: "pointer" }}>
            take the wheel
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
