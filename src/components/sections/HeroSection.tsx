"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { FiGithub, FiLinkedin, FiArrowRight, FiDownload } from "react-icons/fi";
import { SiLeetcode } from "react-icons/si";
import { personal } from "@/data/portfolio";

/* ─── WebGL fluid shader ─── */
const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
const FRAG = `
precision mediump float;
uniform float t; uniform vec2 res;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
float n(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.1;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/res;
  vec2 q=vec2(fbm(uv+t*.15),fbm(uv+1.4));
  vec2 r=vec2(fbm(uv+q+vec2(1.7,9.2)+t*.12),fbm(uv+q+vec2(8.3,2.8)+t*.1));
  float f=fbm(uv+r);
  vec3 c=mix(vec3(.04,.025,.005),vec3(.6,.35,.06),clamp(f*f*2.5,0.,1.));
  c=mix(c,vec3(.95,.68,.18),clamp(length(r)*.6,0.,1.));
  vec2 ct=uv-.5; c*=1.-dot(ct,ct)*2.0; c=clamp(c*.7,0.,1.);
  gl_FragColor=vec4(c,1.);
}`;

function WebGLCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const gl = cv.getContext("webgl"); if (!gl) return;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s); return s;
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
  return <canvas ref={ref} style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.75 }} />;
}

/* ─── 2D Canvas particles + connecting lines ─── */
function ParticleCanvas({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    let W = cv.offsetWidth || window.innerWidth;
    let H = cv.offsetHeight || window.innerHeight;
    cv.width = W; cv.height = H;

    const COUNT = 80;
    const pts = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .45,
      vy: (Math.random() - .5) * .45,
      r: Math.random() * 1.6 + .5,
    }));

    const dotColor   = isDark ? "232,168,56" : "180,100,10";
    const lineColor  = isDark ? "232,168,56" : "180,100,10";
    const maxDist = 140;

    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      // Lines
      for (let i = 0; i < COUNT; i++) {
        for (let j = i+1; j < COUNT; j++) {
          const dx = pts[i].x-pts[j].x, dy = pts[i].y-pts[j].y;
          const d = Math.sqrt(dx*dx+dy*dy);
          if (d < maxDist) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${lineColor},${(1-d/maxDist)*.22})`;
            ctx.lineWidth = .7;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      // Dots
      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${dotColor},.55)`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });
      id = requestAnimationFrame(draw);
    };
    id = requestAnimationFrame(draw);
    const onResize = () => { W = window.innerWidth; H = window.innerHeight; cv.width = W; cv.height = H; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", onResize); };
  }, [isDark]);

  return <canvas ref={ref} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} />;
}

