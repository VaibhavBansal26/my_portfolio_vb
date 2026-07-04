"use client";

/**
 * Techno-brutalist marquee — bold scrolling type band, slightly tilted.
 * Pure CSS animation (GPU transform), pauses for reduced motion via global guard.
 */
const ITEMS = [
  "AI ENGINEER", "RAG PIPELINES", "LLMOPS", "FULL-STACK", "OPEN SOURCE AUTHOR",
  "5+ YEARS SHIPPING", "M.S. DATA SCIENCE", "TIMES SQUARE FEATURED",
];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS]; // duplicate for seamless loop
  return (
    <div aria-hidden style={{
      transform: "rotate(-1.2deg) scale(1.02)",
      background: "var(--accent)", overflow: "hidden",
      padding: "14px 0", margin: "48px 0",
    }}>
      <div className="vb-marquee" style={{ display: "flex", gap: 0, width: "max-content" }}>
        {row.map((item, i) => (
          <span key={i} className="font-display font-extrabold"
            style={{ fontSize: 20, letterSpacing: ".02em", color: "var(--bg)",
              whiteSpace: "nowrap", padding: "0 18px", display: "flex", alignItems: "center", gap: 36 }}>
            {item}
            <span style={{ fontSize: 12, opacity: .55 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
