"use client";
import { motion } from "framer-motion";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  // Simple fade-in only, no AnimatePresence (which breaks App Router)
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .4, ease: [.22,1,.36,1] }}>
      {children}
    </motion.div>
  );
}