/* ─── Avatar ring ─── */
function AvatarRing() {
  return (
    <div className="relative flex items-center justify-center" style={{ width:320, height:380 }}>
      <motion.div animate={{ rotate:360 }} transition={{ duration:22, repeat:Infinity, ease:"linear" }}
        className="absolute rounded-full"
        style={{ width:310, height:310, padding:2,
          background:"conic-gradient(from 0deg,#e8a838,transparent 30%,#b87d20 55%,transparent 80%,#e8a838)" }}>
        <div className="w-full h-full rounded-full" style={{ background:"var(--bg)" }} />
      </motion.div>
      <motion.div animate={{ rotate:-360 }} transition={{ duration:14, repeat:Infinity, ease:"linear" }}
        className="absolute rounded-full"
        style={{ width:296, height:296, border:"1px dashed rgba(232,168,56,.35)" }} />
      <motion.div animate={{ scale:[1,1.06,1], opacity:[.3,.75,.3] }} transition={{ duration:3, repeat:Infinity }}
        className="absolute rounded-full"
        style={{ width:316, height:316, border:"1.5px solid #e8a838",
          boxShadow:"0 0 50px rgba(232,168,56,.3),0 0 100px rgba(232,168,56,.1)" }} />
      <motion.div initial={{ scale:.6, opacity:0 }} animate={{ scale:1, opacity:1 }}
        transition={{ duration:.85, delay:.3, ease:[.22,1,.36,1] }}
        className="absolute rounded-full overflow-hidden"
        style={{ width:286, height:286, border:"2px solid #e8a838", boxShadow:"0 0 60px rgba(232,168,56,.25)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={personal.avatar} alt="Vaibhav Bansal"
          style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(.9) contrast(1.05)" }} />
        <div className="absolute inset-0"
          style={{ background:"linear-gradient(to top,rgba(14,14,14,.5) 0%,transparent 50%)" }} />
      </motion.div>
      <motion.div animate={{ top:["8%","86%","8%"] }} transition={{ duration:4, repeat:Infinity, ease:"easeInOut" }}
        className="absolute pointer-events-none"
        style={{ left:"8%", right:"8%", height:2, zIndex:5,
          background:"linear-gradient(to right,transparent,rgba(232,168,56,.7),transparent)" }} />
      {[
        { top:-6,left:-6,   borderTop:"2px solid #e8a838",borderLeft:"2px solid #e8a838" },
        { top:-6,right:-6,  borderTop:"2px solid #e8a838",borderRight:"2px solid #e8a838" },
        { bottom:-6,left:-6,  borderBottom:"2px solid #e8a838",borderLeft:"2px solid #e8a838" },
        { bottom:-6,right:-6, borderBottom:"2px solid #e8a838",borderRight:"2px solid #e8a838" },
      ].map((s,i)=>(
        <motion.div key={i} initial={{ opacity:0,scale:0 }} animate={{ opacity:1,scale:1 }}
          transition={{ delay:.7+i*.08, ease:"backOut" }}
          style={{ position:"absolute", width:18, height:18, ...s }} />
      ))}
      <motion.div initial={{ opacity:0,x:16 }} animate={{ opacity:1,x:0 }} transition={{ delay:1.0 }}
        className="absolute font-mono"
        style={{ right:-28,top:32, padding:"8px 12px",
          background:"rgba(14,14,14,.88)", border:"1px solid rgba(232,168,56,.45)",
          backdropFilter:"blur(12px)" }}>
        <p style={{ fontSize:10,color:"#e8a838",marginBottom:2 }}>AI Engineer</p>
        <p style={{ fontSize:9,color:"#7a7265" }}>LangChain · RAG · LLMs</p>
      </motion.div>
      <motion.div initial={{ opacity:0,x:-16 }} animate={{ opacity:1,x:0 }} transition={{ delay:1.2 }}
        className="absolute font-mono"
        style={{ left:-28,bottom:60, padding:"8px 12px",
          background:"rgba(14,14,14,.88)", border:"1px solid rgba(232,168,56,.45)",
          backdropFilter:"blur(12px)" }}>
        <p style={{ fontSize:10,color:"#e8a838",marginBottom:2 }}>M.S. Data Science</p>
        <p style={{ fontSize:9,color:"#7a7265" }}>SUNY Buffalo</p>
      </motion.div>
      <motion.div initial={{ opacity:0,scale:.8 }} animate={{ opacity:1,scale:1 }}
        transition={{ delay:1.4,ease:"backOut" }}
        className="absolute font-mono font-extrabold"
        style={{ right:-10,bottom:48, padding:"6px 16px",
          background:"#e8a838",color:"#0e0e0e",fontSize:12,fontWeight:800,
          boxShadow:"0 0 28px rgba(232,168,56,.5)" }}>
        5+ Years
      </motion.div>
    </div>
  );
}

const stagger = { hidden:{}, show:{ transition:{ staggerChildren:.09, delayChildren:.2 } } };
const up = { hidden:{ opacity:0,y:28 }, show:{ opacity:1,y:0,transition:{ duration:.6,ease:[.22,1,.36,1] as const } } };

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark]   = useState(true);

  useEffect(() => {
    setMounted(true);
    // Read actual theme from html class
    const check = () => setIsDark(!document.documentElement.classList.contains("light"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes:true, attributeFilter:["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden"
      style={{ paddingTop:"5rem" }}>

      {/* Layer 0 — WebGL shader (dark only — too heavy for light bg) */}
      {mounted && isDark && (
        <div className="absolute inset-0" style={{ zIndex:0, pointerEvents:"none" }}>
          <WebGLCanvas />
        </div>
      )}

      {/* Layer 0b — Particles (always visible, color adapts) */}
      {mounted && (
        <div className="absolute inset-0" style={{ zIndex:1, pointerEvents:"none" }}>
          <ParticleCanvas isDark={isDark} />
        </div>
      )}

      {/* Layer 2 — Overlay */}
      <div className="absolute inset-0" style={{ zIndex:2, pointerEvents:"none",
        background: isDark
          ? "linear-gradient(105deg,rgba(14,14,14,.95) 0%,rgba(14,14,14,.72) 45%,rgba(14,14,14,.52) 100%)"
          : "linear-gradient(105deg,rgba(255,255,255,.97) 0%,rgba(255,255,255,.85) 45%,rgba(255,255,255,.6) 100%)",
      }} />

      {/* Layer 3 — Grid */}
      <div className="absolute inset-0" style={{ zIndex:3, pointerEvents:"none",
        backgroundImage:"linear-gradient(rgba(232,168,56,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(232,168,56,.05) 1px,transparent 1px)",
        backgroundSize:"56px 56px",
      }} />

      {/* Layer 4 — Left accent line */}
      <motion.div initial={{ scaleY:0 }} animate={{ scaleY:1 }}
        transition={{ duration:1.1, delay:.15 }}
        className="absolute left-6 top-0 bottom-0 w-px hidden md:block"
        style={{ zIndex:4, background:"linear-gradient(to bottom,transparent,#e8a838 35%,transparent)", transformOrigin:"top" }} />

      {/* Layer 10 — Content */}
      <div className="relative w-full" style={{ zIndex:10 }}>
        <div className="w-full max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* TEXT */}
            <motion.div variants={stagger} initial="hidden" animate="show">

              <motion.div variants={up}>
                <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase"
                  style={{ padding:"6px 14px", border:"1px solid rgba(232,168,56,.4)",
                    background:"rgba(232,168,56,.08)", color:"#e8a838" }}>
                  <motion.span animate={{ opacity:[1,.15,1] }} transition={{ duration:1.5, repeat:Infinity }}
                    className="w-1.5 h-1.5 rounded-full inline-block" style={{ background:"#e8a838" }} />
                  Open to Opportunities · United States
                </span>
              </motion.div>

              <motion.div variants={up} className="mt-5">
                <h1 className="font-display font-extrabold"
                  style={{ fontSize:"clamp(2.8rem,4vw,4.8rem)", lineHeight:1.08, color:"var(--text)" }}>
                  Vaibhav
                </h1>
                <h1 className="font-display font-extrabold"
                  style={{ fontSize:"clamp(2.8rem,4vw,4.8rem)", lineHeight:1.08,
                    background:"linear-gradient(120deg,#e8a838 0%,#f4c96a 55%,#e8a838 100%)",
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                  Bansal
                </h1>
              </motion.div>

              <motion.div variants={up} className="h-px w-16 mt-4"
                style={{ background:"linear-gradient(to right,#e8a838,transparent)" }} />

              <motion.div variants={up} className="mt-4 flex items-center gap-2 font-mono text-sm">
                <span style={{ color:"var(--text-muted)" }}>{">"}</span>
                <TypeAnimation
                  sequence={["Software Engineer",1800,"AI Engineer",1800,"Full Stack Developer",1800,"ML Engineer",1800,"Open Source Author",1800]}
                  wrapper="span" repeat={Infinity}
                  style={{ color:"#e8a838", textShadow:"0 0 20px rgba(232,168,56,.55)" }} />
              </motion.div>

              <motion.p variants={up} className="mt-5 text-sm leading-relaxed max-w-md"
                style={{ color:"var(--text-muted)" }}>
                5+ years shipping production AI & full-stack systems. M.S. Data Science from{" "}
                <span style={{ color:"var(--text)", fontWeight:500 }}>SUNY Buffalo</span>.
                {" "}Wipro · DashClicks · SUNY Research Assistant · npm publisher.
              </motion.p>

              <motion.div variants={up} className="mt-9 flex flex-wrap gap-4">
                <Link href="/portfolio"
                  className="relative overflow-hidden inline-flex items-center gap-2 font-mono font-extrabold text-xs uppercase tracking-wider"
                  style={{ padding:"12px 26px", background:"#e8a838", color:"#0e0e0e",
                    boxShadow:"0 0 26px rgba(232,168,56,.4)", textDecoration:"none" }}>
                  <motion.span className="absolute inset-0" style={{ background:"rgba(255,255,255,.25)" }}
                    initial={{ x:"-100%" }} whileHover={{ x:"100%" }} transition={{ duration:.45 }} />
                  View Work <FiArrowRight size={14} />
                </Link>
                <Link href="/resume"
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider"
                  style={{ padding:"12px 26px", border:"1px solid rgba(232,168,56,.45)",
                    color:"var(--text-muted)", textDecoration:"none", background:"rgba(232,168,56,.06)" }}>
                  <FiDownload size={13} /> Resume
                </Link>
              </motion.div>

              <motion.div variants={up} className="mt-8 flex items-center gap-6">
                {[
                  { href:personal.github,  icon:<FiGithub size={18} />,  label:"GitHub" },
                  { href:personal.linkedin, icon:<FiLinkedin size={18} />, label:"LinkedIn" },
                  { href:personal.leetcode, icon:<SiLeetcode size={16} />, label:"LeetCode" },
                ].map(({ href,icon,label }) => (
                  <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale:1.25, y:-3 }} whileTap={{ scale:.9 }}
                    style={{ color:"var(--text-muted)", textDecoration:"none" }}
                    onMouseEnter={e=>((e.currentTarget as HTMLAnchorElement).style.color="#e8a838")}
                    onMouseLeave={e=>((e.currentTarget as HTMLAnchorElement).style.color="var(--text-muted)")}>
                    {icon}
                  </motion.a>
                ))}
              </motion.div>

              <motion.div variants={up} className="mt-10 grid grid-cols-3 gap-4 pt-6"
                style={{ borderTop:"1px solid var(--border)" }}>
                {[{val:"5+",label:"Years"},{val:"95+",label:"Repos"},{val:"40+",label:"Projects"}].map(({val,label})=>(
                  <div key={label}>
                    <p className="font-display font-extrabold"
                      style={{ fontSize:28,
                        background:"linear-gradient(120deg,#e8a838,#f4c96a)",
                        WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>
                      {val}
                    </p>
                    <p className="font-mono text-[10px] tracking-widest uppercase mt-1"
                      style={{ color:"var(--text-muted)" }}>{label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* AVATAR */}
            <motion.div initial={{ opacity:0, scale:.85, x:50 }} animate={{ opacity:1, scale:1, x:0 }}
              transition={{ duration:.9, delay:.25, ease:[.22,1,.36,1] }}
              className="flex justify-center items-center">
              <AvatarRing />
            </motion.div>

          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex:10 }}>
        <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color:"var(--text-muted)" }}>
          Scroll
        </span>
        <motion.div animate={{ scaleY:[0,1,0], opacity:[0,1,0] }} transition={{ duration:1.8, repeat:Infinity }}
          className="w-px h-8 origin-top"
          style={{ background:"linear-gradient(to bottom,#e8a838,transparent)" }} />
      </motion.div>
    </section>
  );
}
