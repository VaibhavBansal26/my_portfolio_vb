"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { blogs, certifications } from "@/data/portfolio";
import { FiExternalLink, FiClock, FiTag } from "react-icons/fi";

export default function BlogGrid() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div ref={ref}>
      {/* Blog posts */}
      <div className="grid md:grid-cols-2 gap-6 mb-20">
        {blogs.map((post, i) => (
          <motion.div
            key={post.title}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Link
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block border border-[var(--border)] p-7 hover:border-[var(--accent)]/50 transition-all card-hover relative"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] text-[var(--text-muted)]">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1 font-mono text-[10px] text-[var(--text-muted)]">
                  <FiClock size={10} /> {post.readTime}
                </span>
              </div>

              <h2 className="font-display text-xl font-bold group-hover:text-[var(--accent)] transition-colors leading-snug">
                {post.title}
              </h2>

              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 font-mono text-[10px] text-[var(--text-muted)]"
                  >
                    <FiTag size={9} /> {tag}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-1 font-mono text-xs text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                Read on Medium <FiExternalLink size={12} />
              </div>

              <div className="absolute bottom-0 left-0 h-px w-0 bg-[var(--accent)] group-hover:w-full transition-all duration-500" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Certifications */}
      <div>
        <span className="section-label">Credentials</span>
        <h2 className="font-display text-3xl font-bold mt-2 mb-8">Certifications</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
              className="flex items-center gap-4 border border-[var(--border)] p-5 hover:border-[var(--accent)]/50 transition-colors group"
            >
              <div className="w-10 h-10 flex-shrink-0 border border-[var(--border)] flex items-center justify-center bg-[var(--bg-secondary)]">
                <span className="font-mono text-[10px] text-[var(--accent)] font-bold">
                  {cert.issuer.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium group-hover:text-[var(--accent)] transition-colors">
                  {cert.title}
                </p>
                <p className="font-mono text-[10px] text-[var(--text-muted)] mt-0.5">
                  {cert.issuer} · {cert.year}
                </p>
              </div>
              <Link
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors flex-shrink-0"
                aria-label="View Certification"
              >
                <FiExternalLink size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
