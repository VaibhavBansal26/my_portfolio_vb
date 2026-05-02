"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { education } from "@/data/portfolio";

export default function EducationSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="py-16 border-t border-[var(--border)] max-w-6xl mx-auto px-6">
      <span className="section-label">Academic</span>
      <h2 className="font-display text-3xl font-bold mt-2 mb-10">Education</h2>

      <div ref={ref} className="grid md:grid-cols-2 gap-6">
        {education.map((edu, i) => (
          <motion.div
            key={edu.institution}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="border border-[var(--border)] p-8 relative group hover:border-[var(--accent)]/50 transition-colors"
          >
            <div className="absolute top-4 right-4 font-mono text-xs text-[var(--text-muted)]">
              {edu.period}
            </div>

            <span className="section-label">
              {i === 0 ? "Masters" : "Bachelors"}
            </span>

            <h3 className="font-display text-xl font-bold mt-2 group-hover:text-[var(--accent)] transition-colors">
              {edu.institution}
            </h3>

            <p className="text-[var(--text-muted)] text-sm mt-2">{edu.degree}</p>

            <div className="flex items-center gap-4 mt-4">
              <span className="font-mono text-xs text-[var(--text-muted)]">{edu.location}</span>
              {edu.gpa && (
                <span className="font-mono text-xs text-[var(--accent)] border border-[var(--accent)]/30 px-2 py-0.5">
                  {edu.gpa}
                </span>
              )}
            </div>

            <div className="absolute bottom-0 left-0 h-px w-0 bg-[var(--accent)] group-hover:w-full transition-all duration-500" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
