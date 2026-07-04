"use client";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { stats } from "@/data/portfolio";

export default function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  return (
    <section ref={ref} className="border-y border-[var(--border)] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to right, transparent, var(--accent-glow), transparent)", opacity: 0.6 }} />
      {/* FRIDAY · reactor scan sweeps across as the counters run */}
      {inView && (
        <motion.div initial={{ left: "-15%" }} animate={{ left: "115%" }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
          className="absolute pointer-events-none"
          style={{ top: 0, bottom: 0, width: "12%",
            background: "linear-gradient(to right, transparent, var(--hologram), transparent)",
            borderRight: "1px solid var(--reactor-dim)" }} />
      )}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[var(--border)]">
          {stats.map(({ label, value }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center px-6 py-6">
              <p className="font-display text-5xl font-extrabold gradient-text glow-text">
                {inView ? <CountUp end={value} duration={2.5} /> : "0"}<span className="text-3xl">+</span>
              </p>
              <p className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase mt-2">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
