"use client";
import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const spring = useSpring(progress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? scrolled / total : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0,
      height: 2, zIndex: 9999, background: "transparent",
    }}>
      {/* Track */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(232,168,56,.08)" }} />
      {/* Progress bar */}
      <motion.div style={{
        position: "absolute", top: 0, left: 0, bottom: 0,
        background: "linear-gradient(to right, #e8a838, #f4c96a, #e8a838)",
        scaleX: spring, transformOrigin: "left",
        boxShadow: "0 0 8px rgba(232,168,56,.6), 0 0 20px rgba(232,168,56,.2)",
        width: "100%",
      }} />
      {/* Glow dot at tip */}
      <motion.div style={{
        position: "absolute", top: -2, width: 6, height: 6,
        borderRadius: "50%", background: "#e8a838",
        boxShadow: "0 0 10px #e8a838, 0 0 20px rgba(232,168,56,.5)",
        left: spring.get() < 1 ? `calc(${progress * 100}% - 3px)` : "calc(100% - 3px)",
      }} />
    </div>
  );
}
