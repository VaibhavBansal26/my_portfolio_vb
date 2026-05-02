"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { projects } from "@/data/portfolio";
import { FiGithub, FiExternalLink, FiPlay, FiImage, FiX, FiSearch } from "react-icons/fi";
import { SiNpm } from "react-icons/si";

const categories = ["All", "AI/ML", "Full Stack", "Data Engineering", "Open Source"];

const categoryStyle: Record<string, string> = {
  "AI/ML":             "text-violet-400 border-violet-400/40 bg-violet-400/5",
  "Data Engineering":  "text-sky-400 border-sky-400/40 bg-sky-400/5",
  "Full Stack":        "text-emerald-400 border-emerald-400/40 bg-emerald-400/5",
  "Open Source":       "text-[var(--accent)] border-[var(--accent)]/40 bg-[var(--accent)]/5",
};

const previewGradients: Record<string, string> = {
  "disaster-copilot":     "from-violet-900/60 to-blue-900/60",
  "salary-prediction":    "from-sky-900/60 to-cyan-900/60",
  "heart-disease":        "from-rose-900/60 to-pink-900/60",
  "amazon-clone":         "from-orange-900/60 to-amber-900/60",
  "natural-disaster-pred":"from-emerald-900/60 to-teal-900/60",
  "grapesjs-plugin":      "from-indigo-900/60 to-purple-900/60",
  "portfolio-v1":         "from-slate-900/60 to-blue-900/60",
};

