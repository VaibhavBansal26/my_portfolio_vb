"use client";
import { motion } from "framer-motion";
import { experience, academicExperience, education, skills, certifications, research, personal } from "@/data/portfolio";
import Link from "next/link";

export default function ResumeView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="border border-[var(--border)] p-8 md:p-12 space-y-12"
    >
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-8">
        <h2 className="font-display text-3xl font-bold">Vaibhav Bansal</h2>
        <p className="text-[var(--accent)] font-mono text-sm mt-1">Software Engineer · AI Engineer</p>
        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3">
          {[
            personal.email,
            personal.location,
            "vaibhavbansal.in",
            "github.com/VaibhavBansal26",
            "linkedin.com/in/vaibhavbansal-profile",
          ].map((item) => (
            <span key={item} className="font-mono text-xs text-[var(--text-muted)]">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Summary */}
      <section>
        <h3 className="section-label mb-3">Summary</h3>
        <p className="text-[var(--text-muted)] text-sm leading-relaxed">
          Software Engineer and AI Engineer with 5+ years of experience building scalable applications
          and AI-powered systems. M.S. in Engineering Science & Data Science from SUNY Buffalo.
          Expert in Python, React, Next.js, Docker, AWS, LangChain, RAG, and cloud-native architectures.
          Proven track record at Wipro Technologies and DashClicks. Research Assistant, Graduate Teaching Assistant, and Graduate Student Assistant at SUNY Buffalo. Open-source npm publisher and published Springer research author.
        </p>
      </section>

      {/* Industry Experience */}
      <section>
        <h3 className="section-label mb-6">Work Experience</h3>
        <div className="space-y-8">
          {experience.map((exp, idx) => (
            <div key={`${exp.company}-${idx}`} className="border-l border-[var(--accent)] pl-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                <div>
                  <p className="font-bold text-[var(--text)]">{exp.role}</p>
                  <p className="text-[var(--accent)] font-mono text-xs">{exp.company} · {exp.location}</p>
                </div>
                <p className="font-mono text-xs text-[var(--text-muted)]">{exp.period}</p>
              </div>
              <p className="text-[var(--text-muted)] text-sm mt-2 leading-relaxed">{exp.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {exp.tech.map((t) => (
                  <span key={t} className="font-mono text-[10px] text-[var(--text-muted)]">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Academic Experience */}
      <section>
        <h3 className="section-label mb-6">Academic Experience</h3>
        <div className="space-y-8">
          {academicExperience.map((exp, idx) => (
            <div key={`${exp.role}-${idx}`} className="border-l-2 pl-6" style={{ borderColor:"#38bdf8" }}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                <div>
                  <p className="font-bold text-[var(--text)]">{exp.role}</p>
                  <p className="font-mono text-xs" style={{ color:"#38bdf8" }}>{exp.company} · {exp.location}</p>
                </div>
                <p className="font-mono text-xs text-[var(--text-muted)]">{exp.period}</p>
              </div>
              <p className="text-[var(--text-muted)] text-sm mt-2 leading-relaxed">{exp.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {exp.tech.map((t) => (
                  <span key={t} className="font-mono text-[10px] text-[var(--text-muted)]">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section>
        <h3 className="section-label mb-6">Education</h3>
        <div className="space-y-5">
          {education.map((edu) => (
            <div key={edu.institution} className="border-l border-[var(--border)] pl-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                <div>
                  <p className="font-bold text-[var(--text)]">{edu.institution}</p>
                  <p className="text-[var(--text-muted)] text-sm">{edu.degree}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs text-[var(--text-muted)]">{edu.period}</p>
                  {edu.gpa && <p className="font-mono text-xs text-[var(--accent)]">{edu.gpa}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h3 className="section-label mb-6">Technical Skills</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {[
            { label: "Languages", items: skills.languages },
            { label: "Frontend", items: skills.frontend },
            { label: "Backend", items: skills.backend },
            { label: "AI / ML", items: skills.ai_ml },
            { label: "Data Engineering", items: skills.data },
            { label: "DevOps & Cloud", items: skills.devops },
          ].map(({ label, items }) => (
            <div key={label} className="flex gap-3">
              <span className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-wider w-28 flex-shrink-0 mt-0.5">
                {label}:
              </span>
              <p className="text-[var(--text-muted)] text-xs">{items.join(", ")}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section>
        <h3 className="section-label mb-6">Certifications</h3>
        <div className="space-y-3">
          {certifications.map((cert) => (
            <div key={cert.title} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{cert.title}</p>
                <p className="font-mono text-xs text-[var(--text-muted)]">{cert.issuer}</p>
              </div>
              <span className="font-mono text-xs text-[var(--text-muted)]">{cert.year}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Research */}
      <section>
        <h3 className="section-label mb-4">Research & Publications</h3>
        {research.map((paper) => (
          <div key={paper.title} className="border-l border-[var(--border)] pl-6">
            <p className="text-sm font-medium leading-snug">{paper.title}</p>
            <p className="font-mono text-xs text-[var(--accent)] mt-1">
              {paper.journal} · {paper.year}
            </p>
            <Link
              href={personal.orcid}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] mt-1 inline-block"
            >
              ORCID: 0000-0002-5433-0385 →
            </Link>
          </div>
        ))}
      </section>

      {/* Open Source */}
      <section>
        <h3 className="section-label mb-4">Open Source</h3>
        <div className="border-l border-[var(--border)] pl-6">
          <p className="font-bold text-sm">grapesjs-advance-components</p>
          <p className="text-[var(--text-muted)] text-xs mt-1">
            Published npm package extending GrapesJS with advanced drag-and-drop UI components.
          </p>
          <Link
            href={personal.npmPackage}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-[var(--accent)] mt-1 inline-block"
          >
            npmjs.com/package/grapesjs-advance-components →
          </Link>
        </div>
      </section>
    </motion.div>
  );
}
