"use client";
import { useRef, useEffect, useState } from "react";

/**
 * #14(2) Elastic divider — a hairline that bends away from the cursor
 * and snaps back like a plucked string.
 */
export default function ElasticDivider({ color = "var(--border-bright)" }: { color?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [d, setD] = useState("M0 20 Q 500 20 1000 20");

  useEffect(() => {
    const svg = ref.current; if (!svg) return;
    let bend = 0, bx = 500, target = 0, id: number;

    const onMove = (e: MouseEvent) => {
      const r = svg.getBoundingClientRect();
      if (e.clientY > r.top - 80 && e.clientY < r.bottom + 80) {
        bx = ((e.clientX - r.left) / r.width) * 1000;
        target = Math.max(-36, Math.min(36, (e.clientY - (r.top + r.height / 2)) * 1.1));
      } else target = 0;
    };
    const loop = () => {
      bend += (target - bend) * 0.12;           // chase
      if (Math.abs(target) < 0.5) bend *= 0.92; // spring back
      setD(`M0 20 Q ${bx} ${20 + bend} 1000 20`);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => { cancelAnimationFrame(id); window.removeEventListener("mousemove", onMove); };
  }, []);

  return (
    <svg ref={ref} viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden
      style={{ width: "100%", height: 40, display: "block" }}>
      <path d={d} fill="none" stroke={color} strokeWidth="1" />
    </svg>
  );
}
