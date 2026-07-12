"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { personal } from "@/data/portfolio";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import { SiLeetcode, SiOrcid } from "react-icons/si";

export default function AboutHero() {
  return (
    <section className="pt-32 pb-20 max-w-6xl mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-16 items-start">
        {/* Avatar + links */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative w-52 h-52 rounded-sm overflow-hidden border border-[var(--accent)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={personal.avatar}
              alt="Vaibhav Bansal"
              style={{ width:"100%", height:"100%", objectFit:"cover" }}
            />
          </div>

          <div>
            <p className="font-display text-xl font-bold text-center">{personal.name}</p>
            <p className="font-mono text-xs text-[var(--text-muted)] text-center mt-1">
              {personal.location}
            </p>
          </div>

          <div className="flex gap-4">
            {[
              { href: personal.github, icon: <FiGithub size={18} />, label: "GitHub" },
              { href: personal.linkedin, icon: <FiLinkedin size={18} />, label: "LinkedIn" },
              { href: personal.leetcode, icon: <SiLeetcode size={16} />, label: "LeetCode" },
              { href: personal.orcid, icon: <SiOrcid size={16} />, label: "ORCID" },
              { href: personal.twitter, icon: <FiTwitter size={18} />, label: "Twitter" },
            ].map(({ href, icon, label }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
              >
                {icon}
              </Link>
            ))}
          </div>

          <Link
            href={personal.website}
            className="font-mono text-xs text-[var(--accent)] hover-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            thevaibhavbansal.com
          </Link>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="md:col-span-2"
        >
          <span className="section-label">About Me</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 leading-tight">
            Software Engineer &<br />
            <span className="text-[var(--accent)]">AI Engineer</span>
          </h1>

          <div className="mt-6 space-y-4 text-[var(--text-muted)] text-sm leading-relaxed">
            <p>
              I&apos;m <strong className="text-[var(--text)]">Vaibhav Bansal</strong> — a Software Engineer and AI Engineer
              with 5+ years of experience building scalable applications and intelligent systems.
              Currently based in United States, New York after completing my{" "}
              <strong className="text-[var(--text)]">M.S. in Engineering Science & Data Science</strong> from
              the State University of New York at Buffalo (SUNY Buffalo).
            </p>
            <p>
              I&apos;ve worked at <strong className="text-[var(--text)]">Wipro Technologies</strong> and{" "}
              <strong className="text-[var(--text)]">DashClicks</strong>, architecting and deploying
              production-grade platforms that drive measurable business impact. At SUNY Buffalo, I served as
              a <strong className="text-[var(--text)]">Graduate Teaching Assistant</strong> (EAS 503 &amp; CDA 500),{" "}
              <strong className="text-[var(--text)]">Graduate Student Assistant</strong>, and currently a{" "}
              <strong className="text-[var(--text)]">Research Assistant</strong> working on applied AI/ML systems.
            </p>
            <p>
              I&apos;m passionate about modern AI-driven development — leveraging{" "}
              <strong className="text-[var(--text)]">LLMs, RAG architectures, LangChain</strong>, and AI-assisted
              workflows to build intelligent, user-centric products. I combine strong engineering fundamentals
              with applied AI to ship systems that are reliable, scalable, and production-ready.
            </p>
            <p>
              I also published an open-source npm package ({" "}
              <Link href={personal.npmPackage} target="_blank" className="text-[var(--accent)] hover-underline">
                grapesjs-advance-components
              </Link>{" "}
              ), co-authored a research paper, and was featured on a{" "}
              <strong className="text-[var(--text)]">Times Square billboard</strong>.
            </p>
          </div>

          {/* Quick facts */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { label: "Degree", value: "M.S. Data Science, SUNY Buffalo" },
              { label: "B.Tech", value: "Computer Science, VIT University" },
              { label: "Experience", value: "Wipro · DashClicks · SUNY UB" },
              { label: "Focus", value: "AI/ML · Full Stack · Cloud" },
            ].map(({ label, value }) => (
              <div key={label} className="border-l-2 border-[var(--accent)] pl-4">
                <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{label}</p>
                <p className="font-body text-sm mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
