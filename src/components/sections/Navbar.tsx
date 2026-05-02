"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineSun, HiOutlineMoon, HiMenuAlt4, HiX } from "react-icons/hi";

const navLinks = [
  { href: "/",          label: "Home" },
  { href: "/about",     label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/resume",    label: "Resume" },
  { href: "/blog",      label: "Blog" },
  { href: "/contact",   label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDark = resolvedTheme === "dark";
  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={scrolled ? {
        paddingTop: 12, paddingBottom: 12,
        background: "rgba(14,14,14,0.9)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        boxShadow: "0 0 20px rgba(232,168,56,0.05)",
      } : { paddingTop: 20, paddingBottom: 20 }}
    >
      <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight flex items-center gap-0.5">
          <span className="gradient-text">V</span>
          <span style={{ color: "var(--text)" }}>B</span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.1, repeat: Infinity }}
            style={{ display: "inline-block", width: 2, height: 22, background: "#e8a838", marginLeft: 2, verticalAlign: "middle" }}
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8" style={{ listStyle: "none" }}>
          {navLinks.map(({ href, label }) => (
            <li key={href} style={{ position: "relative" }}>
              <Link
                href={href}
                className="font-mono text-[11px] tracking-widest uppercase transition-colors"
                style={{ color: pathname === href ? "#e8a838" : "var(--text-muted)", textDecoration: "none" }}
              >
                {label}
              </Link>
              {pathname === href && (
                <motion.div
                  layoutId="nav-line"
                  style={{
                    position: "absolute", bottom: -4, left: 0, right: 0,
                    height: 1, background: "#e8a838",
                    boxShadow: "0 0 6px #e8a838",
                  }}
                />
              )}
            </li>
          ))}
        </ul>

        {/* Right: theme toggle + mobile menu */}
        <div className="flex items-center gap-3">

          {/* Theme toggle — only shown after mount to avoid hydration mismatch */}
          {mounted && (
            <motion.button
              onClick={toggle}
              whileHover={{ scale: 1.15, rotate: 20 }}
              whileTap={{ scale: 0.88 }}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              style={{
                padding: 8, borderRadius: "50%",
                border: "1px solid var(--border-bright)",
                background: "transparent",
                color: "var(--text-muted)",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.color = "#e8a838";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#e8a838";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-bright)";
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? "sun" : "moon"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{   rotate:  90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <HiOutlineSun size={17} /> : <HiOutlineMoon size={17} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="md:hidden"
            aria-label="Toggle menu"
            style={{
              padding: 8, background: "transparent", border: "none",
              color: "var(--text-muted)", cursor: "pointer",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div key={menuOpen ? "x" : "menu"}
                initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                {menuOpen ? <HiX size={22} /> : <HiMenuAlt4 size={22} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", borderTop: "1px solid var(--border)", background: "var(--bg-card)" }}
          >
            <ul style={{ listStyle: "none", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
              {navLinks.map(({ href, label }, i) => (
                <motion.li key={href}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}>
                  <Link href={href} onClick={() => setMenuOpen(false)}
                    className="font-mono text-xs tracking-widest uppercase"
                    style={{ color: pathname === href ? "#e8a838" : "var(--text-muted)", textDecoration: "none" }}>
                    {pathname === href && <span style={{ marginRight: 8 }}>›</span>}
                    {label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
