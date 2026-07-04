"use client";
import { useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { projects } from "@/data/portfolio";

/**
 * #18(6) Skill graph — force-directed knowledge graph connecting skills
 * to the featured projects that use them. Hover a node, its edges ignite.
 * Custom canvas sim, no deps. Pauses off-screen.
 */
export default function SkillGraph() {
  const cvRef = useRef<HTMLCanvasElement>(null);
  const { ref: ioRef, inView } = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (!inView) return;
    const cv = cvRef.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    const W = cv.width = cv.offsetWidth;
    const H = cv.height = 440;

    const featured = projects.filter(p => p.featured).slice(0, 6);
    type Node = { id: string; label: string; kind: "project" | "skill"; x: number; y: number; vx: number; vy: number };
    const skillSet = new Map<string, Node>();
    const nodes: Node[] = [];
    const edges: [Node, Node][] = [];

    featured.forEach((p, i) => {
      const pn: Node = { id: p.id, label: p.title.split("—")[0].slice(0, 22), kind: "project",
        x: W/2 + Math.cos(i/6*Math.PI*2) * W*0.22, y: H/2 + Math.sin(i/6*Math.PI*2) * H*0.3,
        vx: 0, vy: 0 };
      nodes.push(pn);
      p.tech.slice(0, 5).forEach(t => {
        let sn = skillSet.get(t);
        if (!sn) {
          sn = { id: `s-${t}`, label: t, kind: "skill",
            x: W/2 + (Math.random()-.5)*W*0.5, y: H/2 + (Math.random()-.5)*H*0.5, vx: 0, vy: 0 };
          skillSet.set(t, sn); nodes.push(sn);
        }
        edges.push([pn, sn]);
      });
    });

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: MouseEvent) => {
      const r = cv.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    cv.addEventListener("mousemove", onMove);

    const css = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

    let id: number, running = true;
    const tick = () => {
      if (!running) return;
      id = requestAnimationFrame(tick);
      // forces
      for (const a of nodes) {
        for (const b of nodes) {
          if (a === b) continue;
          const dx = a.x-b.x, dy = a.y-b.y;
          const d2 = Math.max(dx*dx+dy*dy, 40);
          const f = 1300 / d2;                       // repulsion
          a.vx += dx/Math.sqrt(d2)*f; a.vy += dy/Math.sqrt(d2)*f;
        }
        a.vx += (W/2-a.x)*0.0012; a.vy += (H/2-a.y)*0.0018; // centering
      }
      for (const [a,b] of edges) {                   // springs
        const dx = b.x-a.x, dy = b.y-a.y;
        const d = Math.hypot(dx,dy);
        const f = (d - 110) * 0.004;
        a.vx += dx/d*f; a.vy += dy/d*f;
        b.vx -= dx/d*f; b.vy -= dy/d*f;
      }
      for (const n of nodes) {
        n.vx *= 0.85; n.vy *= 0.85;
        n.x = Math.max(60, Math.min(W-60, n.x + n.vx));
        n.y = Math.max(30, Math.min(H-30, n.y + n.vy));
      }
      // hover detection
      let hot: Node | null = null;
      for (const n of nodes) {
        if (Math.hypot(n.x-mouse.x, n.y-mouse.y) < 26) { hot = n; break; }
      }
      // draw
      const accent = css("--accent") || "#e8a838";
      const reactor = css("--reactor") || "#4fd8eb";
      const muted = css("--text-muted") || "#7a7265";
      const text = css("--text") || "#f0ece4";
      ctx.clearRect(0,0,W,H);
      for (const [a,b] of edges) {
        const lit = hot && (a === hot || b === hot);
        ctx.strokeStyle = lit ? accent : "rgba(128,128,128,.13)";
        ctx.lineWidth = lit ? 1.4 : 0.7;
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
      for (const n of nodes) {
        const lit = hot && (n === hot || edges.some(([a,b]) => (a===hot&&b===n)||(b===hot&&a===n)));
        if (n.kind === "project") {
          ctx.fillStyle = lit || !hot ? accent : "rgba(128,128,128,.35)";
          ctx.beginPath(); ctx.arc(n.x,n.y,7,0,Math.PI*2); ctx.fill();
        } else {
          ctx.fillStyle = lit ? reactor : (hot ? "rgba(128,128,128,.3)" : reactor+"99");
          ctx.beginPath(); ctx.arc(n.x,n.y,3.5,0,Math.PI*2); ctx.fill();
        }
        ctx.font = `${n.kind==="project" ? "700 11px" : "10px"} 'JetBrains Mono', monospace`;
        ctx.fillStyle = lit ? text : (hot ? "rgba(128,128,128,.4)" : muted);
        ctx.fillText(n.label, n.x+10, n.y+4);
      }
      cv.style.cursor = hot ? "pointer" : "default";
    };
    id = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(id); cv.removeEventListener("mousemove", onMove); };
  }, [inView]);

  return (
    <section ref={ioRef} className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <span className="section-label">Knowledge Graph</span>
        <h2 className="font-display font-extrabold mt-2 mb-8" style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)" }}>
          skills <span style={{ color: "var(--accent)" }}>×</span> projects
        </h2>
        <canvas ref={cvRef} style={{ width: "100%", height: 440, display: "block",
          border: "1px solid var(--border)", background: "var(--bg-secondary)" }} />
        <p className="font-mono text-[9px] tracking-[.25em] uppercase mt-3" style={{ color: "var(--text-muted)" }}>
          live force simulation · hover a node
        </p>
      </div>
    </section>
  );
}
