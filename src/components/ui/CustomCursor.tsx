"use client";
import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * FRIDAY · Cursor — motion-value driven: zero React re-renders.
 * Dot tracks instantly; ring trails on a spring. Expands over interactive elements.
 */
export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 300, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 300, damping: 28, mass: 0.6 });
  const ringScale = useMotionValue(1);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement;
      ringScale.set(t.closest("a,button,[role=button],input,textarea") ? 1.8 : 1);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y, ringScale]);

  return (
    <>
      <motion.div className="custom-cursor hidden md:block"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }} />
      <motion.div className="cursor-ring hidden md:block"
        style={{ x: ringX, y: ringY, scale: ringScale, translateX: "-50%", translateY: "-50%" }} />
    </>
  );
}
