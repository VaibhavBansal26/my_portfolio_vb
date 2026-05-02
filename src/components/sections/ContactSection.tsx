"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { personal } from "@/data/portfolio";
import { useState } from "react";
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiSend } from "react-icons/fi";
import { SiLeetcode, SiMedium, SiNpm } from "react-icons/si";

const socials = [
  { label: "GitHub", href: personal.github, icon: <FiGithub size={20} />, desc: "95+ repos" },
  { label: "LinkedIn", href: personal.linkedin, icon: <FiLinkedin size={20} />, desc: "Connect professionally" },
  { label: "LeetCode", href: personal.leetcode, icon: <SiLeetcode size={18} />, desc: "200+ problems solved" },
  { label: "Medium", href: personal.medium, icon: <SiMedium size={20} />, desc: "Tech articles & tutorials" },
  { label: "Twitter", href: personal.twitter, icon: <FiTwitter size={20} />, desc: "@Vaibhavbansal26" },
  { label: "npm", href: personal.npmPackage, icon: <SiNpm size={22} />, desc: "grapesjs-advance-components" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:${personal.email}?subject=Portfolio Contact from ${form.name}&body=${encodeURIComponent(form.message)}%0A%0AFrom: ${form.name} (${form.email})`;
    window.location.href = mailtoLink;
    setSent(true);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <span className="section-label">Get In Touch</span>
        <h1 className="font-display text-5xl md:text-6xl font-extrabold mt-2 mb-3">
          Let&apos;s <span className="gradient-text">Connect</span>
        </h1>
        <p className="text-[var(--text-muted)] text-sm max-w-xl mb-14">
          Open to new opportunities, collaborations, and interesting conversations.
          Drop a message or find me on any platform below.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Form */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          {sent ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="border border-[var(--accent)]/50 bg-[var(--accent-glow)] p-10 text-center"
              style={{ boxShadow: "0 0 30px var(--accent-glow)" }}
            >
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5 }}
                className="text-4xl mb-3">✓</motion.div>
              <p className="font-display text-2xl font-bold text-[var(--accent)]">Message Sent!</p>
              <p className="text-[var(--text-muted)] text-sm mt-2">Your mail client should open. Looking forward to connecting!</p>
              <button onClick={() => setSent(false)}
                className="mt-5 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors uppercase tracking-wider">
                Send another →
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { label: "Name", key: "name", type: "text", placeholder: "Your name" },
                { label: "Email", key: "email", type: "email", placeholder: "your@email.com" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-2">
                    {label}
                  </label>
                  <input
                    type={type}
                    required
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    onFocus={() => setFocused(key)}
                    onBlur={() => setFocused(null)}
                    className="w-full bg-[var(--bg-card)] border border-[var(--border)] px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none transition-all font-body"
                    style={{ borderColor: focused === key ? "var(--accent)" : undefined, boxShadow: focused === key ? "0 0 12px var(--accent-glow)" : undefined }}
                  />
                </div>
              ))}
              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-2">Message</label>
                <textarea
                  required rows={5} placeholder="Tell me about your project or idea..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border)] px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none transition-all resize-none font-body"
                  style={{ borderColor: focused === "message" ? "var(--accent)" : undefined, boxShadow: focused === "message" ? "0 0 12px var(--accent-glow)" : undefined }}
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex items-center gap-2 w-full justify-center py-3 bg-[var(--accent)] text-[#050d1a] font-mono text-xs tracking-wider uppercase font-bold overflow-hidden"
                style={{ boxShadow: "0 0 20px var(--accent-glow)" }}
              >
                <motion.span className="absolute inset-0 bg-white/20" initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.4 }} />
                <FiSend size={13} className="group-hover:translate-x-1 transition-transform" />
                Send Message
              </motion.button>
            </form>
          )}

          <div className="mt-5 flex items-center gap-2">
            <FiMail size={13} className="text-[var(--text-muted)]" />
            <a href={`mailto:${personal.email}`} className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
              {personal.email}
            </a>
          </div>
        </motion.div>

        {/* Social links */}
        <motion.div
          variants={container} initial="hidden" animate="show"
          className="flex flex-col gap-3"
        >
          <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Find me on</p>
          {socials.map(({ label, href, icon, desc }) => (
            <motion.a
              key={label}
              variants={item}
              href={href}
              target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-4 border border-[var(--border)] bg-[var(--bg-card)] px-5 py-4 hover:border-[var(--accent)]/50 transition-all card-glow"
            >
              <span className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">{icon}</span>
              <div>
                <p className="font-mono text-xs font-medium group-hover:text-[var(--accent)] transition-colors">{label}</p>
                <p className="font-mono text-[10px] text-[var(--text-muted)]">{desc}</p>
              </div>
              <motion.span className="ml-auto opacity-0 group-hover:opacity-100 text-[var(--accent)] transition-opacity"
                animate={{ x: [0, 4, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                →
              </motion.span>
            </motion.a>
          ))}

          <div className="mt-4 border border-[var(--border)] bg-[var(--bg-card)] p-5"
            style={{ boxShadow: "0 0 20px rgba(0,212,255,0.03)" }}>
            <p className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-wider mb-2">Location</p>
            <p className="font-display text-lg font-bold">United States</p>
            <p className="font-mono text-xs text-[var(--text-muted)] mt-1">Open to remote & relocation opportunities</p>
          </div>

          {/* Coffee Chat / Book a Call */}
          <div style={{ marginTop:16, border:"1px solid rgba(232,168,56,.35)", background:"rgba(232,168,56,.04)", padding:"20px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(to right,#e8a838,rgba(232,168,56,.2))" }}/>
            <p className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-wider mb-2">☕ Coffee Chat</p>
            <p className="font-display text-base font-bold mb-2">Let&apos;s Talk</p>
            <p className="font-mono text-xs text-[var(--text-muted)] leading-relaxed mb-4">
              Got a project, opportunity, or just want to connect? Book a free 30-minute call — no agenda, just a genuine conversation.
            </p>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <a href="https://calendly.com/vaibhav-bansal945" target="_blank" rel="noopener noreferrer"
                style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"10px 18px", background:"#e8a838", color:"#0e0e0e", textDecoration:"none", fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, letterSpacing:".12em", textTransform:"uppercase" }}>
                📅 Book a Call
              </a>
              <a href="mailto:vaibhav.bansal945@gmail.com?subject=Coffee Chat — Let's Connect"
                style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"10px 18px", border:"1px solid rgba(232,168,56,.4)", color:"#e8a838", textDecoration:"none", fontFamily:"'JetBrains Mono',monospace", fontSize:9, letterSpacing:".12em", textTransform:"uppercase" }}>
                ✉️ Email Me
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
