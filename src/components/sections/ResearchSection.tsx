"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { research, personal } from "@/data/portfolio";

const up = { hidden:{opacity:0,y:28}, show:{opacity:1,y:0,transition:{duration:.6,ease:[.22,1,.36,1] as const}} };
const stagger = { hidden:{}, show:{ transition:{ staggerChildren:.1, delayChildren:.15 } } };

/* WebGL subtle amber glow behind magazine */
const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
const FRAG = `
precision mediump float;
uniform float t; uniform vec2 res;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
float n(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p*=2.1;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/res;
  float f=fbm(uv*2.+vec2(t*.08,t*.06));
  vec3 c=mix(vec3(.04,.02,.0),vec3(.5,.28,.04),clamp(f*2.,0.,1.));
  c=mix(c,vec3(.9,.65,.15),clamp(f*f*3.,0.,1.));
  vec2 ct=uv-.5; c*=1.-dot(ct,ct)*3.; c=clamp(c*.4,0.,1.);
  gl_FragColor=vec4(c,1.);
}`;

function ResearchWebGL() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const gl = cv.getContext("webgl"); if (!gl) return;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s;
    };
    const pg = gl.createProgram()!;
    gl.attachShader(pg, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(pg, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(pg); gl.useProgram(pg);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const ap = gl.getAttribLocation(pg, "p");
    gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 0, 0);
    const uT = gl.getUniformLocation(pg, "t"), uR = gl.getUniformLocation(pg, "res");
    const resize = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; gl.viewport(0,0,cv.width,cv.height); };
    resize(); window.addEventListener("resize", resize);
    let id: number, t0 = performance.now();
    const tick = (now: number) => {
      gl.uniform1f(uT, (now-t0)*.001); gl.uniform2f(uR, cv.width, cv.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.45 }} />;
}