function ProjectMedia({ project }: { project: typeof projects[0] }) {
  const [mode, setMode] = useState<"image" | "video">("image");
  return (
    <div className="relative aspect-video bg-[var(--bg)] overflow-hidden group/media">
      <AnimatePresence mode="wait">
        {mode === "image" ? (
          <motion.div key="image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className={`absolute inset-0 bg-gradient-to-br ${previewGradients[project.id] ?? "from-slate-900 to-blue-900"} flex flex-col items-center justify-center gap-3`}>
            <div className="absolute top-3 left-3 w-5 h-5 border-l-2 border-t-2 border-[var(--accent)]/60" />
            <div className="absolute top-3 right-3 w-5 h-5 border-r-2 border-t-2 border-[var(--accent)]/60" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-l-2 border-b-2 border-[var(--accent)]/60" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-r-2 border-b-2 border-[var(--accent)]/60" />
            <p className="font-display text-lg font-bold text-white z-10 text-center px-4">{project.title}</p>
            <div className="flex flex-wrap gap-1.5 justify-center z-10 px-4">
              {project.tech.slice(0, 3).map(t => (
                <span key={t} className="font-mono text-[9px] px-1.5 py-0.5 border border-[var(--accent)]/30 text-[var(--accent)]/70">{t}</span>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black flex items-center justify-center">
            <video src={`/videos/projects/${project.id}.mp4`} autoPlay muted loop playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
              <FiPlay size={32} className="text-[var(--accent)] mb-2" />
              <p className="font-mono text-xs text-[var(--text-muted)] text-center px-4">Add demo at /public/videos/projects/{project.id}.mp4</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute bottom-3 right-3 z-20 opacity-0 group-hover/media:opacity-100 transition-opacity flex gap-1">
        <button onClick={() => setMode("image")}
          className={`p-1.5 border text-[9px] transition-all ${mode === "image" ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/5" : "border-[var(--border)] text-[var(--text-muted)] bg-black/60"}`}>
          <FiImage size={11} />
        </button>
        <button onClick={() => setMode("video")}
          className={`p-1.5 border text-[9px] transition-all ${mode === "video" ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/5" : "border-[var(--border)] text-[var(--text-muted)] bg-black/60"}`}>
          <FiPlay size={11} />
        </button>
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: typeof projects[0]; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-bright)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
          <FiX size={20} />
        </button>
        <ProjectMedia project={project} />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className={`font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 border ${categoryStyle[project.category] ?? ""}`}>
              {project.category}
            </span>
            <span className="font-mono text-[10px] text-[var(--text-muted)] ml-auto">{project.year}</span>
          </div>
          <h3 className="font-display text-2xl font-bold text-[var(--text)]">{project.title}</h3>
          <p className="text-[var(--text-muted)] text-sm mt-3 leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tech.map(t => <span key={t} className="skill-tag">{t}</span>)}
          </div>
          <div className="flex gap-4 mt-6 pt-4 border-t border-[var(--border)]">
            {project.github && <Link href={project.github} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
              <FiGithub size={14} /> GitHub
            </Link>}
            {(project as any).npm && <Link href={(project as any).npm} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
              <SiNpm size={14} /> npm
            </Link>}
            {(project as any).live && <Link href={(project as any).live} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
              <FiExternalLink size={14} /> Live Demo
            </Link>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectsGrid() {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<typeof projects[0] | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const byCat = active === "All" ? projects : projects.filter(p => p.category === active);
    if (!q) return byCat;
    return byCat.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tech.some(t => t.toLowerCase().includes(q))
    );
  }, [active, query]);

  return (
    <>
      {/* Search */}
      <div className="relative mb-6">
        <FiSearch size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search projects, tech stack..."
          className="w-full pl-10 pr-10 py-3 bg-transparent border border-[var(--border)] text-[var(--text)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-muted)]" />
        {query && <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--accent)]"><FiX size={14} /></button>}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat, i) => (
          <motion.button key={cat} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            onClick={() => setActive(cat)}
            className={`font-mono text-xs px-4 py-2 border tracking-wider uppercase transition-all ${active === cat ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10" : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)]/50"}`}>
            {cat}
          </motion.button>
        ))}
        <span className="ml-auto font-mono text-xs text-[var(--text-muted)] self-center">{filtered.length} projects</span>
      </div>

      {/* Grid */}
      <motion.div ref={ref} layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <motion.div key={project.id} layout
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
              exit={{ opacity: 0, scale: 0.93 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              onClick={() => setSelected(project)}
              className="group border border-[var(--border)] bg-[var(--bg-card)] cursor-pointer card-glow overflow-hidden">
              <div className="pointer-events-none"><ProjectMedia project={project} /></div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-mono text-[9px] tracking-widest uppercase px-1.5 py-0.5 border ${categoryStyle[project.category] ?? "border-[var(--border)] text-[var(--text-muted)]"}`}>
                    {project.category}
                  </span>
                  {project.featured && (
                    <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  )}
                </div>
                <h3 className="font-display text-base font-bold group-hover:text-[var(--accent)] transition-colors leading-snug">{project.title}</h3>
                <p className="text-[var(--text-muted)] text-xs mt-2 leading-relaxed line-clamp-3">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.tech.slice(0, 4).map(t => (
                    <span key={t} className="font-mono text-[9px] px-1.5 py-0.5 border border-[var(--border)] text-[var(--text-muted)]">{t}</span>
                  ))}
                  {project.tech.length > 4 && <span className="font-mono text-[9px] text-[var(--text-muted)]">+{project.tech.length - 4}</span>}
                </div>
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[var(--border)]">
                  {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"><FiGithub size={14} /></a>}
                  {(project as any).npm && <a href={(project as any).npm} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"><SiNpm size={14} /></a>}
                  <span className="ml-auto font-mono text-[9px] text-[var(--text-muted)]">{project.year}</span>
                  <Link href={`/projects/${project.id}`} onClick={e=>e.stopPropagation()}
                    className="font-mono text-[9px] text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ textDecoration:"none" }}>
                    Case Study →
                  </Link>
                </div>
              </div>
              <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, var(--accent), transparent)", opacity: 0 }} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <p className="mt-8 font-mono text-xs text-[var(--text-muted)] text-center">
        {filtered.length} projects ·{" "}
        <Link href="https://github.com/VaibhavBansal26" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover-underline">
          95+ repos on GitHub →
        </Link>
      </p>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}
