"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { skills } from "@/data/portfolio";
import dynamic from "next/dynamic";
import Link from "next/link";

const SkillSphere = dynamic(() => import("@/components/three/SkillSphere"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[460px] flex items-center justify-center">
      <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}
        className="font-mono text-xs text-[var(--accent)] tracking-widest">
        Initializing skill matrix...
      </motion.p>
    </div>
  ),
});

const groups = [
  { label: "AI / ML", items: skills.ai_ml.slice(0, 4), color: "text-violet-400" },
  { label: "Frontend", items: skills.frontend.slice(0, 4), color: "text-sky-400" },
  { label: "Backend", items: skills.backend.slice(0, 4), color: "text-emerald-400" },
  { label: "DevOps", items: skills.devops.slice(0, 4), color: "text-[var(--accent)]" },
];

export default function SkillsPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="py-24 max-w-6xl mx-auto px-6">
      <div ref={ref} className="grid md:grid-cols-2 gap-16 items-center">
        {/* Sphere */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, rotateY: -10 }}
          animate={inView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <SkillSphere />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <span className="section-label">Tech Stack</span>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold mt-2 leading-tight">
            Skills &<br />
            <span className="gradient-text">Expertise</span>
          </h2>
          <p className="text-[var(--text-muted)] text-sm mt-4 leading-relaxed">
            From production AI systems to scalable full-stack apps — I work
            across the entire product lifecycle, from design through deployment.
          </p>

          <div className="mt-8 space-y-4">
            {groups.map(({ label, items, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                className="flex items-start gap-4"
              >
                <span className={`font-mono text-[10px] uppercase tracking-widest w-20 flex-shrink-0 mt-1 ${color}`}>
                  {label}
                </span>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span key={skill} className="skill-tag text-[10px]">{skill}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
          >
            <Link href="/about#skills"
              className="inline-flex items-center gap-2 mt-8 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors uppercase tracking-wider group">
              View Full Stack
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >→</motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