/* Magazine book — no tilt, no blur, just scale on hover + floating particles */
function MagazineBook({ inView }: { inView: boolean }) {
  const [hov, setHov] = useState(false);

  const particles = [
    {x:-60,y:30,r:4,delay:0},{x:70,y:-40,r:3,delay:.4},
    {x:-40,y:-50,r:2,delay:.8},{x:80,y:60,r:3,delay:1.2},
    {x:-70,y:10,r:2,delay:1.6},{x:50,y:-60,r:4,delay:.2},
    {x:-20,y:70,r:2,delay:1},{x:60,y:30,r:3,delay:.6},
  ];

  return (
    <div style={{ position:"relative", width:300, height:380, display:"flex", alignItems:"center", justifyContent:"center" }}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>

      {/* WebGL behind */}
      <div style={{ position:"absolute", inset:-40, overflow:"hidden", borderRadius:20, opacity:.6 }}>
        <ResearchWebGL />
      </div>

      {/* Floating particles */}
      {particles.map((p,i)=>(
        <motion.div key={i}
          initial={{ opacity:0, scale:0 }}
          animate={inView ? { opacity:[0,.8,0], scale:[0,1,0], y:[p.y, p.y-16, p.y] } : {}}
          transition={{ duration:3+i*.4, repeat:Infinity, delay:p.delay, ease:"easeInOut" }}
          style={{ position:"absolute", width:p.r*2, height:p.r*2, borderRadius:"50%",
            background:"#e8a838", left:`calc(50% + ${p.x}px)`, top:`calc(50% + ${p.y*.5}px)`,
            boxShadow:`0 0 ${p.r*4}px rgba(232,168,56,.7)`, zIndex:5 }}/>
      ))}

      {/* Orbiting rings */}
      <motion.div animate={{ rotate:360 }} transition={{ duration:20, repeat:Infinity, ease:"linear" }}
        style={{ position:"absolute", width:320, height:320, borderRadius:"50%",
          border:"1px dashed rgba(232,168,56,.15)", zIndex:1 }}/>
      <motion.div animate={{ rotate:-360 }} transition={{ duration:30, repeat:Infinity, ease:"linear" }}
        style={{ position:"absolute", width:360, height:360, borderRadius:"50%",
          border:"1px solid rgba(232,168,56,.06)", zIndex:1 }}/>

      {/* Book — scale only on hover, no tilt */}
      <motion.div
        animate={{ scale: hov ? 1.04 : 1 }}
        transition={{ duration:.4, ease:[.22,1,.36,1] }}
        style={{ zIndex:3,
          filter: hov
            ? "drop-shadow(0 24px 48px rgba(232,168,56,.35))"
            : "drop-shadow(0 12px 24px rgba(0,0,0,.5))" }}>
        <svg width="220" height="290" viewBox="0 0 220 290">
          <defs>
            <linearGradient id="cvG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1a0e00"/>
              <stop offset="50%" stopColor="#0e0800"/>
              <stop offset="100%" stopColor="#060400"/>
            </linearGradient>
            <linearGradient id="spG" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(232,168,56,.25)"/>
              <stop offset="100%" stopColor="rgba(232,168,56,.08)"/>
            </linearGradient>
            <linearGradient id="glowG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(232,168,56,.15)"/>
              <stop offset="100%" stopColor="transparent"/>
            </linearGradient>
          </defs>

          {/* Spine */}
          <rect x="0" y="8" width="16" height="274" rx="2" fill="url(#spG)"/>
          <text x="8" y="150" fill="rgba(232,168,56,.5)" fontSize="6"
            fontFamily="'Syne',sans-serif" fontWeight="700" textAnchor="middle"
            transform="rotate(-90,8,150)" letterSpacing="1">
            RESEARCH · SUNY BUFFALO · 2023
          </text>

          {/* Page stack illusion */}
          {[3,2,1].map(i=>(
            <rect key={i} x={17+i} y={9+i*.4} width="198" height="272" rx="1"
              fill={`rgba(240,225,195,${0.03+i*0.02})`}
              stroke="rgba(232,168,56,.06)" strokeWidth="0.5"/>
          ))}

          {/* Front cover */}
          <rect x="18" y="10" width="196" height="270" rx="2" fill="url(#cvG)"/>
          <rect x="20" y="12" width="192" height="266" rx="1"
            fill="none" stroke="rgba(232,168,56,.3)" strokeWidth="0.8"/>
          <rect x="23" y="15" width="186" height="260" rx="1"
            fill="none" stroke="rgba(232,168,56,.1)" strokeWidth="0.5"/>

          {/* Header band */}
          <rect x="18" y="10" width="196" height="20" fill="rgba(232,168,56,.1)" rx="2"/>
          <text x="116" y="23" fill="#e8a838" fontSize="6" fontFamily="'JetBrains Mono',monospace"
            letterSpacing="2.5" textAnchor="middle" fontWeight="700">
            RESEARCH JOURNAL · 2023
          </text>

          {/* Neural net graphic */}
          <g transform="translate(116,88)" opacity="0.7">
            <circle cx="0" cy="0" r="22" fill="none" stroke="rgba(232,168,56,.25)" strokeWidth="0.8"/>
            <circle cx="0" cy="0" r="14" fill="none" stroke="rgba(232,168,56,.15)" strokeWidth="0.5"/>
            <circle cx="0" cy="0" r="6" fill="rgba(232,168,56,.12)"/>
            <text x="0" y="2.5" fill="#e8a838" fontSize="5" textAnchor="middle"
              fontFamily="'JetBrains Mono',monospace">AI</text>
            {[0,51.4,102.8,154.2,205.6,257.1,308.5].map((deg,i)=>{
              const rad = deg*Math.PI/180;
              return (
                <g key={i}>
                  <circle cx={22*Math.cos(rad)} cy={22*Math.sin(rad)} r={i%2===0?2.5:1.5}
                    fill={i%2===0?"#e8a838":"rgba(232,168,56,.5)"}/>
                  <line x1="0" y1="0" x2={22*Math.cos(rad)} y2={22*Math.sin(rad)}
                    stroke="rgba(232,168,56,.2)" strokeWidth="0.5"/>
                </g>
              );
            })}
          </g>

          {/* Title */}
          <text x="116" y="128" fill="#f0ece4" fontSize="9" fontFamily="'Syne',sans-serif"
            fontWeight="800" textAnchor="middle">Managing the</text>
          <text x="116" y="140" fill="#f0ece4" fontSize="9" fontFamily="'Syne',sans-serif"
            fontWeight="800" textAnchor="middle">Infodemic</text>

          {/* Amber rule */}
          <line x1="40" y1="148" x2="192" y2="148" stroke="#e8a838" strokeWidth="1.2"/>

          {/* Author */}
          <text x="116" y="160" fill="rgba(232,168,56,.6)" fontSize="6"
            fontFamily="'JetBrains Mono',monospace" textAnchor="middle">
            Vaibhav Bansal · SUNY Buffalo
          </text>

          {/* Tags */}
          {["Deep Learning","NLP","COVID-19"].map((tag,i)=>{
            const w=52, x=28+i*(w+5);
            return (
              <g key={tag}>
                <rect x={x} y="168" width={w} height="12" rx="1"
                  fill="rgba(232,168,56,.08)" stroke="rgba(232,168,56,.2)" strokeWidth="0.5"/>
                <text x={x+w/2} y="176.5" fill="rgba(232,168,56,.65)" fontSize="5.5"
                  textAnchor="middle" fontFamily="'JetBrains Mono',monospace">{tag}</text>
              </g>
            );
          })}

          {/* Year */}
          <rect x="85" y="188" width="62" height="16" rx="1"
            fill="rgba(232,168,56,.12)" stroke="rgba(232,168,56,.35)" strokeWidth="0.5"/>
          <text x="116" y="199" fill="#e8a838" fontSize="8" textAnchor="middle"
            fontFamily="'Syne',sans-serif" fontWeight="800">2023</text>

          {/* ORCID bottom bar */}
          <rect x="18" y="258" width="196" height="22" fill="rgba(232,168,56,.07)" rx="2"/>
          <text x="116" y="272" fill="rgba(232,168,56,.45)" fontSize="5.5"
            textAnchor="middle" fontFamily="'JetBrains Mono',monospace">
            ORCID: 0000-0002-5433-0385
          </text>

          {/* Top glow */}
          <rect x="18" y="10" width="196" height="60" fill="url(#glowG)" rx="2"/>
        </svg>
      </motion.div>
    </div>
  );
}

