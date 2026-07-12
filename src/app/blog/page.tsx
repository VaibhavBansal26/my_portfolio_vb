import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import BlogList from "@/components/sections/BlogList";

export const metadata: Metadata = {
  title: "Blog — AI, Software Engineering & Full Stack Development",
  description: "Technical articles by Vaibhav Bansal on AI engineering, LangChain, RAG pipelines, MLOps, React, Python, and software architecture.",
  keywords: ["AI engineering blog","LangChain tutorial","RAG guide","MLOps","software engineering articles","Python tutorials","React Next.js"],
  alternates: { canonical: "https://www.thevaibhavbansal.com/blog" },
  openGraph: {
    title: "Blog | Vaibhav Bansal",
    description: "Technical writing on AI, ML, LangChain, RAG, and full-stack software engineering.",
    url: "https://www.thevaibhavbansal.com/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <main className="pt-32 pb-24 max-w-5xl mx-auto px-6">
      <div className="mb-14">
        <span className="section-label">Writing</span>
        <h1 className="font-display text-5xl font-extrabold mt-2">
          Blog &{" "}
          <span style={{ background:"linear-gradient(120deg,#e8a838,#f4c96a)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
            & Videos
          </span>
        </h1>
        <p className="font-mono text-xs mt-3 text-[var(--text-muted)] max-w-xl">
          Articles, tutorials and YouTube videos on AI engineering, full-stack development, and software architecture.
        </p>
      </div>
      <BlogList posts={posts} />
    </main>
  );
}
