"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { personal } from "@/data/portfolio";
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from "react-icons/fi";
import { SiLeetcode, SiMedium, SiNpm } from "react-icons/si";

const socials = [
  { href: personal.github, icon: <FiGithub size={16} />, label: "GitHub" },
  { href: personal.linkedin, icon: <FiLinkedin size={16} />, label: "LinkedIn" },
  { href: personal.leetcode, icon: <SiLeetcode size={14} />, label: "LeetCode" },
  { href: personal.medium, icon: <SiMedium size={16} />, label: "Medium" },
  { href: personal.twitter, icon: <FiTwitter size={16} />, label: "Twitter" },
  { href: `mailto:${personal.email}`, icon: <FiMail size={16} />, label: "Email" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] relative">
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, var(--accent), transparent)", opacity: 0.4 }} />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-display text-xl font-extrabold gradient-text">Vaibhav Bansal</p>
            <p className="font-mono text-[10px] text-[var(--text-muted)] mt-1 tracking-widest uppercase">
              Software Engineer · AI Engineer · United States
            </p>
          </div>
          <div className="flex items-center gap-5">
            {socials.map(({ href, icon, label }) => (
              <motion.a key={label} href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer" aria-label={label}
                whileHover={{ scale: 1.2, y: -2 }}
                className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                {icon}
              </motion.a>
            ))}
          </div>
          <p className="font-mono text-[10px] text-[var(--text-muted)]">
            © {new Date().getFullYear()} · Next.js + Three.js + Claude AI
          </p>
        </div>
      </div>
    </footer>
  );
}
