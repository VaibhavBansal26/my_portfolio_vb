"use client";
import { useEffect, useRef } from "react";

const SKILLS = [
  "Python","React","Next.js","TypeScript","AI/ML",
  "LangChain","RAG","Docker","AWS","Node.js",
  "FastAPI","PyTorch","Kafka","Airflow","Spark",
  "PostgreSQL","MongoDB","Redis","K8s","Java",
  "TensorFlow","Scikit-learn","Snowflake","Flask","Git",
];

export default function SkillSphere() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;

    const W = cv.offsetWidth, H = cv.offsetHeight;
    cv.width = W; cv.height = H;
    const cx = W / 2, cy = H / 2;
    const R = Math.min(W, H) * 0.38;

    // Spherical fibonacci layout
    const pts = SKILLS.map((skill, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / SKILLS.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      return { skill, phi, theta, x: 0, y: 0, z: 0, scale: 1, alpha: 1 };
    });

    let rotX = 0.3, rotY = 0;
    let mouseX = 0, mouseY = 0;
    let isDragging = false, lastMX = 0, lastMY = 0;
    let velX = 0.002, velY = 0.006;

    const onMouseDown = (e: MouseEvent) => { isDragging = true; lastMX = e.clientX; lastMY = e.clientY; };
    const onMouseUp = () => { isDragging = false; };
    const onMouseMove = (e: MouseEvent) => {
      const r = cv.getBoundingClientRect();
      mouseX = (e.clientX - r.left - W/2) / W;
      mouseY = (e.clientY - r.top  - H/2) / H;
      if (isDragging) {
        velY = (e.clientX - lastMX) * 0.008;
        velX = (e.clientY - lastMY) * 0.008;
        lastMX = e.clientX; lastMY = e.clientY;
      }
    };

    cv.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    cv.addEventListener("mousemove", onMouseMove);

    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Subtle glow center
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.6);
      grd.addColorStop(0, "rgba(232,168,56,0.04)");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();

      // Draw wireframe sphere circles
      ctx.strokeStyle = "rgba(232,168,56,0.06)";
      ctx.lineWidth = 0.5;
      for (let lat = -60; lat <= 60; lat += 30) {
        const r2 = R * Math.cos(lat * Math.PI / 180);
        const y2 = R * Math.sin(lat * Math.PI / 180);
        ctx.beginPath(); ctx.arc(cx, cy + y2, r2, 0, Math.PI * 2); ctx.stroke();
      }
      for (let lon = 0; lon < 180; lon += 30) {
        ctx.beginPath();
        for (let t = 0; t <= Math.PI * 2; t += 0.05) {
          const x2 = R * Math.cos(t) * Math.cos(lon * Math.PI / 180);
          const z2 = R * Math.cos(t) * Math.sin(lon * Math.PI / 180);
          const y2 = R * Math.sin(t);
          // Apply rotation
          const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
          const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
          const x3 = x2 * cosY - z2 * sinY;
          const z3 = x2 * sinY + z2 * cosY;
          const y3 = y2 * cosX - z3 * sinX;
          const z4 = y2 * sinX + z3 * cosX;
          const persp = 600 / (600 + z4);
          if (t === 0) ctx.moveTo(cx + x3 * persp, cy + y3 * persp);
          else ctx.lineTo(cx + x3 * persp, cy + y3 * persp);
        }
        ctx.stroke();
      }

      // Project and sort skills by z
      const projected = pts.map(p => {
        const x0 = R * Math.sin(p.phi) * Math.cos(p.theta);
        const y0 = R * Math.cos(p.phi);
        const z0 = R * Math.sin(p.phi) * Math.sin(p.theta);
        // Rotate Y
        const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
        const x1 = x0 * cosY - z0 * sinY;
        const z1 = x0 * sinY + z0 * cosY;
        // Rotate X
        const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
        const y1 = y0 * cosX - z1 * sinX;
        const z2 = y0 * sinX + z1 * cosX;
        const persp = 600 / (600 + z2);
        const alpha = (z2 / R + 1) / 2; // 0 = back, 1 = front
        return { skill: p.skill, sx: cx + x1 * persp, sy: cy + y1 * persp, z: z2, alpha, scale: persp };
      }).sort((a, b) => a.z - b.z);

      projected.forEach(p => {
        const size = 10 * p.scale;
        const opacity = 0.25 + p.alpha * 0.75;
        ctx.font = `${size + 1}px 'JetBrains Mono', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // Glow for front-facing
        if (p.alpha > 0.7) {
          ctx.shadowColor = "#e8a838";
          ctx.shadowBlur = 6 * p.alpha;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fillStyle = `rgba(232,168,56,${opacity})`;
        ctx.fillText(p.skill, p.sx, p.sy);
      });
      ctx.shadowBlur = 0;

      // Auto-rotate + mouse influence
      if (!isDragging) {
        velX *= 0.96;
        velY *= 0.96;
        rotY += 0.004 + mouseX * 0.003;
        rotX += 0.001 + mouseY * 0.001;
      } else {
        rotX += velX;
        rotY += velY;
      }

      id = requestAnimationFrame(draw);
    };
    id = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(id);
      cv.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      cv.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div className="w-full h-[460px] relative">
      <canvas
        ref={ref}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ touchAction: "none" }}
      />
      <p className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-widest uppercase"
        style={{ color: "rgba(232,168,56,0.3)" }}>
        drag to rotate
      </p>
    </div>
  );
}
