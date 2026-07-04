"use client";
import { useEffect, useState, useRef } from "react";

/**
 * #7 Live data + #16(28) visible telemetry + #10(22) presence.
 * Real GitHub stats, npm downloads, live FPS, page weight, visitor count.
 * Every value is real or hidden — no fakes.
 */
type Item = { label: string; value: string };

export default function LiveTelemetry() {
  const [items, setItems] = useState<Item[]>([]);
  const [fps, setFps] = useState(0);
  const frames = useRef(0);

  // Live FPS
  useEffect(() => {
    let id: number, last = performance.now();
    const loop = (now: number) => {
      frames.current++;
      if (now - last >= 1000) { setFps(frames.current); frames.current = 0; last = now; }
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const out: Item[] = [];
    // Page weight — real transfer sizes
    try {
      const kb = performance.getEntriesByType("resource")
        .reduce((s, e) => s + ((e as PerformanceResourceTiming).transferSize || 0), 0) / 1024;
      if (kb > 0) out.push({ label: "PAGE WEIGHT", value: `${Math.round(kb)} KB` });
    } catch {}

    Promise.allSettled([
      fetch("/api/github-stats").then(r => r.json()),
      fetch("https://api.npmjs.org/downloads/point/last-week/grapesjs-advance-components").then(r => r.json()),
      fetch("/api/presence").then(r => r.json()),
    ]).then(([gh, npm, pres]) => {
      if (gh.status === "fulfilled" && gh.value?.publicRepos)
        out.push({ label: "GITHUB REPOS", value: `${gh.value.publicRepos}` });
      if (npm.status === "fulfilled" && npm.value?.downloads)
        out.push({ label: "NPM / WK", value: `${npm.value.downloads}` });
      if (pres.status === "fulfilled" && pres.value?.today)
        out.push({ label: "VISITOR", value: `#${pres.value.today} TODAY` });
      setItems([...out]);
    });
  }, []);

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-[9px] tracking-[.2em] uppercase"
      style={{ color: "var(--text-muted)" }}>
      <span><span style={{ color: "var(--reactor)" }}>●</span> FPS {fps || "—"}</span>
      {items.map(i => (
        <span key={i.label}>{i.label} <span style={{ color: "var(--text)" }}>{i.value}</span></span>
      ))}
      <span suppressHydrationWarning>RENDERED {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
    </div>
  );
}
