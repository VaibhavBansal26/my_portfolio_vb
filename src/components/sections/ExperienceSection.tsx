"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { experience, academicExperience } from "@/data/portfolio";

function TimelineList({
  items,
  startIndex = 0,
  accentColor = "#e8a838",
}: {
  items: typeof experience;
  startIndex?: number;
  accentColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div ref={ref} style={{ display:"flex", flexDirection:"column", gap:0 }}>
      {items.map((exp, i) => (
        <motion.div key={`${exp.company}-${startIndex + i}`}
          initial={{ opacity:0, x:-24 }}
          animate={inView ? { opacity:1, x:0 } : {}}
          transition={{ duration:.5, delay:i*.12 }}
          style={{ display:"grid", gridTemplateColumns:"120px 1fr", gap:0, paddingBottom:36, position:"relative" }}>

          {/* Left: date + dot */}
          <div style={{ paddingRight:24, paddingTop:4, textAlign:"right", position:"relative" }}>
            <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"var(--text-muted)",
              lineHeight:1.4, marginBottom:4 }}>{exp.period}</p>
            <div style={{ position:"absolute", right:-8, top:6, width:14, height:14,
              borderRadius:"50%", background:accentColor, border:"3px solid var(--bg)",
              boxShadow:`0 0 0 1px ${accentColor}4d, 0 0 12px ${accentColor}4d`, zIndex:2 }}/>
            {i < items.length - 1 && (
              <div style={{ position:"absolute", right:-1, top:20, bottom:-36, width:1,
                background:`linear-gradient(to bottom,${accentColor}80,${accentColor}1a)` }}/>
            )}
          </div>

          {/* Right: card */}
          <div style={{ paddingLeft:28 }}>
            <div style={{ border:"1px solid var(--border)", background:"var(--bg-card)",
              padding:"20px 22px", position:"relative", overflow:"hidden",
              transition:"border-color .3s, box-shadow .3s" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${accentColor}66`;
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,.3)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}>
              <div style={{ position:"absolute", top:0, left:0, bottom:0, width:3,
                background:`linear-gradient(to bottom,${accentColor},${accentColor}33)` }}/>
              <div style={{ position:"absolute", top:-10, right:12, fontFamily:"'Syne',sans-serif",
                fontSize:56, fontWeight:800, color:`${accentColor}0a`, lineHeight:1,
                userSelect:"none", pointerEvents:"none" }}>
                {String(startIndex + i + 1).padStart(2, "0")}
              </div>
              <div style={{ paddingLeft:14 }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8, marginBottom:4 }}>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800,
                    color:"var(--text)", lineHeight:1.25 }}>{exp.role}</h3>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11,
                    color:accentColor, fontWeight:600 }}>{exp.company}</span>
                  {exp.location && (
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9,
                      color:"var(--text-muted)" }}>· {exp.location}</span>
                  )}
                </div>
                <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-muted)",
                  lineHeight:1.7, marginBottom:12 }}>{exp.description}</p>
                {exp.tech && (
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {exp.tech.map(t => (
                      <span key={t} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8,
                        border:"1px solid var(--border)", color:"var(--text-muted)", padding:"2px 7px" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function ExperienceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });

  return (
    <div ref={ref} className="py-16" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Industry Experience */}
        <motion.div
          initial={{ opacity:0, y:20 }} animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:.5 }} className="mb-12">
          <span className="section-label">Career</span>
          <h2 className="font-display font-extrabold mt-2"
            style={{ fontSize:"clamp(1.8rem,3.5vw,2.8rem)" }}>
            Work{" "}
            <span style={{ background:"linear-gradient(120deg,#e8a838,#f4c96a)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              Experience
            </span>
          </h2>
        </motion.div>

        <TimelineList items={experience} startIndex={0} accentColor="#e8a838" />

        {/* Academic Experience */}
        <motion.div
          initial={{ opacity:0, y:20 }} animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:.5, delay:.2 }}
          style={{ marginTop:56, marginBottom:40 }}>
          <span className="section-label">Academia</span>
          <h2 className="font-display font-extrabold mt-2"
            style={{ fontSize:"clamp(1.8rem,3.5vw,2.8rem)" }}>
            Academic{" "}
            <span style={{ background:"linear-gradient(120deg,#38bdf8,#7dd3fc)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              Roles
            </span>
          </h2>
          <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10,
            color:"var(--text-muted)", marginTop:6 }}>
            University at Buffalo (SUNY) · 2024 – Present
          </p>
        </motion.div>

        <TimelineList items={academicExperience} startIndex={experience.length} accentColor="#38bdf8" />

      </div>
    </div>
  );
}
