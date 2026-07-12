import type { Metadata } from "next";
import ResumeView from "@/components/sections/ResumeView";

export const metadata: Metadata = {
  title: "Resume — AI Engineer & Software Developer",
  description: "Resume of Vaibhav Bansal — Software Engineer & AI Engineer. 5+ years experience. Python, React, AWS, LLMs, Docker.",
  alternates: { canonical: "https://www.thevaibhavbansal.com/resume" },
  openGraph: {
    title: "Resume — Vaibhav Bansal, AI Engineer & Software Developer",
    description: "5+ years experience. Python, React, AWS, LLMs, Docker. M.S. Data Science, SUNY Buffalo.",
    url: "https://www.thevaibhavbansal.com/resume",
    type: "profile",
  },
};

export default function ResumePage() {
  return (
    <main className="pt-32 pb-24 max-w-4xl mx-auto px-6">
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="section-label">CV / Resume</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-2">Resume</h1>
        </div>
        <a
          href="/resume/Vaibhav_Bansal_Resume.pdf"
          download
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-[#0a0a0a] font-mono text-xs tracking-wider uppercase font-medium hover:opacity-90 transition-opacity"
        >
          ↓ Download PDF
        </a>
      </div>
      <ResumeView />
    </main>
  );
}
