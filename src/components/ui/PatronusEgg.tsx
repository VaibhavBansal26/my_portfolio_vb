"use client";
import { useEffect, useRef } from "react";

export default function PatronusEgg() {
  const posRef = useRef({ x: 600, y: 400 }); // safe default, updated on client
  const typedRef = useRef("");
  const activeRef = useRef(false);

  useEffect(() => {
    // Track mouse position always
    const onMove = (e: MouseEvent) => { posRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      typedRef.current = (typedRef.current + e.key.toLowerCase()).slice(-8);
      if (typedRef.current === "patronus" && !activeRef.current) {
        typedRef.current = "";
        castPatronus(posRef.current.x, posRef.current.y);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return null; // all DOM is imperative via vanilla JS
}

function castPatronus(cx: number, cy: number) {
  if ((window as any).__patronusActive) return;
  (window as any).__patronusActive = true;

  // ── Container ──
  const container = document.createElement("div");
  Object.assign(container.style, {
    position: "fixed", inset: "0", zIndex: "8000", pointerEvents: "none",
  });
  document.body.appendChild(container);

  // ── Canvas ──
  const cv = document.createElement("canvas");
  cv.width = window.innerWidth;
  cv.height = window.innerHeight;
  Object.assign(cv.style, { position:"absolute", inset:"0", width:"100%", height:"100%" });
  container.appendChild(cv);
  const ctx = cv.getContext("2d")!;

  // ── Spell text ──
  const spell = document.createElement("div");
  spell.textContent = "Expecto Patronum!";
  Object.assign(spell.style, {
    position: "absolute",
    left: cx + "px", top: (cy - 210) + "px",
    transform: "translateX(-50%)",
    fontFamily: "'Georgia',Georgia,serif",
    fontSize: "clamp(20px,2.6vw,30px)",
    fontStyle: "italic",
    color: "rgba(210,235,255,0.95)",
    textShadow: "0 0 18px rgba(150,200,255,1),0 0 48px rgba(100,160,255,.55)",
    whiteSpace: "nowrap",
    letterSpacing: ".05em",
    opacity: "0",
    transition: "opacity .5s ease",
    pointerEvents: "none",
  });
  container.appendChild(spell);
  setTimeout(() => spell.style.opacity = "1", 50);

  // ── Quote ──
  const quote = document.createElement("div");
  quote.innerHTML = `
    <p style="font-family:'Georgia',serif;font-size:clamp(13px,1.4vw,15px);font-style:italic;
      color:rgba(185,215,255,0.78);text-shadow:0 0 14px rgba(120,180,255,.4);
      line-height:1.85;letter-spacing:.02em;margin:0 0 8px;">
      "Happiness can be found even in the darkest of times,<br/>
      if one only remembers to turn on the light."
    </p>
    <p style="font-family:'JetBrains Mono',monospace;font-size:9px;
      color:rgba(160,200,255,0.38);letter-spacing:.18em;text-transform:uppercase;margin:0">
      — Albus Dumbledore
    </p>`;
  Object.assign(quote.style, {
    position: "absolute", bottom: "9%", left: "50%",
    transform: "translateX(-50%)",
    textAlign: "center", maxWidth: "500px",
    opacity: "0", transition: "opacity .7s ease",
    pointerEvents: "none",
  });
  container.appendChild(quote);
  setTimeout(() => quote.style.opacity = "1", 1850);

  // ── Particles + mist ──
  type P = { x:number;y:number;vx:number;vy:number;life:number;decay:number;r:number };
  const particles: P[] = [];
  const mist: (P & {mr:number})[] = [];

  for (let i = 0; i < 90; i++) {
    const a = Math.random() * Math.PI * 2, s = 1.5 + Math.random() * 5;
    particles.push({ x:cx, y:cy, vx:Math.cos(a)*s, vy:Math.sin(a)*s-2.5,
      life:1, decay:0.008+Math.random()*0.014, r:1.2+Math.random()*3.5 });
  }
  for (let i = 0; i < 35; i++) {
    mist.push({ x:cx+(Math.random()-.5)*220, y:cy+(Math.random()-.5)*100,
      vx:(Math.random()-.5)*.5, vy:-Math.random()*.65, life:1, decay:0.004, r:0, mr:28+Math.random()*50 });
  }

  function drawStag(x: number, y: number, sc: number, al: number) {
    ctx.save();
    ctx.globalAlpha = al;
    ctx.translate(x, y - 85);
    ctx.scale(sc, sc);
    ctx.strokeStyle = "rgba(210,235,255,0.95)";
    ctx.lineWidth = 2.1;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.shadowColor = "rgba(160,210,255,1)"; ctx.shadowBlur = 22;
    // Halo
    const g = ctx.createRadialGradient(0,0,0,0,0,130);
    g.addColorStop(0,"rgba(180,215,255,0.17)"); g.addColorStop(1,"rgba(100,160,255,0)");
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,0,130,0,Math.PI*2); ctx.fill();
    // Body
    ctx.beginPath(); ctx.ellipse(0,10,40,23,0,0,Math.PI*2); ctx.stroke();
    // Neck
    ctx.beginPath(); ctx.moveTo(-10,-10); ctx.quadraticCurveTo(-5,-40,6,-57); ctx.stroke();
    // Head
    ctx.beginPath(); ctx.ellipse(9,-64,13,9,0.3,0,Math.PI*2); ctx.stroke();
    // Snout
    ctx.beginPath(); ctx.moveTo(18,-60); ctx.lineTo(29,-58); ctx.stroke();
    // Eye
    ctx.beginPath(); ctx.arc(13,-68,2,0,Math.PI*2);
    ctx.fillStyle="rgba(210,235,255,0.9)"; ctx.fill();
    // Legs
    [[-21,30,-23,66],[-7,30,-5,66],[10,30,12,66],[25,28,28,66]].forEach(([x1,y1,x2,y2])=>{
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    });
    // Left antler
    ctx.lineWidth=1.7;
    ctx.beginPath(); ctx.moveTo(-1,-72); ctx.lineTo(-10,-97); ctx.lineTo(-22,-112);
    ctx.moveTo(-10,-97); ctx.lineTo(-3,-111); ctx.moveTo(-10,-97); ctx.lineTo(-17,-104); ctx.stroke();
    // Right antler
    ctx.beginPath(); ctx.moveTo(14,-74); ctx.lineTo(23,-99); ctx.lineTo(33,-115);
    ctx.moveTo(23,-99); ctx.lineTo(17,-112); ctx.moveTo(23,-99); ctx.lineTo(29,-106); ctx.stroke();
    // Tail
    ctx.beginPath(); ctx.moveTo(38,-2); ctx.quadraticCurveTo(54,-14,46,-28); ctx.stroke();
    ctx.restore();
  }

  let t = 0, stagAlpha = 0, stagScale = 0, raf = 0;

  function frame() {
    raf = requestAnimationFrame(frame);
    t++;
    ctx.clearRect(0, 0, cv.width, cv.height);

    // Mist
    mist.forEach(p => {
      p.x+=p.vx; p.y+=p.vy; p.life-=p.decay;
      if (p.life > 0) {
        const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.mr);
        g.addColorStop(0,`rgba(160,200,255,${p.life*0.10})`); g.addColorStop(1,"transparent");
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,p.mr,0,Math.PI*2); ctx.fill();
      }
    });

    // Stag
    if (t > 18) { stagAlpha=Math.min(stagAlpha+0.045,0.95); stagScale=Math.min(stagScale+0.055,1); }
    if (t > 210) stagAlpha = Math.max(stagAlpha-0.022, 0);
    if (stagAlpha > 0) {
      drawStag(cx, cy, stagScale, stagAlpha);
      if (t%3===0) {
        const a=Math.random()*Math.PI*2, d=55+Math.random()*75;
        particles.push({ x:cx+Math.cos(a)*d, y:cy-85+Math.sin(a)*d*.5,
          vx:(Math.random()-.5)*.7, vy:-Math.random()*1.1, life:.7, decay:0.02, r:1+Math.random()*2 });
      }
    }

    // Particles
    for (let i = particles.length-1; i >= 0; i--) {
      const p = particles[i];
      p.x+=p.vx; p.y+=p.vy; p.vy+=0.03; p.vx*=.97; p.vy*=.97; p.life-=p.decay;
      if (p.life <= 0) { particles.splice(i,1); continue; }
      ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(p.r*p.life,.3), 0, Math.PI*2);
      ctx.fillStyle=`rgba(190,225,255,${p.life*.8})`;
      ctx.shadowColor="rgba(150,200,255,.7)"; ctx.shadowBlur=8;
      ctx.fill(); ctx.shadowBlur=0;
    }

    if (t > 270) { cancelAnimationFrame(raf); cleanup(); }
  }
  raf = requestAnimationFrame(frame);

  function cleanup() {
    container.style.opacity = "0";
    container.style.transition = "opacity .6s";
    setTimeout(() => { container.remove(); (window as any).__patronusActive = false; }, 700);
  }

  // Auto cleanup at 4.5s
  setTimeout(() => { cancelAnimationFrame(raf); cleanup(); }, 4500);
}
