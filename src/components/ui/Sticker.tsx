"use client";
import { motion } from "framer-motion";

/**
 * #15(3) Peelable sticker — draggable: lifts, tilts and shadows while
 * dragged, springs home on release. Wrap any small element.
 */
export default function Sticker({ children }: { children: React.ReactNode }) {
  return (
    <motion.div className="vb-sticker inline-block"
      drag dragSnapToOrigin dragElastic={0.35}
      whileDrag={{ scale: 1.12, rotate: 6, zIndex: 60,
        filter: "drop-shadow(0 14px 22px rgba(0,0,0,.45))" }}
      whileHover={{ rotate: -2, scale: 1.04 }}
      style={{ touchAction: "none" }}>
      {children}
    </motion.div>
  );
}