export default function ResearchSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once:true, amount:.2 });
  const paper = research[0];

  return (
    <section ref={ref} className="py-24 relative overflow-hidden"
      style={{ borderTop:"1px solid #1a1a1a" }}>

      <div style={{ position:"absolute", inset:0, pointerEvents:"none",
        background:"radial-gradient(ellipse at 25% 50%,rgba(232,168,56,.06) 0%,transparent 55%)" }}/>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div variants={stagger} initial="hidden" animate={inView?"show":"hidden"}>

          <motion.div variants={up} className="mb-12">
            <span className="section-label">Academic Research</span>
            <h2 className="font-display font-extrabold mt-2"
              style={{ fontSize:"clamp(1.8rem,3.5vw,2.8rem)" }}>
              Published{" "}
              <span style={{ background:"linear-gradient(120deg,#e8a838,#f4c96a)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                Research
              </span>
            </h2>
          </motion.div>

          <div style={{ display:"grid", gridTemplateColumns:"320px 1fr", gap:56, alignItems:"center" }}>

            {/* Magazine */}
            <motion.div variants={up} style={{ display:"flex", justifyContent:"center" }}>
              <MagazineBook inView={inView} />
            </motion.div>

            {/* Content */}
            <motion.div variants={up}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                <div style={{ width:2, height:40, background:"#e8a838" }}/>
                <div>
                  <div className="font-mono" style={{ fontSize:8, color:"#555", letterSpacing:".2em",
                    textTransform:"uppercase", marginBottom:2 }}>
                    Journal · Research Paper · 2023
                  </div>
                  <div className="font-display font-extrabold" style={{ fontSize:13, color:"#e8a838" }}>
                    SUNY Buffalo · medRxiv
                  </div>
                </div>
              </div>

              <h3 className="font-display font-extrabold mb-4"
                style={{ fontSize:19, color:"#f0ece4", lineHeight:1.35 }}>
                {paper.title}
              </h3>

              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
                {paper.tags.map((tag,i)=>(
                  <motion.span key={tag}
                    initial={{ opacity:0, scale:.8 }} animate={inView?{opacity:1,scale:1}:{}}
                    transition={{ delay:.6+i*.08 }}
                    className="font-mono"
                    style={{ fontSize:8, background:"rgba(232,168,56,.08)",
                      border:"1px solid rgba(232,168,56,.25)", color:"#e8a838",
                      padding:"3px 10px", letterSpacing:".12em", textTransform:"uppercase" }}>
                    {tag}
                  </motion.span>
                ))}
              </div>

              <motion.div initial={{ scaleX:0 }} animate={inView?{scaleX:1}:{}}
                transition={{ duration:.8, delay:.4 }}
                style={{ height:1, background:"linear-gradient(to right,#e8a838,rgba(232,168,56,.1))",
                  marginBottom:16, transformOrigin:"left", boxShadow:"0 0 8px rgba(232,168,56,.25)" }}/>

              <p style={{ fontFamily:"var(--font-body)", fontSize:13, color:"#9ca3af",
                lineHeight:1.8, marginBottom:24, fontStyle:"italic" }}>
                "{paper.description}"
              </p>

              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
                <motion.div whileHover={{ scale:1.1 }}
                  style={{ width:42, height:42, borderRadius:"50%", background:"#e8a838",
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                    boxShadow:"0 0 16px rgba(232,168,56,.3)" }}>
                  <span className="font-display font-extrabold" style={{ fontSize:13, color:"#0e0e0e" }}>VB</span>
                </motion.div>
                <div>
                  <div className="font-display font-bold" style={{ fontSize:13, color:"#f0ece4" }}>Vaibhav Bansal</div>
                  <div className="font-mono" style={{ fontSize:8, color:"#555" }}>SUNY Buffalo · 2023</div>
                  <div className="font-mono" style={{ fontSize:8, color:"rgba(232,168,56,.5)", marginTop:2 }}>
                    ORCID: 0000-0002-5433-0385
                  </div>
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:24 }}>
                {[{label:"Year",val:"2023"},{label:"Institute",val:"SUNY UB"},
                  {label:"Domain",val:"Deep Learning"},{label:"Topic",val:"COVID-19 AI"}].map(({label,val},i)=>(
                  <motion.div key={label}
                    initial={{ opacity:0, y:10 }} animate={inView?{opacity:1,y:0}:{}}
                    transition={{ delay:.7+i*.08 }}
                    style={{ background:"#080808", border:"1px solid #1a1a1a", padding:"10px 12px" }}>
                    <div className="font-mono" style={{ fontSize:7, color:"#555", letterSpacing:".15em",
                      textTransform:"uppercase", marginBottom:3 }}>{label}</div>
                    <div className="font-display font-bold" style={{ fontSize:12, color:"#e8a838" }}>{val}</div>
                  </motion.div>
                ))}
              </div>

              <div style={{ display:"flex", gap:10 }}>
                <motion.div whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }}>
                  <Link href={paper.orcid} target="_blank" rel="noopener noreferrer"
                    style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"11px 22px",
                      background:"#e8a838", color:"#0e0e0e", textDecoration:"none",
                      fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800,
                      letterSpacing:".12em", textTransform:"uppercase",
                      boxShadow:"0 0 20px rgba(232,168,56,.3)" }}>
                    Read Paper ↗
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }}>
                  <Link href={personal.orcid} target="_blank" rel="noopener noreferrer"
                    style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"11px 22px",
                      border:"1px solid rgba(232,168,56,.35)", color:"#7a7265", textDecoration:"none",
                      fontFamily:"'JetBrains Mono',monospace", fontSize:9,
                      letterSpacing:".12em", textTransform:"uppercase",
                      background:"rgba(232,168,56,.04)" }}>
                    ORCID Profile
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
