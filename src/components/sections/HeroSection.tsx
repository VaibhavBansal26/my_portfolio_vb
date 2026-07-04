"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { TypeAnimation } from "react-type-animation";
import { FiGithub, FiLinkedin, FiArrowRight, FiDownload } from "react-icons/fi";
import { SiLeetcode } from "react-icons/si";
import { personal } from "@/data/portfolio";
import { usePersona } from "@/components/ui/usePersona";


const CTA: Record<string, { href: string; label: string; external?: boolean }> = {
  browsing:  { href: "/portfolio", label: "View Work" },
  recruiter: { href: "/resume",    label: "View Resume" },
  engineer:  { href: personal.github, label: "View GitHub", external: true },
};
import { ScribbleUnderline, HandNote, DoodleArrow } from "@/components/ui/Scribble";
import Sticker from "@/components/ui/Sticker";
import SkewOnScroll from "@/components/ui/SkewOnScroll";

/* ─── WebGL fluid shader — ambient layer, deliberately dim ─── */
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
  vec2 q=vec2(fbm(uv+t*.1),fbm(uv+1.4));
  vec2 r=vec2(fbm(uv+q+vec2(1.7,9.2)+t*.08),fbm(uv+q+vec2(8.3,2.8)+t*.07));
  float f=fbm(uv+r);
  vec3 c=mix(vec3(.02,.015,.005),vec3(.38,.23,.05),clamp(f*f*2.2,0.,1.));
  c=mix(c,vec3(.18,.5,.55),clamp(length(r)*.35,0.,1.)*.4);
  vec2 ct=uv-.5; c*=1.-dot(ct,ct)*2.2; c=clamp(c*.55,0.,1.);
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
    // Half-resolution render — shader is ambient, sharpness is wasted GPU
    const resize = () => {
      cv.width = Math.floor(cv.offsetWidth / 2); cv.height = Math.floor(cv.offsetHeight / 2);
      gl.viewport(0,0,cv.width,cv.height);
    };
    resize(); window.addEventListener("resize", resize);
    let id: number, t0 = performance.now(), running = true, last = 0;
    const tick = (now: number) => {
      if (!running) return;
      id = requestAnimationFrame(tick);
      if (now - last < 33) return; // ~30fps cap — ambient layer
      last = now;
      gl.uniform1f(uT, (now-t0)*.001); gl.uniform2f(uR, cv.width, cv.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    id = requestAnimationFrame(tick);
    const io = new IntersectionObserver(([e]) => {
      const vis = e.isIntersecting;
      if (vis && !running) { running = true; id = requestAnimationFrame(tick); }
      else if (!vis && running) { running = false; cancelAnimationFrame(id); }
    });
    io.observe(cv);
    return () => { running = false; cancelAnimationFrame(id); io.disconnect(); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.55 }} />;
}

