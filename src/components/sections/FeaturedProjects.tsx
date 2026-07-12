"use client";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { projects } from "@/data/portfolio";
import { FiGithub, FiExternalLink, FiArrowRight, FiX, FiPlay, FiMaximize2 } from "react-icons/fi";
import { SiNpm } from "react-icons/si";

const featured = projects.filter(p => p.featured).slice(0, 6);

const CAT: Record<string, { color: string; border: string; bg: string; grad: string }> = {
  "AI/ML":            { color:"#c084fc", border:"rgba(168,85,247,.5)", bg:"rgba(168,85,247,.1)", grad:"linear-gradient(135deg,#0d0820,#1a0e35,#080d1f)" },
  "Data Engineering": { color:"#38bdf8", border:"rgba(14,165,233,.5)",  bg:"rgba(14,165,233,.1)", grad:"linear-gradient(135deg,#020e1a,#051e35,#010810)" },
  "Full Stack":       { color:"#34d399", border:"rgba(52,211,153,.5)",  bg:"rgba(52,211,153,.1)", grad:"linear-gradient(135deg,#021a0a,#053518,#010e05)" },
  "Open Source":      { color:"#e8a838", border:"rgba(232,168,56,.5)",  bg:"rgba(232,168,56,.1)", grad:"linear-gradient(135deg,#1a0e00,#2d1800,#0e0700)" },
};

const stagger = { hidden:{}, show:{ transition:{ staggerChildren:.07, delayChildren:.05 } } };
const fadeUp = { hidden:{ opacity:0, y:24 }, show:{ opacity:1, y:0, transition:{ duration:.55, ease:[.22,1,.36,1] as const } } };

