"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { skills } from "@/data/portfolio";

const skillGroups = [
  { label: "Languages", items: skills.languages, color: "text-yellow-400" },
  { label: "Frontend", items: skills.frontend, color: "text-blue-400" },
  { label: "Backend", items: skills.backend, color: "text-green-400" },
  { label: "AI / ML", items: skills.ai_ml, color: "text-purple-400" },
  { label: "Data Engineering", items: skills.data, color: "text-orange-400" },
  { label: "DevOps & Cloud", items: skills.devops, color: "text-[var(--accent)]" },
  { label: "Tools", items: skills.tools, color: "text-pink-400" },
];

export default function FullSkillsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="skills" className="py-16 border-t border-[var(--border)] max-w-6xl mx-auto px-6">
      <span className="section-label">Expertise</span>
      <h2 className="font-display text-3xl font-bold mt-2 mb-10">Technical Skills</h2>

      <div ref={ref} className="space-y-8">
        {skillGroups.map(({ label, items, color }, gi) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: gi * 0.07 }}
            className="flex flex-col md:flex-row gap-4 md:gap-8"
          >
            <div className="w-32 flex-shrink-0">
              <span className={`font-mono text-xs tracking-widest uppercase ${color}`}>
                {label}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <span
                  key={skill}
                  className="skill-tag hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