/* ─── Avatar — one ring, one scan line. Calm. ─── */
function Avatar() {
  return (
    <div className="relative" style={{ width: 300, height: 300 }}>
      <motion.div
        initial={{ scale: .92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: .9, delay: .3, ease: [.22,1,.36,1] }}
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{ border: "1px solid var(--border-bright)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={personal.avatar} alt="Vaibhav Bansal"
          style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(.92) contrast(1.04) saturate(.9)" }} />
        <motion.div
          animate={{ top: ["6%","90%","6%"] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute pointer-events-none"
          style={{ left:0, right:0, height:1,
            background:"linear-gradient(to right,transparent,var(--reactor-dim),transparent)" }} />
      </motion.div>
      <motion.div
        animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute rounded-full pointer-events-none"
        style={{ inset: -14, border: "1px dashed var(--hud-line)" }} />
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
        className="absolute font-mono"
        style={{ bottom: -10, left: "50%", transform: "translateX(-50%)",
          fontSize: 9, letterSpacing: ".25em", whiteSpace: "nowrap",
          color: "var(--reactor-dim)", background: "var(--bg)",
          padding: "3px 12px", border: "1px solid var(--hud-line)" }}>
        ID·VB-26 · VERIFIED
      </motion.div>
      <div className="absolute" style={{ top: -34, right: -26 }}>
        <Sticker><HandNote rotate={6} size={17}>hi, that&apos;s me</HandNote></Sticker>
      </div>
    </div>
  );
}

/* ─── Neural constellation — sparse nodes that lean toward the cursor ─── */
type WeatherMode = "clear" | "rain" | "snow";

/* #27 weather hook — open-meteo via coarse IP locale; silent fallback to clear */
function useWeather(): WeatherMode {
  const [mode, setMode] = useState<WeatherMode>("clear");
  useEffect(() => {
    (async () => {
      try {
        const loc = await fetch("https://ipapi.co/json/").then(r => r.json());
        if (!loc?.latitude) return;
        const wx = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=weather_code`
        ).then(r => r.json());
        const code = wx?.current?.weather_code ?? 0;
        if (code >= 71 && code <= 77) setMode("snow");
        else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 99)) setMode("rain");
      } catch {}
    })();
  }, []);
  return mode;
}

function ConstellationCanvas({ isDark, weather = "clear" }: { isDark: boolean; weather?: WeatherMode }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    let W = cv.offsetWidth || window.innerWidth;
    let H = cv.offsetHeight || window.innerHeight;
    cv.width = W; cv.height = H;

    const COUNT = 52;
    const pts = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .3 + (weather === "rain" ? .12 : 0),
      vy: weather === "rain" ? .9 + Math.random() * .8
        : weather === "snow" ? .25 + Math.random() * .3
        : (Math.random() - .5) * .3,
      r: Math.random() * 1.5 + .6,
      wob: Math.random() * Math.PI * 2,
    }));
    const col = isDark ? "79,216,235" : "8,145,178";
    const gold = isDark ? "232,168,56" : "184,110,8";
    const LINK = 130, LINK2 = LINK * LINK;
    const MOUSE = 170, MOUSE2 = MOUSE * MOUSE;
    const mouse = { x: -9999, y: -9999 };

    const onMove = (e: MouseEvent) => {
      const rect = cv.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let id: number, running = true;
    const draw = () => {
      if (!running) return;
      id = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);
      // node↔node links
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d2 = dx*dx + dy*dy;
          if (d2 < LINK2) {
            const a = (1 - d2 / LINK2) * .14;
            ctx.strokeStyle = `rgba(${col},${a})`;
            ctx.lineWidth = .6;
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
          }
        }
      }
      // nodes + cursor interaction
      pts.forEach(p => {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const d2 = dx*dx + dy*dy;
        let glow = 0;
        if (d2 < MOUSE2) {
          glow = 1 - d2 / MOUSE2;
          // gentle attraction toward cursor
          p.x += dx * 0.0035 * glow; p.y += dy * 0.0035 * glow;
          ctx.strokeStyle = `rgba(${gold},${glow * .25})`;
          ctx.lineWidth = .6;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + glow * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = glow > 0 ? `rgba(${gold},${.4 + glow * .5})` : `rgba(${col},.45)`;
        ctx.fill();
        if (weather === "snow") p.x += Math.sin((p.wob += 0.01)) * .4;
        p.x += p.vx; p.y += p.vy;
        if (weather === "clear") {
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
        } else {
          if (p.y > H + 10) { p.y = -10; p.x = Math.random() * W; }
          if (p.x > W + 10) p.x = -10;
          if (p.x < -10) p.x = W + 10;
        }
      });
    };
    id = requestAnimationFrame(draw);
    const io = new IntersectionObserver(([e]) => {
      const vis = e.isIntersecting;
      if (vis && !running) { running = true; id = requestAnimationFrame(draw); }
      else if (!vis && running) { running = false; cancelAnimationFrame(id); }
    });
    io.observe(cv);
    const onResize = () => { W = cv.offsetWidth; H = cv.offsetHeight; cv.width = W; cv.height = H; };
    window.addEventListener("resize", onResize);
    return () => {
      running = false; cancelAnimationFrame(id); io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [isDark, weather]);
  return <canvas ref={ref} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} />;
}

const stagger = { hidden:{}, show:{ transition:{ staggerChildren:.09, delayChildren:.2 } } };
const up = { hidden:{ opacity:0, y:24 }, show:{ opacity:1, y:0, transition:{ duration:.6, ease:[.22,1,.36,1] as const } } };

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark]   = useState(true);
  const [greeting, setGreeting] = useState("FRIDAY: ONLINE");
  const [refNote, setRefNote]   = useState<string | null>(null);
  const reduce = useReducedMotion();
  const persona = usePersona();
  const cta = CTA[persona] ?? CTA.browsing;
  const weather = useWeather();

  /* scroll choreography — bg parallaxes slower, content dissolves on exit */
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgY      = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity  = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  useEffect(() => {
    setMounted(true);
    // FRIDAY adapts: time-aware status line
    const h = new Date().getHours();
    const tod = h < 5 ? "WORKING LATE?" : h < 12 ? "GOOD MORNING" : h < 18 ? "GOOD AFTERNOON" : "GOOD EVENING";
    setGreeting(`${tod} · FRIDAY: ONLINE`);
    // FRIDAY adapts: referrer-aware note
    try {
      const ref = document.referrer;
      const utm = new URLSearchParams(window.location.search).get("utm_source") || "";
      const src = (utm || ref).toLowerCase();
      if (src.includes("linkedin")) setRefNote("via LinkedIn — the 30-second version lives at /resume");
      else if (src.includes("github")) setRefNote("via GitHub — the code-heavy tour starts at /portfolio");
      else if (src.includes("google")) setRefNote("via search — welcome. FRIDAY can give you the tour ↘");
    } catch {}
    const check = () => setIsDark(!document.documentElement.classList.contains("light"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes:true, attributeFilter:["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden"
      style={{ paddingTop:"5rem" }}>

      {/* Ambient shader — the ONLY background effect */}
      {mounted && isDark && !reduce && (
        <motion.div className="absolute inset-0" style={{ zIndex:0, pointerEvents:"none", y: bgY }}>
          <WebGLCanvas />
        </motion.div>
      )}

      {/* Neural constellation — reacts to the cursor (above the veil) */}
      {mounted && !reduce && (
        <motion.div className="absolute inset-0" style={{ zIndex:2, pointerEvents:"none", y: bgY }}>
          <ConstellationCanvas isDark={isDark} weather={weather} />
        </motion.div>
      )}

      {/* Holographic horizon grid — perspective floor fading up */}
      <div aria-hidden className="absolute pointer-events-none"
        style={{ left:"-20%", right:"-20%", bottom:"-12%", height:"42%", zIndex:2,
          transform:"perspective(620px) rotateX(64deg)",
          backgroundImage:"linear-gradient(var(--hud-line) 1px, transparent 1px), linear-gradient(90deg, var(--hud-line) 1px, transparent 1px)",
          backgroundSize:"54px 54px",
          maskImage:"linear-gradient(to top, rgba(0,0,0,.9), transparent 80%)",
          WebkitMaskImage:"linear-gradient(to top, rgba(0,0,0,.9), transparent 80%)" }} />

      {/* Single dark veil for text contrast */}
      <div className="absolute inset-0" style={{ zIndex:1, pointerEvents:"none",
        background: isDark
          ? "linear-gradient(105deg, var(--hero-ol-l) 0%, var(--hero-ol-m) 55%, var(--hero-ol-r) 100%)"
          : "linear-gradient(105deg, rgba(250,247,242,.97) 0%, rgba(250,247,242,.86) 55%, rgba(250,247,242,.62) 100%)" }} />

      {/* Content */}
      <motion.div className="relative w-full"
        style={ reduce ? { zIndex:10 } : { zIndex:10, y: contentY, opacity } }>
        <div className="w-full max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-[1.4fr_1fr] gap-16 items-center">

            {/* TEXT — editorial, one accent */}
            <motion.div variants={stagger} initial="hidden" animate="show">

              <motion.div variants={up} className="flex items-center gap-3 font-mono text-[10px] tracking-[.3em] uppercase"
                style={{ color: "var(--reactor-dim)" }}>
                <motion.span animate={{ opacity:[1,.2,1] }} transition={{ duration:2, repeat:Infinity }}
                  className="w-1.5 h-1.5 rounded-full inline-block" style={{ background:"var(--reactor)" }} />
                {greeting} · OPEN TO OPPORTUNITIES
              </motion.div>

              <motion.div variants={up}>
                <SkewOnScroll>
                  <h1 className="font-display font-extrabold mt-6"
                    style={{ fontSize:"clamp(3.2rem,7vw,6.2rem)", lineHeight:.98, letterSpacing:"-0.02em", color:"var(--text)" }}>
                    Vaibhav<br />Bansal
                  </h1>
                </SkewOnScroll>
              </motion.div>

              <motion.p variants={up} className="mt-6 font-display font-semibold"
                style={{ fontSize:"clamp(1.05rem,1.8vw,1.45rem)", lineHeight:1.4, color:"var(--text)", maxWidth:520 }}>
                I build AI systems that <ScribbleUnderline>ship</ScribbleUnderline> —{" "}
                <span style={{ color:"var(--accent)" }}>LLMs, RAG pipelines, and full-stack products</span>{" "}
                with 5+ years in production.
              </motion.p>

              <motion.div variants={up} className="mt-4 flex items-center gap-2 font-mono text-xs">
                <span style={{ color:"var(--text-muted)" }}>{">"}</span>
                <TypeAnimation
                  sequence={["Software Engineer",1800,"AI Engineer",1800,"Full Stack Developer",1800,"ML Engineer",1800,"Open Source Author",1800]}
                  wrapper="span" repeat={Infinity}
                  style={{ color:"var(--text-muted)" }} />
              </motion.div>

              <motion.div variants={up} className="mt-10 flex flex-wrap items-center gap-4">
                <Link href={cta.href} {...(cta.external ? { target:"_blank", rel:"noopener noreferrer" } : {})}
                  className="group inline-flex items-center gap-2 font-mono font-bold text-xs uppercase tracking-wider"
                  style={{ padding:"14px 28px", background:"var(--accent)", color:"var(--bg)", textDecoration:"none" }}>
                  {cta.label}
                  <FiArrowRight size={14} style={{ transition:"transform .25s" }}
                    className="group-hover:translate-x-1" />
                </Link>
                <Link href="/resume"
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider hover-underline"
                  style={{ padding:"14px 4px", color:"var(--text-muted)", textDecoration:"none" }}>
                  <FiDownload size={13} /> Resume
                </Link>
                <button onClick={() => window.dispatchEvent(new CustomEvent("vb-tour-start"))}
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider"
                  style={{ padding:"14px 4px", background:"none", border:"none", cursor:"pointer",
                    color:"var(--reactor-dim)" }}
                  onMouseEnter={e=>(e.currentTarget.style.color="var(--reactor)")}
                  onMouseLeave={e=>(e.currentTarget.style.color="var(--reactor-dim)")}>
                  ◉ Let FRIDAY drive
                </button>
                <span aria-hidden style={{ width:1, height:20, background:"var(--border-bright)" }} />
                {[
                  { href:personal.github,   icon:<FiGithub size={17} />,   label:"GitHub" },
                  { href:personal.linkedin, icon:<FiLinkedin size={17} />, label:"LinkedIn" },
                  { href:personal.leetcode, icon:<SiLeetcode size={15} />, label:"LeetCode" },
                ].map(({ href,icon,label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    style={{ color:"var(--text-muted)", textDecoration:"none", padding:6, transition:"color .2s" }}
                    onMouseEnter={e=>((e.currentTarget as HTMLAnchorElement).style.color="var(--accent)")}
                    onMouseLeave={e=>((e.currentTarget as HTMLAnchorElement).style.color="var(--text-muted)")}>
                    {icon}
                  </a>
                ))}
                <span className="hidden lg:flex items-end gap-1" style={{ marginLeft: 8 }}>
                  <HandNote rotate={-4}>start here&nbsp;:)</HandNote>
                  <DoodleArrow flip size={40} style={{ transform: "scaleX(-1) rotate(118deg)", marginBottom: 14 }} />
                </span>
              </motion.div>

              {refNote && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .6 }}
                  className="mt-6 font-mono text-[10px]" style={{ color: "var(--reactor-dim)" }}>
                  {"// "}{refNote}
                </motion.p>
              )}
            </motion.div>

            {/* AVATAR */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:.8, delay:.4 }}
              className="hidden md:flex justify-center items-center">
              <Avatar />
            </motion.div>

          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex:10 }}>
        <motion.div animate={{ scaleY:[0,1,0], opacity:[0,1,0] }} transition={{ duration:2.2, repeat:Infinity }}
          className="w-px h-8 origin-top"
          style={{ background:"linear-gradient(to bottom, var(--reactor-dim), transparent)" }} />
      </motion.div>
    </section>
  );
}
