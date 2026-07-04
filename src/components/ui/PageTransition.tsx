"use client";
import { motion } from "framer-motion";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  // Soft cinematic entrance — no AnimatePresence (breaks App Router)
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: .6, ease: [.22, 1, .36, 1] }}>
      {children}
    </motion.div>
  );
}
