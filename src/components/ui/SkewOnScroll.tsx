"use client";
import { motion, useScroll, useVelocity, useTransform, useSpring, useReducedMotion } from "framer-motion";

/**
 * #16(4) Scroll-velocity type — wrapped headlines skew with scroll speed
 * and settle when you stop. The page feels like it has mass.
 */
export default function SkewOnScroll({ children, max = 4 }: { children: React.ReactNode; max?: number }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const raw = useTransform(velocity, [-2000, 0, 2000], [max, 0, -max]);
  const skewY = useSpring(raw, { stiffness: 250, damping: 28 });

  if (reduce) return <>{children}</>;
  return <motion.div style={{ skewY }}>{children}</motion.div>;
}