function Modal({ p, onClose }: { p: typeof projects[0]; onClose: () => void }) {
  const cs = CAT[p.category] ?? CAT["AI/ML"];
  const [mode, setMode] = useState<"preview"|"video">("preview");
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{background:"rgba(0,0,0,.9)", backdropFilter:"blur(16px)"}} onClick={onClose}>
      <motion.div initial={{scale:.9,y:20}} animate={{scale:1,y:0}} exit={{scale:.9,y:20}}
        transition={{duration:.3,ease:[.22,1,.36,1]}}
        className="relative w-full max-w-2xl overflow-hidden"
        style={{background:"#0a0a0a",border:`1px solid ${cs.border}`,boxShadow:`0 0 80px ${cs.bg}`}}
        onClick={e=>e.stopPropagation()}>
        <div style={{height:4,background:`linear-gradient(to right,${cs.color},transparent)`}}/>
        <div style={{padding:"12px 16px",borderBottom:"1px solid #111",background:"#060606",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:8,background:cs.bg,border:`1px solid ${cs.border}`,color:cs.color,padding:"3px 10px",letterSpacing:".15em",textTransform:"uppercase",fontFamily:"'JetBrains Mono',monospace"}}>{p.category}</span>
            <span style={{fontSize:8,color:"#555",fontFamily:"'JetBrains Mono',monospace"}}>{p.year}</span>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={()=>setMode(m=>m==="preview"?"video":"preview")}
              style={{background:"transparent",border:`1px solid ${cs.border}`,color:cs.color,padding:"4px 10px",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:8}}>
              {mode==="preview"?"▶ Video":"◼ Preview"}
            </button>
            <button onClick={onClose} style={{background:"transparent",border:"none",color:"#555",cursor:"pointer"}}><FiX size={16}/></button>
          </div>
        </div>
        <div style={{height:220,position:"relative",overflow:"hidden",background:cs.grad}}>
          <video src={`/videos/projects/${p.id}.mp4`} autoPlay={mode==="video"} muted loop playsInline
            style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:mode==="video"?1:0,transition:"opacity .4s"}}
            onError={e=>{(e.currentTarget as HTMLVideoElement).style.display="none";}}/>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,opacity:mode==="preview"?1:0,transition:"opacity .4s"}}>
            <div style={{fontSize:10,color:cs.color,letterSpacing:".1em",textTransform:"uppercase",fontFamily:"'JetBrains Mono',monospace"}}>{p.category}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",padding:"0 20px"}}>
              {p.tech.slice(0,6).map(t=><span key={t} style={{fontSize:9,border:`1px solid ${cs.border}`,color:cs.color,padding:"3px 8px",background:cs.bg,fontFamily:"'JetBrains Mono',monospace"}}>{t}</span>)}
            </div>
          </div>
          {[{top:8,left:8},{top:8,right:8},{bottom:8,left:8},{bottom:8,right:8}].map((pos,i)=>(
            <div key={i} style={{position:"absolute",width:14,height:14,...pos,zIndex:4,
              borderTop:i<2?`1.5px solid ${cs.color}`:undefined,borderBottom:i>=2?`1.5px solid ${cs.color}`:undefined,
              borderLeft:i%2===0?`1.5px solid ${cs.color}`:undefined,borderRight:i%2===1?`1.5px solid ${cs.color}`:undefined}}/>
          ))}
        </div>
        <div style={{padding:"18px 18px 20px"}}>
          <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:"#f0ece4",marginBottom:10}}>{p.title}</h3>
          <p style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:"#9ca3af",lineHeight:1.75,marginBottom:14}}>{p.description}</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
            {p.tech.map(t=><span key={t} style={{fontSize:8,border:"1px solid #1e1e1e",color:"#555",padding:"2px 7px",fontFamily:"'JetBrains Mono',monospace"}}>{t}</span>)}
          </div>
          <div style={{display:"flex",gap:10,paddingTop:12,borderTop:"1px solid #1a1a1a"}}>
            {p.github&&<Link href={p.github} target="_blank" rel="noopener noreferrer"
              style={{display:"inline-flex",alignItems:"center",gap:6,padding:"9px 18px",background:"var(--hard-accent,#e8a838)",color:"var(--hard-accent-contrast,#0e0e0e)",textDecoration:"none",fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:800,letterSpacing:".1em",textTransform:"uppercase"}}>
              <FiGithub size={12}/> GitHub ↗
            </Link>}
            {(p as any).npm&&<Link href={(p as any).npm} target="_blank" rel="noopener noreferrer"
              style={{display:"inline-flex",alignItems:"center",gap:6,padding:"9px 18px",border:"1px solid var(--hard-accent-soft, rgba(232,168,56,.4))",color:"var(--hard-accent,#e8a838)",textDecoration:"none",fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".1em",textTransform:"uppercase",background:"rgba(232,168,56,.05)"}}>
              <SiNpm size={12}/> npm
            </Link>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}


/* ═══════════ 2026 editorial index — rows + cursor-following preview ═══════════ */

