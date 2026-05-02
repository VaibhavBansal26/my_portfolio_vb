"use client";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
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
const fadeUp = { hidden:{ opacity:0, y:24 }, show:{ opacity:1, y:0, transition:{ duration:.5, ease:[.22,1,.36,1] as const } } };

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
              style={{display:"inline-flex",alignItems:"center",gap:6,padding:"9px 18px",background:"#e8a838",color:"#0e0e0e",textDecoration:"none",fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:800,letterSpacing:".1em",textTransform:"uppercase"}}>
              <FiGithub size={12}/> GitHub ↗
            </Link>}
            {(p as any).npm&&<Link href={(p as any).npm} target="_blank" rel="noopener noreferrer"
              style={{display:"inline-flex",alignItems:"center",gap:6,padding:"9px 18px",border:"1px solid rgba(232,168,56,.4)",color:"#e8a838",textDecoration:"none",fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".1em",textTransform:"uppercase",background:"rgba(232,168,56,.05)"}}>
              <SiNpm size={12}/> npm
            </Link>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PCard({ project }: { project: typeof projects[0] }) {
  const cs = CAT[project.category] ?? CAT["AI/ML"];
  const [hov, setHov] = useState(false);
  const [mx, setMx] = useState(50), [my, setMy] = useState(50);
  const [modal, setModal] = useState(false);
  const [vidPlay, setVidPlay] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMx((e.clientX-r.left)/r.width*100);
    setMy((e.clientY-r.top)/r.height*100);
  };

  return (
    <>
      <motion.div variants={fadeUp}
        className="relative overflow-hidden cursor-pointer group"
        style={{ border:"1px solid var(--border)", background:"var(--bg-card)", transition:"border-color .25s, box-shadow .25s, transform .25s" }}
        onMouseEnter={()=>setHov(true)}
        onMouseLeave={()=>{ setHov(false); setVidPlay(false); }}
        onMouseMove={onMove}
        whileHover={{ y:-5, borderColor:cs.border, boxShadow:`0 20px 60px rgba(0,0,0,.5), 0 0 24px ${cs.bg}` }}>

        {/* Top accent bar */}
        <div style={{ height:3, background:`linear-gradient(to right,${cs.color},transparent)` }}/>

        {/* Preview area */}
        <div style={{ height:160, position:"relative", overflow:"hidden", background:cs.grad }}>
          {/* Video on hover */}
          <video src={`/videos/projects/${project.id}.mp4`} autoPlay={vidPlay} muted loop playsInline
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover",
              opacity:vidPlay?1:0, transition:"opacity .5s", zIndex:2 }}
            onError={e=>{(e.currentTarget as HTMLVideoElement).style.display="none";}}/>

          {/* Gradient preview */}
          <div style={{ position:"absolute", inset:0, zIndex:1, display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center", gap:8,
            opacity:vidPlay?0:1, transition:"opacity .5s" }}>
            <div style={{ fontSize:9, color:cs.color, letterSpacing:".1em", textTransform:"uppercase",
              fontFamily:"'JetBrains Mono',monospace" }}>{project.category}</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:4, justifyContent:"center", padding:"0 12px" }}>
              {project.tech.slice(0,3).map(t=>(
                <span key={t} style={{ fontSize:7, border:`1px solid ${cs.border}`, color:cs.color,
                  padding:"2px 6px", background:"rgba(0,0,0,.5)", fontFamily:"'JetBrains Mono',monospace" }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Mouse spotlight */}
          <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:3,
            background:`radial-gradient(circle at ${mx}% ${my}%,${cs.bg} 0%,transparent 55%)`,
            opacity:hov?1:0, transition:"opacity .3s" }}/>

          {/* Action buttons */}
          <div style={{ position:"absolute", top:8, right:8, zIndex:5, display:"flex", gap:4,
            opacity:hov?1:0, transition:"opacity .2s" }}>
            <button onClick={e=>{e.stopPropagation();setVidPlay(v=>!v);}}
              style={{ padding:"4px 7px", background:"rgba(0,0,0,.7)", border:`1px solid ${cs.border}`,
                color:cs.color, cursor:"pointer", backdropFilter:"blur(4px)" }}>
              <FiPlay size={9}/>
            </button>
            <button onClick={e=>{e.stopPropagation();setModal(true);}}
              style={{ padding:"4px 7px", background:"rgba(0,0,0,.7)", border:`1px solid ${cs.border}`,
                color:cs.color, cursor:"pointer", backdropFilter:"blur(4px)" }}>
              <FiMaximize2 size={9}/>
            </button>
          </div>

          {/* Category badge */}
          <div style={{ position:"absolute", top:10, left:10, zIndex:5 }}>
            <span style={{ fontSize:7, background:cs.bg, border:`1px solid ${cs.border}`, color:cs.color,
              padding:"2px 8px", letterSpacing:".15em", textTransform:"uppercase",
              fontFamily:"'JetBrains Mono',monospace" }}>{project.category}</span>
          </div>

          {/* Bottom corner brackets */}
          {[{bottom:8,left:8},{bottom:8,right:8}].map((pos,i)=>(
            <div key={i} style={{ position:"absolute", width:10, height:10, ...pos, zIndex:4,
              borderBottom:`1.5px solid ${cs.border}`,
              borderLeft:i===0?`1.5px solid ${cs.border}`:undefined,
              borderRight:i===1?`1.5px solid ${cs.border}`:undefined }}/>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding:"14px 14px 10px" }} onClick={()=>setModal(true)}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:6, marginBottom:6 }}>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800,
              color:hov?cs.color:"var(--text)", lineHeight:1.25, transition:"color .2s", flex:1 }}>
              {project.title}
            </h3>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8,
              color:"var(--text-muted)", flexShrink:0, marginTop:1 }}>{project.year}</span>
          </div>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"var(--text-muted)",
            lineHeight:1.6, marginBottom:10 }}>
            {project.description.slice(0,80)}...
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
            {project.tech.slice(0,3).map(t=>(
              <span key={t} style={{ fontSize:7, border:"1px solid var(--border)", color:"var(--text-muted)",
                padding:"2px 6px", fontFamily:"'JetBrains Mono',monospace" }}>{t}</span>
            ))}
            {project.tech.length>3&&<span style={{ fontSize:7, color:"var(--text-muted)",
              fontFamily:"'JetBrains Mono',monospace" }}>+{project.tech.length-3}</span>}
          </div>
        </div>

        {/* Bottom action bar */}
        <div style={{ padding:"8px 14px", borderTop:"1px solid var(--border)", background:"var(--surface)",
          display:"flex", alignItems:"center", gap:8 }}>
          {project.github&&(
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              onClick={e=>e.stopPropagation()}
              style={{ color:"var(--text-muted)", transition:"color .2s", display:"flex" }}
              onMouseEnter={e=>((e.currentTarget as HTMLAnchorElement).style.color=cs.color)}
              onMouseLeave={e=>((e.currentTarget as HTMLAnchorElement).style.color="var(--text-muted)")}>
              <FiGithub size={13}/>
            </a>
          )}
          {(project as any).npm&&(
            <a href={(project as any).npm} target="_blank" rel="noopener noreferrer"
              onClick={e=>e.stopPropagation()}
              style={{ color:"var(--text-muted)", transition:"color .2s", display:"flex" }}
              onMouseEnter={e=>((e.currentTarget as HTMLAnchorElement).style.color=cs.color)}
              onMouseLeave={e=>((e.currentTarget as HTMLAnchorElement).style.color="var(--text-muted)")}>
              <SiNpm size={13}/>
            </a>
          )}
          <div style={{ flex:1 }}/>
          <div style={{ display:"flex", gap:8 }}>
            <motion.span animate={{ opacity:hov?1:0, x:hov?0:4 }} transition={{ duration:.18 }}
              style={{ fontSize:8, color:cs.color, fontFamily:"'JetBrains Mono',monospace", cursor:"pointer" }}
              onClick={()=>setModal(true)}>
              Preview ⤢
            </motion.span>
            <Link href={`/projects/${project.id}`}
              onClick={e=>e.stopPropagation()}
              style={{ fontSize:8, color:"#e8a838", fontFamily:"'JetBrains Mono',monospace",
                textDecoration:"none", opacity:hov?1:0, transition:"opacity .18s" }}>
              Case Study →
            </Link>
          </div>
        </div>

        {/* Bottom sweep line */}
        <motion.div animate={{ scaleX:hov?1:0 }} transition={{ duration:.4 }}
          style={{ position:"absolute", bottom:0, left:0, right:0, height:1, originX:0,
            background:`linear-gradient(to right,transparent,${cs.color},transparent)` }}/>
      </motion.div>

      <AnimatePresence>{modal&&<Modal p={project} onClose={()=>setModal(false)}/>}</AnimatePresence>
    </>
  );
}

export default function FeaturedProjects() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once:true, amount:.05 });

  return (
    <section ref={ref} className="py-24 max-w-6xl mx-auto px-6">
      <motion.div variants={stagger} initial="hidden" animate={inView?"show":"hidden"}>
        {/* Header */}
        <motion.div variants={fadeUp} style={{ display:"flex", alignItems:"flex-end",
          justifyContent:"space-between", marginBottom:36 }}>
          <div>
            <span className="section-label">Selected Work</span>
            <h2 className="font-display font-extrabold mt-2" style={{ fontSize:"clamp(2rem,4vw,3rem)" }}>
              Featured{" "}
              <span style={{ background:"linear-gradient(120deg,#e8a838,#f4c96a)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                Projects
              </span>
            </h2>
          </div>
          <Link href="/portfolio" className="hidden md:inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider"
            style={{ color:"var(--text-muted)", textDecoration:"none", transition:"color .2s" }}
            onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.color="#e8a838"}
            onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.color="var(--text-muted)"}>
            All Projects <FiArrowRight size={13}/>
          </Link>
        </motion.div>

        {/* 3 columns × 2 rows = 6 cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
          {featured.map(p => <PCard key={p.id} project={p}/>)}
        </div>
      </motion.div>
    </section>
  );
}
