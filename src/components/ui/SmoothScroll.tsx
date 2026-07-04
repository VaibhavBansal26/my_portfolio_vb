"use client";
import { useEffect } from "react";
import Lenis from "lenis";

/**
 * FRIDAY · Inertia smooth-scroll (Lenis).
 * Respects prefers-reduced-motion — disabled entirely for those users.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.09, duration: 1.15, smoothWheel: true });

    let id: number;
    const raf = (time: number) => { lenis.raf(time); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);

    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);

  return <>{children}</>;
}
