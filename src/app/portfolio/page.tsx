import type { Metadata } from "next";
import ProjectsGrid from "@/components/sections/ProjectsGrid";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Projects by Vaibhav Bansal — AI systems, LLM applications, RAG pipelines, full-stack web apps, data engineering, and open-source contributions. Production-grade software shipped at scale.",
  keywords: [
    "AI projects portfolio","LangChain projects","RAG pipeline","full stack projects",
    "machine learning projects","data engineering portfolio","open source npm","React projects",
    "Next.js portfolio","Python AI projects","disaster response AI","MLOps pipeline",
  ],
  openGraph: {
    title: "Portfolio | Vaibhav Bansal",
    description: "AI systems · LLM apps · Full-stack · Data engineering · Open source. 40+ projects shipped.",
    url: "https://www.vaibhavbansal.in/portfolio",
  },
};

export default function PortfolioPage() {
  return (
    <main className="pt-32 pb-24 max-w-6xl mx-auto px-6">
      <div className="mb-14">
        <span className="section-label">My Work</span>
        <h1 className="font-display text-4xl md:text-6xl font-bold mt-2">Portfolio</h1>
        <p className="text-[var(--text-muted)] text-sm mt-3 max-w-xl">
          A collection of projects spanning AI/ML, full-stack development, data engineering,
          and open-source contributions. Built with purpose, shipped to production.
        </p>
      </div>
      <ProjectsGrid />
    </main>
  );
}
