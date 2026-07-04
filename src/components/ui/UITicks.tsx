"use client";
import { useEffect, useRef } from "react";

/**
 * #12 Sound micro-design — sub-50ms WebAudio ticks on interactive hover/click.
 * Off by default; toggled from the FRIDAY console (⌘K).
 */
export default function UITicks() {
  const ctxRef = useRef<AudioContext | null>(null);
  const enabled = useRef(false);

  useEffect(() => {
    try { enabled.current = localStorage.getItem("vb_ticks") === "1"; } catch {}

    const blip = (freq: number, gain: number, dur: number) => {
      if (!enabled.current) return;
      if (!ctxRef.current) ctxRef.current = new AudioContext();
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(gain, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      o.connect(g).connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime + dur);
    };

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest?.("a,button,[role=button]")) blip(2200, 0.012, 0.03);
    };
    const onDown = () => blip(1400, 0.02, 0.05);
    const onToggle = () => {
      enabled.current = !enabled.current;
      try { localStorage.setItem("vb_ticks", enabled.current ? "1" : "0"); } catch {}
      if (enabled.current) blip(1800, 0.03, 0.08);
    };

    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("vb-ticks-toggle", onToggle);
    return () => {
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("vb-ticks-toggle", onToggle);
    };
  }, []);

  return null;
}