function FloatingPreview({ project }: { project: typeof projects[0] | null }) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div key={project.id}
          initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: .95 }} transition={{ duration: .25, ease: [.22,1,.36,1] }}
          style={{ width: 340, height: 215, overflow: "hidden", position: "relative",
            background: (CAT[project.category] ?? CAT["AI/ML"]).grad,
            border: "1px solid var(--border-bright)", boxShadow: "0 30px 80px rgba(0,0,0,.55)" }}>
          <video src={`/videos/projects/${project.id}.mp4`} autoPlay muted loop playsInline
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}
            onError={e => { (e.currentTarget as HTMLVideoElement).style.display = "none"; }} />
          <div style={{ position:"absolute", left:10, bottom:8, display:"flex", gap:6, zIndex:2 }}>
            {project.tech.slice(0,3).map(t => (
              <span key={t} className="font-mono" style={{ fontSize:8, padding:"2px 7px",
                background:"rgba(0,0,0,.65)", color:(CAT[project.category] ?? CAT["AI/ML"]).color,
                border:`1px solid ${(CAT[project.category] ?? CAT["AI/ML"]).border}` }}>{t}</span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IndexRow({ project, i, onHover, onLeave, onOpen }: {
  project: typeof projects[0]; i: number;
  onHover: () => void; onLeave: () => void; onOpen: () => void;
}) {
  const cs = CAT[project.category] ?? CAT["AI/ML"];
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: .55, delay: i * .06, ease: [.22,1,.36,1] }}
      onMouseEnter={() => { setHov(true); onHover(); }}
      onMouseLeave={() => { setHov(false); onLeave(); }}
      onClick={onOpen}
      role="button" tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onOpen()}
      style={{ display: "grid", gridTemplateColumns: "70px 1fr auto", alignItems: "baseline",
        gap: 24, padding: "30px 8px", cursor: "pointer",
        borderBottom: "1px solid var(--border)", position: "relative" }}>
      {/* accent wipe on hover */}
      <motion.div animate={{ scaleX: hov ? 1 : 0 }} transition={{ duration: .45, ease: [.22,1,.36,1] }}
        style={{ position:"absolute", left:0, right:0, bottom:-1, height:1,
          background: cs.color, transformOrigin: "left" }} />
      <span className="font-mono" style={{ fontSize: 12, color: hov ? cs.color : "var(--text-muted)",
        transition: "color .25s" }}>
        {String(i+1).padStart(2,"0")}
      </span>
      <motion.h3 animate={{ x: hov ? 16 : 0 }} transition={{ duration: .35, ease: [.22,1,.36,1] }}
        className="font-display font-extrabold"
        style={{ fontSize: "clamp(1.4rem,3.2vw,2.6rem)", lineHeight: 1.1,
          color: hov ? "var(--text)" : "var(--text-muted)", transition: "color .25s" }}>
        {project.title}
      </motion.h3>
      <div className="hidden md:flex items-baseline gap-5 font-mono"
        style={{ fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase" }}>
        <span style={{ color: cs.color }}>{project.category}</span>
        <span style={{ color: "var(--text-muted)" }}>{project.year}</span>
        <motion.span animate={{ x: hov ? 4 : 0, opacity: hov ? 1 : .4 }}
          style={{ color: "var(--text)" }}>↗</motion.span>
      </div>
    </motion.div>
  );
}

export default function FeaturedProjects() {
  const [active, setActive] = useState<typeof projects[0] | null>(null);
  const [modal, setModal] = useState<typeof projects[0] | null>(null);
  const [fine, setFine] = useState(false);

  // cursor-follow springs
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 220, damping: 26, mass: .6 });
  const py = useSpring(my, { stiffness: 220, damping: 26, mass: .6 });

  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
    const move = (e: MouseEvent) => { mx.set(e.clientX + 28); my.set(e.clientY - 110); };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [mx, my]);

  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:.6 }}
          style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:24 }}>
          <div>
            <span className="section-label">Selected Work</span>
            <h2 className="font-display font-extrabold mt-2"
              style={{ fontSize:"clamp(2.4rem,5vw,4rem)", lineHeight:1 }}>
              featured{" "}
              <span style={{ background:"linear-gradient(120deg,var(--hard-accent,#e8a838),var(--hard-accent-2,#f4c96a))",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                projects
              </span>
            </h2>
          </div>
          <Link href="/portfolio" className="hidden md:inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider hover-underline"
            style={{ color:"var(--text-muted)", textDecoration:"none" }}>
            All Projects <FiArrowRight size={13}/>
          </Link>
        </motion.div>

        {/* Index list */}
        <div style={{ borderTop: "1px solid var(--border)" }}>
          {featured.map((p, i) => (
            <IndexRow key={p.id} project={p} i={i}
              onHover={() => setActive(p)} onLeave={() => setActive(null)}
              onOpen={() => { setActive(null); setModal(p); }} />
          ))}
        </div>

        <p className="font-mono text-[9px] tracking-[.25em] uppercase mt-4 md:hidden"
          style={{ color: "var(--text-muted)" }}>tap a project for details</p>
      </div>

      {/* Cursor-following preview (fine pointers only) */}
      {fine && (
        <motion.div className="hidden lg:block"
          style={{ position: "fixed", top: 0, left: 0, x: px, y: py,
            zIndex: 80, pointerEvents: "none" }}>
          <FloatingPreview project={modal ? null : active} />
        </motion.div>
      )}

      <AnimatePresence>
        {modal && <Modal p={modal} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </section>
  );
}
